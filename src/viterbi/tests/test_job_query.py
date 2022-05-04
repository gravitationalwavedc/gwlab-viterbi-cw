from django.contrib.auth import get_user_model

from graphql_relay.node.node import to_global_id
from viterbi.models import ViterbiJob, Label
from viterbi.tests.testcases import ViterbiTestCase
from unittest import mock

from humps import camelize
from datetime import datetime

User = get_user_model()


class TestQueriesWithAuthenticatedUser(ViterbiTestCase):
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
        self.client.authenticate(self.user)
        self.label = Label.objects.create(name="Test", description="Test description")
        self.job = ViterbiJob.objects.create(**self.job_data)
        self.job.labels.set([self.label])
        self.global_id = to_global_id("ViterbiJobNode", self.job.id)

        self.job_data.update({"id": "Vml0ZXJiaUpvYk5vZGU6MQ=="})

    def job_request(self, *fields):
        field_str = "\n".join(fields)
        return self.client.execute(
            f"""
            query {{
                viterbiJob(id:"{self.global_id}"){{
                    {field_str}
                }}
            }}
            """
        )

    def request_lookup_users_mock(*args, **kwargs):
        user = User.objects.first()
        if user:
            return True, [{
                'userId': user.id,
                'username': user.username,
                'firstName': user.first_name,
                'lastName': user.last_name
            }]
        return False, []

    def derive_job_status_mock(*args, **kwargs):
        return 1, "Test Status", datetime.fromtimestamp(0)

    def test_viterbi_job_query(self):
        """
        viterbiJob node query should allow querying of model fields"
        """

        response = self.job_request(
            *list(camelize(self.job_data).keys())
        )
        expected = {
            "viterbiJob": camelize(self.job_data)
        }
        self.assertDictEqual(
            expected, response.data, "viterbiJob query returned unexpected data."
        )

    @mock.patch('viterbi.schema.request_lookup_users', side_effect=request_lookup_users_mock)
    def test_viterbi_job_user_query(self, request_lookup_users_mock):
        """
        viterbiJob node query should allow querying of user field"
        """
        response = self.job_request("user")
        expected = {
            "viterbiJob": {
                "user": "buffy summers"
            }
        }
        self.assertDictEqual(
            expected, response.data, "viterbiJob query returned unexpected data."
        )

        # If it returns no user
        User.objects.first().delete()
        response = self.job_request("user")
        expected = {
            "viterbiJob": {
                "user": "Unknown User"
            }
        }
        self.assertDictEqual(
            expected, response.data, "viterbiJob query returned unexpected data."
        )

    @mock.patch('viterbi.schema.request_job_filter', return_value=(None, [{"history": None}]))
    @mock.patch('viterbi.schema.derive_job_status', side_effect=derive_job_status_mock)
    def test_viterbi_job_status_query(self, request_job_filter_mock, derive_job_status_mock):
        """
        viterbiJob node query should allow querying of job status field"
        """
        response = self.job_request("jobStatus {name \n number \n date}")
        expected = {
            "viterbiJob": {
                "jobStatus": {
                    "name": "Test Status",
                    "number": 1,
                    "date": datetime.fromtimestamp(0).strftime("%Y-%m-%d %H:%M:%S UTC")
                }
            }
        }
        self.assertDictEqual(
            expected, response.data, "viterbiJob query returned unexpected data."
        )

    def test_viterbi_job_start_query(self):
        """
        viterbiJob node query should allow querying of start field"
        """
        response = self.job_request("start {name \n description \n private}")
        expected = {
            "viterbiJob": {
                "start": {
                    "name": self.job.name,
                    "description": self.job.description,
                    "private": self.job.private
                }
            }
        }
        self.assertDictEqual(
            expected, response.data, "viterbiJob query returned unexpected data."
        )

    def test_viterbi_job_last_updated_query(self):
        """
        viterbiJob node query should allow querying of last updated field"
        """
        response = self.job_request("lastUpdated")
        expected = {
            "viterbiJob": {
                "lastUpdated": self.job.last_updated.strftime("%Y-%m-%d %H:%M:%S UTC")
            }
        }
        self.assertDictEqual(
            expected, response.data, "viterbiJob query returned unexpected data."
        )

    def test_viterbi_job_labels_query(self):
        """
        viterbiJob node query should allow querying of labels field"
        """
        response = self.job_request("labels {name \n description}")
        expected = {
            "viterbiJob": {
                "labels": [
                    {
                        "name": self.label.name,
                        "description": self.label.description
                    }
                ]
            }
        }
        self.assertDictEqual(
            expected, response.data, "viterbiJob query returned unexpected data."
        )
