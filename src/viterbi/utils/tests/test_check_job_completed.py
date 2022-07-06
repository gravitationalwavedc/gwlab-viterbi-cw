from django.test import TestCase
from unittest.mock import patch

from viterbi.utils.check_job_completed import check_job_completed
from viterbi.models import ViterbiJob
from viterbi.status import JobStatus


@patch('viterbi.utils.check_job_completed.request_job_status')
class TestCandidateToTableData(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.job = ViterbiJob.objects.create(
            user_id=1,
            name='Test Job',
            description='Test job description',
            private=False
        )

    def setUp(self):
        self.test_history = [
            {'state': 500, 'what': '_job_completion_'},
            {'state': 500, 'what': 'jid1'},
            {'state': 50, 'what': 'jid1'},
            {'state': 500, 'what': 'jid0'},
            {'state': 50, 'what': 'jid0'},
            {'state': 40, 'what': 'jid1'},
            {'state': 40, 'what': 'jid0'},
            {'state': 500, 'what': 'submit'},
            {'state': 40, 'what': 'jid1'},
            {'state': 40, 'what': 'jid0'},
            {'state': 500, 'what': 'submit'},
            {'state': 30, 'what': 'system'},
            {'state': 10, 'what': 'system'}
        ]

    def test_job_incomplete(self, request_job_status_mock):
        """
        Check that check_job_completed returns False if job is incomplete
        """
        request_job_status_mock.return_value = (None, self.test_history[1:])
        self.assertFalse(check_job_completed(self.job))
        request_job_status_mock.assert_called_with(self.job)

    def test_job_error(self, request_job_status_mock):
        """
        Check that check_job_completed returns False if job is in error
        """
        self.test_history[0]['state'] = JobStatus.ERROR
        request_job_status_mock.return_value = (None, self.test_history)
        self.assertFalse(check_job_completed(self.job))
        request_job_status_mock.assert_called_with(self.job)

    def test_job_completed(self, request_job_status_mock):
        """
        Check that check_job_completed returns True if job is complete
        """
        request_job_status_mock.return_value = (None, self.test_history)
        self.assertTrue(check_job_completed(self.job))
        request_job_status_mock.assert_called_with(self.job)
