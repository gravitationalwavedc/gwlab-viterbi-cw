from django.test import TestCase

from gw_viterbi.jwt_tools import GWCloudUser
from viterbi.models import ViterbiJob, Data, Label
from viterbi.variables import viterbi_parameters
from viterbi.views import update_viterbi_job


class TestViterbiJobModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.job = ViterbiJob.objects.create(
            user_id=1,
            name='Test Job',
            description='Test job description',
            private=False
        )
        cls.job.save()

    def test_update_privacy(self):
        """
        Check that update_viterbi_job view can update privacy of a job
        """
        self.assertEqual(self.job.private, False)

        user = GWCloudUser('bill')
        user.user_id = 1

        update_viterbi_job(self.job.id, user, True, [])

        self.job.refresh_from_db()
        self.assertEqual(self.job.private, True)

    def test_update_labels(self):
        """
        Check that update_viterbi_job view can update job labels
        """

        self.assertFalse(self.job.labels.exists())

        user = GWCloudUser('bill')
        user.user_id = 1

        update_viterbi_job(self.job.id, user, False, ['Bad Run', 'Review Requested'])

        self.job.refresh_from_db()
        self.assertQuerysetEqual(
            self.job.labels.all(),
            list(map(repr, Label.objects.filter(name__in=['Bad Run', 'Review Requested']))),
            ordered=False
        )


class TestModels(TestCase):
    def test_data_to_json(self):
        """
        Check that a Data object can be successfully converted to json
        """

        job = ViterbiJob(user_id=1)
        job.save()

        data = Data(job=job, data_choice=viterbi_parameters.FAKE_DATA[0])
        data.save()

        self.assertDictEqual(data.as_json(), {
            "id": data.id,
            "value": {
                "job": job.id,
                "choice": viterbi_parameters.FAKE_DATA[0],
                "source": "o1"
            }
        })
