import json
import logging

import responses
from django.test import TestCase
from django.conf import settings

from viterbi.models import ViterbiJob
from viterbi.utils.jobs.request_file_download_id import request_file_download_id, request_file_download_ids
from viterbi.tests.test_utils import silence_errors


class TestFileDownloadIds(TestCase):
    def setUp(self):
        self.responses = responses.RequestsMock()
        self.responses.start()

        self.addCleanup(self.responses.stop)
        self.addCleanup(self.responses.reset)

        self.job = ViterbiJob.objects.create(user_id=1234)

    @silence_errors
    def test_request_file_download_id(self):
        # Set up responses before any call to request
        # See https://github.com/getsentry/responses/pull/375
        self.responses.add(
            responses.POST,
            f"{settings.GWCLOUD_JOB_CONTROLLER_API_URL}/file/",
            status=400
        )

        return_result = 'val1'
        self.responses.add(
            responses.POST,
            f"{settings.GWCLOUD_JOB_CONTROLLER_API_URL}/file/",
            body=json.dumps({"fileIds": [return_result]}),
            status=200
        )

        # Test job not submitted
        self.job.job_controller_id = None
        self.job.save()

        result = request_file_download_id(self.job, 'test_path')

        self.assertEqual(result, (False, "Job not submitted"))

        # Test submitted job, invalid return code
        self.job.job_controller_id = 4321
        self.job.save()

        result = request_file_download_id(self.job, 'test_path')

        self.assertEqual(result, (False, "Error getting job file download url"))

        # Test submitted job, successful return
        self.job.job_controller_id = 4321
        self.job.save()

        result = request_file_download_id(self.job, 'test_path')

        self.assertEqual(result, (True, return_result))

    @silence_errors
    def test_request_file_download_ids(self):
        # Set up responses before any call to request
        # See https://github.com/getsentry/responses/pull/375
        self.responses.add(
            responses.POST,
            f"{settings.GWCLOUD_JOB_CONTROLLER_API_URL}/file/",
            status=400
        )

        return_result = ['val1', 'val2', 'val3']
        self.responses.add(
            responses.POST,
            f"{settings.GWCLOUD_JOB_CONTROLLER_API_URL}/file/",
            body=json.dumps({"fileIds": return_result}),
            status=200
        )

        # Test job not submitted
        self.job.job_controller_id = None
        self.job.save()

        result = request_file_download_ids(self.job, 'test_path')

        self.assertEqual(result, (False, "Job not submitted"))

        # Test submitted job, invalid return code
        self.job.job_controller_id = 4321
        self.job.save()

        result = request_file_download_ids(self.job, 'test_path')

        self.assertEqual(result, (False, "Error getting job file download url"))

        # Test submitted job, successful return
        self.job.job_controller_id = 4321
        self.job.save()

        result = request_file_download_ids(self.job, 'test_path')

        self.assertEqual(result, (True, return_result))
