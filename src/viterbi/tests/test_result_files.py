import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from graphql_relay import to_global_id

from viterbi.models import FileDownloadToken, ViterbiJob
from viterbi.tests.test_utils import silence_errors
from viterbi.tests.testcases import ViterbiTestCase
from unittest import mock

User = get_user_model()


class TestResultFilesAndGenerateFileDownloadIds(ViterbiTestCase):
    def setUp(self):
        self.maxDiff = 9999

        self.user = User.objects.create(username="buffy", first_name="buffy", last_name="summers")
        self.client.authenticate(self.user)

        self.job = ViterbiJob.objects.create(
            user_id=self.user.id,
            name="Test1",
            description="first job",
            job_controller_id=2,
            private=False
        )
        self.global_id = to_global_id("ViterbiJobNode", self.job.id)

        self.files = [
            {'path': '/a', 'isDir': True, 'fileSize': "0"},
            {'path': '/a/path', 'isDir': True, 'fileSize': "0"},
            {'path': '/a/path/here2.txt', 'isDir': False, 'fileSize': "12345"},
            {'path': '/a/path/here3.txt', 'isDir': False, 'fileSize': "123456"},
            {'path': '/a/path/here4.txt', 'isDir': False, 'fileSize': "1234567"}
        ]

        self.query = f"""
            query {{
                viterbiResultFiles (jobId: "{self.global_id}") {{
                    files {{
                        path
                        isDir
                        fileSize
                        downloadToken
                    }}
                }}
            }}
        """

        self.mutation = """
            mutation ResultFileMutation($input: GenerateFileDownloadIdsInput!) {
                generateFileDownloadIds(input: $input) {
                    result
                }
            }
        """

    def request_file_list_mock(*args, **kwargs):
        return True, [
            {'path': '/a', 'isDir': True, 'fileSize': 0},
            {'path': '/a/path', 'isDir': True, 'fileSize': 0},
            {'path': '/a/path/here2.txt', 'isDir': False, 'fileSize': 12345},
            {'path': '/a/path/here3.txt', 'isDir': False, 'fileSize': 123456},
            {'path': '/a/path/here4.txt', 'isDir': False, 'fileSize': 1234567}
        ]

    def request_file_download_ids_mock(*args, **kwargs):
        return True, [uuid.uuid4() for _ in args[1]]

    @silence_errors
    @mock.patch('viterbi.models.request_file_list', side_effect=request_file_list_mock)
    @mock.patch('viterbi.schema.request_file_download_ids', side_effect=request_file_download_ids_mock)
    def test_viterbi_result_files(self, request_file_list, request_file_download_ids_mock):
        """
        ViterbiResultFiles query should return a file object.
        """
        # Check user must be authenticated
        self.client.authenticate(None)
        response = self.client.execute(self.query)

        self.assertEqual(response.data['viterbiResultFiles'], None)
        self.assertEqual(str(response.errors[0]), "You do not have permission to perform this action")

        # Check authenticated user
        self.client.authenticate(self.user)
        response = self.client.execute(self.query)

        for i, f in enumerate(self.files):
            if f['isDir']:
                self.files[i]['downloadToken'] = None
            else:
                self.files[i]['downloadToken'] = str(FileDownloadToken.objects.get(job=self.job, path=f['path']).token)

        expected = {
            'viterbiResultFiles': {
                'files': self.files
            }
        }
        self.assertDictEqual(response.data, expected)
        download_tokens = [f['downloadToken'] for f in filter(lambda x: not x['isDir'], self.files)]
        single_file_input = {
            'input': {
                'jobId': self.global_id,
                'downloadTokens': [download_tokens[0]]
            }
        }

        multi_file_input = {
            'input': {
                'jobId': self.global_id,
                'downloadTokens': download_tokens
            }
        }

        # Check user must be authenticated
        self.client.authenticate(None)
        response = self.client.execute(self.mutation, single_file_input)

        self.assertEqual(response.data['generateFileDownloadIds'], None)
        self.assertEqual(str(response.errors[0]), "You do not have permission to perform this action")

        # Check authenticated user
        self.client.authenticate(self.user)
        response = self.client.execute(self.mutation, single_file_input)

        # Make sure the regex is parsable
        self.assertEqual(len(response.data['generateFileDownloadIds']['result']), 1)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][0], version=4)

        response = self.client.execute(self.mutation, multi_file_input)

        # Make sure the regex is parsable
        self.assertEqual(len(response.data['generateFileDownloadIds']['result']), 3)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][0], version=4)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][1], version=4)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][2], version=4)

        # Expire one of the FileDownloadTokens
        tk = FileDownloadToken.objects.all()[1]
        tk.created = timezone.now() - timezone.timedelta(seconds=settings.FILE_DOWNLOAD_TOKEN_EXPIRY + 1)
        tk.save()

        response = self.client.execute(self.mutation, multi_file_input)

        self.assertEqual(response.data['generateFileDownloadIds'], None)
        self.assertEqual(str(response.errors[0]), "At least one token was invalid or expired.")
