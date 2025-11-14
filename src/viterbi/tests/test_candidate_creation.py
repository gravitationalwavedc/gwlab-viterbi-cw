from unittest.mock import patch, Mock
import responses
from django.contrib.auth import get_user_model
from graphql_relay.node.node import to_global_id


from viterbi.tests.testcases import ViterbiTestCase
from viterbi.tests.test_utils import silence_errors
from viterbi.models import ViterbiJob
from viterbi.views import get_candidate_data, submit_candidates
from viterbi.utils.consts import O1_START
from viterbi.utils.misc import phase_from_p_tasc

User = get_user_model()


mock_job_json = {
    'name': 'TestJob',
    'description': 'Test description',
    'data': {
        'type': 'real',
        'source': 'o3',
        'start_frequency_band': '1',
        'min_start_time': O1_START,
        'max_start_time': '1',
        'asini': '1',
        'freq_band': '1',
        'alpha': '1',
        'delta': '1',
        'orbit_tp': '1',
        'orbit_period': '1',
        'drift_time': '1',
        'd_freq': '1'
    },
    'search': {
        'search_start_time': '1',
        'search_t_block': '1',
        'search_central_a0': '1',
        'search_a0_band': '1',
        'search_a0_bins': '1',
        'search_central_p': '1',
        'search_p_band': '1',
        'search_p_bins': '1',
        'search_central_orbit_tp': '1',
        'search_orbit_tp_band': '1',
        'search_orbit_tp_bins': '1',
        'search_l_l_threshold': '1'
    }
}

mock_candidate_data = """1.0 10.0 100.0 1000.0 10000.0 100000.0
2.0 20.0 200.0 2000.0 20000.0 200000.0
3.0 30.0 300.0 3000.0 30000.0 300000.0"""

mock_path_data = """1
2
3
4
5"""


class TestSubmitCandidates(ViterbiTestCase):
    @classmethod
    def setUpTestData(cls):
        cls.job = ViterbiJob.objects.create(
            user_id=1,
            name='TestJob',
            description='Test job description',
            private=False
        )

    def setUp(self):
        self.responses = responses.RequestsMock()
        self.responses.start()

        self.addCleanup(self.responses.stop)
        self.addCleanup(self.responses.reset)

    @patch("viterbi.views.download_by_path", return_value=[Mock(text=mock_candidate_data), Mock(text=mock_path_data)])
    @patch("viterbi.models.ViterbiJob.as_json", return_value=mock_job_json)
    def test_get_candidate_data(self, mock_as_json, mock_download_by_path):
        candidate_data = get_candidate_data(self.job)
        expected_data = [
            {
                'name': None,
                'description': None,
                'jobId': self.job.id,
                'source': {
                    'rightAscension': 1.,
                    'declination': 1.,
                    'frequency': i*100000.0,
                    'frequencyPath': [],
                    'isBinary': True,

                    'binary': {
                        'semiMajorAxis': i*10.0,
                        'orbitalPhase': phase_from_p_tasc(i*1.0, i*100.0),
                        'timeOfAscension': i*100.0,
                        'orbitalPeriod': i*1.0,
                        'orbitalEccentricity': 0,
                        'orbitalArgumentOfPeriapse': 0
                    }
                },
                'search': {
                    'module': 'viterbi',
                    'sourceDataset': 'o1',
                    'detectors': ['h1', 'l1', 'v1', 'k1'],
                    'startTime': float(O1_START),
                    'endTime': 1.,
                    'detectionStatistic': i*10000.0,

                    'other': {
                        'viterbi': {
                            'coherenceTime': 1.,
                            'likelihood': i*1000.0,
                            'score': i*10000.0,
                            'threshold': 1.
                        }
                    }
                }
            } for i in range(1, 4)
        ]
        expected_data[2]['source']['frequencyPath'] = [1.0, 2.0, 3.0, 4.0, 5.0]
        self.assertEqual(candidate_data, expected_data)

    @patch("viterbi.views.get_candidate_data", return_value="test_return")
    def test_submit_candidates(self, mock_get_candidate_data):
        self.responses.add(
            responses.POST,
            "http://localhost:8005/graphql",
            body='{"data":{"newCandidates":{"result":{"groupId":"test_id"}}}}',
            status=200
        )
        self.assertEqual(submit_candidates(self.job, "Bill Nye"), "test_id")
        mock_get_candidate_data.assert_called_with(self.job)
        self.assertEqual(len(self.responses.calls), 1)


class TestGenerateCandidatesMutation(ViterbiTestCase):
    @classmethod
    def setUpTestData(cls):
        cls.job = ViterbiJob.objects.create(
            user_id=1,
            name='TestJob',
            description='Test job description',
            private=False
        )

    def setUp(self):
        self.user = User.objects.create(username="billnye", first_name="Bill", last_name="Nye")

        self.query_string = """
            mutation JobHeadingGenerateCandidatesMutation($jobId: ID!) {
                generateCandidates(input: {jobId: $jobId}) {
                    groupId
                }
            }
        """

        self.variables = {
            "jobId": to_global_id("ViterbiJobNode", self.job.id)
        }

    @silence_errors
    @patch("viterbi.schema.submit_candidates", return_value='test_group_id')
    @patch("viterbi.schema.request_lookup_users", return_value=(True, [{'firstName': 'Bill', 'lastName': 'Nye'}]))
    def test_generate_candidates(self, *args):
        response = self.query(self.query_string, variables=self.variables)
        self.assertResponseHasErrors(response, "Mutation returned no errors even though user was not authenticated")

        self.authenticate(self.user)

        response = self.query(self.query_string, variables=self.variables)

        expected = {
            'generateCandidates': {
                'groupId': 'test_group_id'
            }
        }

        self.assertDictEqual(
            expected, response.json()['data'], "generate candidates mutation returned unexpected data."
        )

    @silence_errors
    @patch("viterbi.schema.submit_candidates")
    @patch("viterbi.schema.request_lookup_users", return_value=(False, []))
    def test_generate_candidates_no_user(self, *args):
        self.authenticate(self.user)

        response = self.query(self.query_string, variables=self.variables)
        self.assertResponseHasErrors(response, "Mutation returned no errors even though user was not found")
