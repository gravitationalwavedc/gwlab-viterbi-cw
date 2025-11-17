from django.contrib.auth import get_user_model

from graphql_relay.node.node import to_global_id
from viterbi.models import ViterbiJob, ViterbiSummaryResults
from viterbi.tests.testcases import ViterbiTestCase
from viterbi.tests.test_utils import silence_errors
from unittest import mock

User = get_user_model()


class TestQueriesWithAuthenticatedUser(ViterbiTestCase):
    def setUp(self):
        self.user = User.objects.create(username="buffy", first_name="buffy", last_name="summers")

    def perform_db_search_mock(*args, **kwargs):
        return True, [
            {
                'user': {
                    'id': 1,
                    'firstName': 'buffy',
                    'lastName': 'summers'
                },
                'job': {
                    'id': 1,
                    'name': 'Test1',
                    'description': 'A test job'
                },
                'history': [{'state': 500, 'timestamp': '2020-01-01 12:00:00 UTC'}],
            },
            {
                'user': {
                    'id': 1,
                    'firstName': 'buffy',
                    'lastName': 'summers'
                },
                'job': {
                    'id': 2,
                    'name': 'Test2',
                    'description': ''
                },
                'history': [{'state': 500, 'timestamp': '2020-01-01 12:00:00 UTC'}],
            }
        ]

    @silence_errors
    def test_viterbi_job_query(self):
        """
        viterbiJob node query should return a single job for an autheniticated user."
        """
        job = ViterbiJob.objects.create(user_id=self.user.id)
        global_id = to_global_id("ViterbiJobNode", job.id)
        query = f"""
            query {{
                viterbiJob(id:"{global_id}"){{
                    id
                    userId
                }}
            }}
            """
        # Check fails without authenticated user
        response = self.query(query)
        self.assertResponseHasErrors(response, "Query returned no errors even though user was not authenticated")

        # Try again with authenticated user
        self.authenticate(self.user)
        response = self.query(query)
        expected = {
            "viterbiJob": {
                "id": "Vml0ZXJiaUpvYk5vZGU6MQ==",
                "userId": 1,
            }
        }
        self.assertDictEqual(
            expected, response.json()['data'], "viterbiJob query returned unexpected data."
        )

    @silence_errors
    def test_viterbi_jobs_query(self):
        """
        viterbiJobs query should return a list of personal jobs for an autheniticated user.
        """
        ViterbiJob.objects.create(
            user_id=self.user.id,
            name="Test1",
            job_controller_id=2,
            is_ligo_job=False
        )
        ViterbiJob.objects.create(
            user_id=self.user.id,
            name="Test2",
            job_controller_id=1,
            description="A test job",
            is_ligo_job=False
        )
        # This job shouldn't appear in the list because it belongs to another user.
        ViterbiJob.objects.create(user_id=4, name="Test3", job_controller_id=3)
        query = """
            query {
                viterbiJobs{
                    edges {
                        node {
                            userId
                            name
                            description
                        }
                    }
                }
            }
            """
        response = self.query(query)
        self.assertResponseHasErrors(response, "Query returned no errors even though user was not authenticated")

        # Try again with authenticated user
        self.authenticate(self.user)
        response = self.query(query)
        expected = {
            "viterbiJobs": {
                "edges": [
                    {"node": {"userId": 1, "name": "Test1", "description": None}},
                    {"node": {"userId": 1, "name": "Test2", "description": "A test job"}},
                ]
            }
        }
        self.assertDictEqual(
            response.json()['data'], expected, "viterbiJobs query returned unexpected data."
        )

    @silence_errors
    @mock.patch('viterbi.schema.perform_db_search', side_effect=perform_db_search_mock)
    def test_public_viterbi_jobs_query(self, perform_db_search):
        ViterbiJob.objects.create(
            user_id=self.user.id, name="Test1", description="first job", job_controller_id=2, private=False
        )
        ViterbiJob.objects.create(
            user_id=self.user.id, name="Test2", job_controller_id=1, description="A test job", private=False
        )
        # This job shouldn't appear in the list because it's private.
        ViterbiJob.objects.create(user_id=4, name="Test3", job_controller_id=3, private=True)
        query = """
            query {
                publicViterbiJobs(search:"", timeRange:"all") {
                    edges {
                        node {
                            user
                            description
                            name
                            jobStatus {
                                name
                            }
                            timestamp
                            id
                        }
                    }
                }
            }
            """
        response = self.query(query)
        self.assertResponseHasErrors(response, "Query returned no errors even though user was not authenticated")

        # Try again with authenticated user
        self.authenticate(self.user)
        response = self.query(query)
        expected = {
            'publicViterbiJobs': {
                'edges': [
                    {
                        'node': {
                            'description': 'A test job',
                            'id': 'Vml0ZXJiaUpvYk5vZGU6MQ==',
                            'name': 'Test1',
                            'jobStatus': {
                                'name': 'Completed'
                            },
                            'timestamp': '2020-01-01 12:00:00 UTC',
                            'user': 'buffy summers'
                        }
                    },
                    {
                        'node': {
                            'description': '',
                            'id': 'Vml0ZXJiaUpvYk5vZGU6Mg==',
                            'name': 'Test2',
                            'jobStatus': {
                                'name': 'Completed',
                            },
                            'timestamp': '2020-01-01 12:00:00 UTC',
                            'user': 'buffy summers'
                        }
                    }
                ]
            }
        }
        self.assertDictEqual(response.json()['data'], expected, "publicViterbiJobs query returned unexpected data.")

    @silence_errors
    @mock.patch('viterbi.schema.get_viterbi_summary_results')
    def test_viterbi_summary_results_query(self, get_viterbi_summary_results_mock):
        job = ViterbiJob.objects.create(user_id=self.user.id)
        test_table_data, test_plot_data = 'test_table_data', 'test_plot_data'
        vsr = ViterbiSummaryResults.objects.create(job=job, table_data=test_table_data, plot_data=test_plot_data)
        get_viterbi_summary_results_mock.return_value = vsr
        global_id = to_global_id("ViterbiJobNode", job.id)
        query = f"""
            query {{
                viterbiSummaryResults(jobId:"{global_id}"){{
                    tableData
                    plotData
                }}
            }}
            """
        response = self.query(query)
        self.assertResponseHasErrors(response, "Query returned no errors even though user was not authenticated")

        # Try again with authenticated user
        self.authenticate(self.user)
        response = self.query(query)
        expected = {
            'viterbiSummaryResults': {
                'tableData': test_table_data,
                'plotData': test_plot_data
            }
        }
        self.assertDictEqual(response.json()['data'], expected, "publicViterbiJobs query returned unexpected data.")
