import json

import responses
from django.conf import settings
from django.contrib.auth import get_user_model

from viterbi.models import ViterbiJob
from viterbi.tests.testcases import ViterbiTestCase

User = get_user_model()


class TestJobSubmission(ViterbiTestCase):
    def setUp(self):
        self.user = User.objects.create(username="buffy", first_name="buffy", last_name="summers")
        self.client.authenticate(self.user, is_ligo=True)

        self.responses = responses.RequestsMock()
        self.responses.start()

        self.addCleanup(self.responses.stop)
        self.addCleanup(self.responses.reset)

    def test_simulated_job(self):
        self.responses.add(
            responses.POST,
            settings.GWCLOUD_JOB_CONTROLLER_API_URL + "/job/",
            body=json.dumps({'jobId': 4321}),
            status=200
        )

        params = {
            "input": {
                "start": {
                    "name": "TestJob",
                    "description": "test job",
                    "private": False,
                },
                "data": {
                    "dataChoice": 'real',
                    "sourceDataset": 'o3',
                },
                "dataParameters": {
                    "startFrequencyBand": "188.0",
                    "minStartTime": "1238166483",
                    "maxStartTime": "1254582483",
                    "asini": "0.01844",
                    "freqBand": "1.2136296296296296",
                    "alpha": "4.974817413935078",
                    "delta": "-0.4349442914295658",
                    "orbitTp": "1238161512.786",
                    "orbitPeriod": "4995.263",
                    "driftTime": "864000",
                    "dFreq": "5.78703704e-07",
                },
                "searchParameters": {
                    "searchStartTime": "1238166483",
                    "searchTBlock": "864000",
                    "searchCentralA0": "0.01844",
                    "searchA0Band": "0.00012",
                    "searchA0Bins": "1",
                    "searchCentralP": "4995.263",
                    "searchPBand": "0.003",
                    "searchPBins": "1",
                    "searchCentralOrbitTp": "1238160263.9702501",
                    "searchOrbitTpBand": "260.8101737969591",
                    "searchOrbitTpBins": "9",
                    "searchLLThreshold": "296.27423"
                }
            }
        }

        response = self.client.execute(
            """
            mutation NewJobMutation($input: ViterbiJobMutationInput!) {
                newViterbiJob(input: $input) {
                    result {
                        jobId
                    }
                }
            }
            """,
            params
        )

        expected = {
            'newViterbiJob': {
                'result': {
                    'jobId': 'Vml0ZXJiaUpvYk5vZGU6MQ=='
                }
            }
        }

        self.assertDictEqual(
            expected, response.data, "create ViterbiJob mutation returned unexpected data."
        )

        job = ViterbiJob.objects.all().last()

        _params = params["input"]
        data = job.data
        data_param = job.data.parameter
        search_param = job.search.parameter

        self.assertEqual(job.name, _params['start']['name'])
        self.assertEqual(job.description, _params['start']['description'])
        self.assertEqual(job.private, _params['start']['private'])

        self.assertEqual(data.data_choice, _params['data']['dataChoice'])
        self.assertEqual(data.source_dataset, _params['data']['sourceDataset'])

        self.assertEqual(
            data_param.get(name='start_frequency_band').value,
            _params["dataParameters"]['startFrequencyBand']
        )
        self.assertEqual(
            data_param.get(name='min_start_time').value,
            _params["dataParameters"]['minStartTime']
        )
        self.assertEqual(
            data_param.get(name='max_start_time').value,
            _params["dataParameters"]['maxStartTime']
        )
        self.assertEqual(
            data_param.get(name='asini').value,
            _params["dataParameters"]['asini']
        )
        self.assertEqual(
            data_param.get(name='freq_band').value,
            _params["dataParameters"]['freqBand']
        )
        self.assertEqual(
            data_param.get(name='alpha').value,
            _params["dataParameters"]['alpha']
        )
        self.assertEqual(
            data_param.get(name='delta').value,
            _params["dataParameters"]['delta']
        )
        self.assertEqual(
            data_param.get(name='orbit_tp').value,
            _params["dataParameters"]['orbitTp']
        )
        self.assertEqual(
            data_param.get(name='orbit_period').value,
            _params["dataParameters"]['orbitPeriod']
        )
        self.assertEqual(
            data_param.get(name='drift_time').value,
            _params["dataParameters"]['driftTime']
        )
        self.assertEqual(
            data_param.get(name='d_freq').value,
            _params["dataParameters"]['dFreq']
        )

        self.assertEqual(
            search_param.get(name='search_start_time').value,
            _params["searchParameters"]['searchStartTime']
        )
        self.assertEqual(
            search_param.get(name='search_t_block').value,
            _params["searchParameters"]['searchTBlock']
        )
        self.assertEqual(
            search_param.get(name='search_central_a0').value,
            _params["searchParameters"]['searchCentralA0']
        )
        self.assertEqual(
            search_param.get(name='search_a0_band').value,
            _params["searchParameters"]['searchA0Band']
        )
        self.assertEqual(
            search_param.get(name='search_a0_bins').value,
            _params["searchParameters"]['searchA0Bins']
        )
        self.assertEqual(
            search_param.get(name='search_central_p').value,
            _params["searchParameters"]['searchCentralP']
        )
        self.assertEqual(
            search_param.get(name='search_p_band').value,
            _params["searchParameters"]['searchPBand']
        )
        self.assertEqual(
            search_param.get(name='search_p_bins').value,
            _params["searchParameters"]['searchPBins']
        )
        self.assertEqual(
            search_param.get(name='search_central_orbit_tp').value,
            _params["searchParameters"]['searchCentralOrbitTp']
        )
        self.assertEqual(
            search_param.get(name='search_orbit_tp_band').value,
            _params["searchParameters"]['searchOrbitTpBand']
        )
        self.assertEqual(
            search_param.get(name='search_orbit_tp_bins').value,
            _params["searchParameters"]['searchOrbitTpBins']
        )
        self.assertEqual(
            search_param.get(name='search_l_l_threshold').value,
            _params["searchParameters"]['searchLLThreshold']
        )
