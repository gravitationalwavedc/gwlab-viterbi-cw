import responses
from unittest.mock import patch

from django.conf import settings
from django.contrib.auth import get_user_model

from viterbi.models import ViterbiJob
from viterbi.tests.testcases import ViterbiTestCase

from viterbi.utils.download_by_path import download_by_path

User = get_user_model()


def request_file_list_mock(*args, **kwargs):
    return True, [
        {'path': '/a/test/path.txt', 'isDir': False, 'fileSize': 12345},
        {'path': '/another/test.txt', 'isDir': False, 'fileSize': 123456},
        {'path': '/one/final_test.txt', 'isDir': False, 'fileSize': 1234567}
    ]


def request_file_download_ids_mock(*args, **kwargs):
    return True, [f"test_id{i}" for i in range(len(args[1]))]


@patch('viterbi.models.request_file_list', side_effect=request_file_list_mock)
@patch('viterbi.utils.download_by_path.request_file_download_ids', side_effect=request_file_download_ids_mock)
@patch("viterbi.utils.download_by_path.check_job_completed", return_value=True)
class TestDownloadByPath(ViterbiTestCase):
    def setUp(self):
        self.job = ViterbiJob.objects.create(
            user_id=1,
            name="Test1",
            job_controller_id=1,
            is_ligo_job=False
        )
        self.responses = responses.RequestsMock()
        self.responses.start()

        self.addCleanup(self.responses.stop)
        self.addCleanup(self.responses.reset)

    def test_no_paths(self, *args):
        paths = []

        files = download_by_path(self.job, paths)

        self.assertEqual(files, [])

    def test_no_matches(self, *args):
        paths = ['this_will_not_match.txt']

        files = download_by_path(self.job, paths)

        self.assertEqual(files, [])

    def test_download_by_path(self, *args):
        paths = ['path.txt']
        self.responses.add(
            responses.GET,
            settings.GWCLOUD_JOB_CONTROLLER_API_URL + '/file/?fileId=test_id0',
            body="body",
            status=200
        )

        files = download_by_path(self.job, paths)

        self.assertEqual(len(files), 1)

        self.assertEqual(files[0].text, "body")

    def test_download_by_paths(self, *args):
        paths = ['path.txt', 'final_test.txt']
        for i, path in enumerate(paths):
            self.responses.add(
                responses.GET,
                settings.GWCLOUD_JOB_CONTROLLER_API_URL + f'/file/?fileId=test_id{i}',
                body=f"body{i}",
                status=200
            )

        files = download_by_path(self.job, paths)

        self.assertEqual(len(files), 2)
        for i, f in enumerate(files):
            self.assertEqual(f.text, f"body{i}")
