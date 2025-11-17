import responses
from django.conf import settings
from django.contrib.auth import get_user_model

from graphql_relay.node.node import to_global_id
from viterbi.models import ViterbiJob
from viterbi.tests.testcases import ViterbiTestCase

User = get_user_model()


class TestJobCancellation(ViterbiTestCase):
    def setUp(self):
        self.job_data = {
            "name": "TestName",
            "user_id": 1,
            "description": "Test description",
            "job_controller_id": 1,
            "private": False,
            "is_ligo_job": False
        }

        self.user = User.objects.create(username="buffy", first_name="buffy", last_name="summers")
        self.authenticate(self.user)
        self.job = ViterbiJob.objects.create(**self.job_data)
        self.global_id = to_global_id("ViterbiJobNode", self.job.id)

        self.responses = responses.RequestsMock()
        self.responses.start()

        self.addCleanup(self.responses.stop)
        self.addCleanup(self.responses.reset)

    def test_cancel_job(self):
        self.responses.add(
            responses.PATCH,
            settings.GWCLOUD_JOB_CONTROLLER_API_URL + "/job/",
            body="true",
            status=200
        )

        params = {
            "input": {
                "jobId": self.global_id
            }
        }

        response = self.query(
            """
            mutation CancelJobMutation($input: CancelViterbiJobMutationInput!) {
                cancelViterbiJob(input: $input) {
                    result
                }
            }
            """,
            variables=params
        )

        expected = {
            'cancelViterbiJob': {
                'result': 'Job cancelled!'
            }
        }

        self.assertDictEqual(
            expected, response.json()['data'], "create ViterbiJob mutation returned unexpected data."
        )
