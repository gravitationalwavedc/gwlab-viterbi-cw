import datetime
from unittest.mock import patch
from django.test import TestCase
from datetime import timedelta
from viterbi.utils.derive_job_running_time import derive_job_running_time, timedelta_to_string


class TestJobRunningTime(TestCase):
    def setUp(self):
        self.test_history = [
            {
                'details': 'Job has completed',
                'jobId': 1,
                'state': 500,
                'timestamp': '2022-01-01 00:03:00.000000 UTC',
                'what': '_job_completion_'
            },
            {
                'details': 'Job has terminated all processes on all nodes with an exit code of zero.',
                'jobId': 1,
                'state': 500,
                'timestamp': '2022-01-01 00:02:01.000000 UTC',
                'what': 'jid1'
            },
            {
                'details': 'Job currently has an allocation.',
                'jobId': 1,
                'state': 50,
                'timestamp': '2022-01-01 00:02:00.000000 UTC',
                'what': 'jid1'
            },
            {
                'details': 'Job has terminated all processes on all nodes with an exit code of zero.',
                'jobId': 1,
                'state': 500,
                'timestamp': '2022-01-01 00:01:01.000000 UTC',
                'what': 'jid0'
            },
            {
                'details': 'Job currently has an allocation.',
                'jobId': 1,
                'state': 50,
                'timestamp': '2022-01-01 00:01:00.000000 UTC',
                'what': 'jid0'
            },
            {
                'details': 'Completed',
                'jobId': 1,
                'state': 500,
                'timestamp': '2022-01-01 00:00:05.000000 UTC',
                'what': 'submit'
            },
            {
                'details': 'Job is awaiting resource allocation.',
                'jobId': 1,
                'state': 40,
                'timestamp': '2022-01-01 00:00:04.000000 UTC',
                'what': 'jid1'
            },
            {
                'details': 'Job is awaiting resource allocation.',
                'jobId': 1,
                'state': 40,
                'timestamp': '2022-01-01 00:00:03.000000 UTC',
                'what': 'jid0'
            },
            {
                'details': 'Completed',
                'jobId': 1,
                'state': 500,
                'timestamp': '2022-01-01 00:00:02.000000 UTC',
                'what': 'submit'
            },
            {
                'details': 'Job submitted successfully',
                'jobId': 1,
                'state': 30,
                'timestamp': '2022-01-01 00:00:01.000000 UTC',
                'what': 'system'
            },
            {
                'details': 'Job submitting',
                'jobId': 1,
                'state': 10,
                'timestamp': '2022-01-01 00:00:00.000000 UTC',
                'what': 'system'
            }
        ]

    @patch('viterbi.utils.derive_job_running_time.timedelta_to_string', return_value='2 minutes')
    def test_derive_job_running_time(self, mock_timedelta_to_string):
        """
        Check that derive_job_running_time correctly parses job history to derive running time
        """
        self.assertEqual(
            derive_job_running_time(self.test_history),
            '2 minutes'
        )
        mock_timedelta_to_string.assert_called_with(timedelta(minutes=2))

    @patch('viterbi.utils.derive_job_running_time.timedelta_to_string', return_value='9 minutes')
    @patch('viterbi.utils.derive_job_running_time.datetime', wraps=datetime.datetime)
    def test_derive_job_running_time_not_complete(self, mock_datetime, mock_timedelta_to_string):
        """
        Check that derive_job_running_time correctly parses job history to derive running time
        even if the job isn't completed
        """
        mock_datetime.now.return_value = datetime.datetime(2022, 1, 1, 0, 10, 0)
        self.assertEqual(
            derive_job_running_time(self.test_history[1:]),
            '9 minutes'
        )
        mock_timedelta_to_string.assert_called_with(timedelta(minutes=9))

    def test_derive_job_running_time_not_running(self):
        """
        Check that derive_job_running_time correctly returns None if job hasn't started running
        """
        self.assertIsNone(
            derive_job_running_time(self.test_history[-6:])
        )


class TestTimedeltaToString(TestCase):
    def setUp(self):
        self.test_data = [
            (timedelta(minutes=1), '1 minute'),
            (timedelta(minutes=2), '2 minutes'),
            (timedelta(hours=1), '1 hour'),
            (timedelta(hours=2), '2 hours'),
            (timedelta(days=1), '1 day'),
            (timedelta(days=2), '2 days'),
            (timedelta(hours=1, minutes=1), '1 hour and 1 minute'),
            (timedelta(hours=2, minutes=3), '2 hours and 3 minutes'),
            (timedelta(days=1, minutes=1), '1 day and 1 minute'),
            (timedelta(days=2, minutes=3), '2 days and 3 minutes'),
            (timedelta(days=1, hours=1), '1 day and 1 hour'),
            (timedelta(days=2, hours=3), '2 days and 3 hours'),
            (timedelta(days=1, hours=1, minutes=1), '1 day, 1 hour and 1 minute'),
            (timedelta(days=2, hours=3, minutes=4), '2 days, 3 hours and 4 minutes'),
        ]

    def test_derive_job_running_time(self):
        """
        Check that timedelta_to_string correctly converts timedelta to string
        """
        for delta_in, output in self.test_data:
            self.assertEqual(timedelta_to_string(delta_in), output)
