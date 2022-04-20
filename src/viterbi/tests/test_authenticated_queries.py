import logging
import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone

from graphql_relay.node.node import to_global_id
from viterbi.models import ViterbiJob, FileDownloadToken
from viterbi.tests.testcases import ViterbiTestCase
from unittest import mock

User = get_user_model()


class TestQueriesWithAuthenticatedUser(ViterbiTestCase):
    def setUp(self):
        self.maxDiff = 9999

        self.user = User.objects.create(username="buffy", first_name="buffy", last_name="summers")
        self.client.authenticate(self.user)

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

    def request_lookup_users_mock(*args, **kwargs):
        return '', [{
            'userId': 1,
            'username': 'buffy',
            'lastName': 'summers',
            'firstName': 'buffy'
        }]

    def test_viterbi_job_query(self):
        """
        viterbiJob node query should return a single job for an autheniticated user."
        """
        job = ViterbiJob.objects.create(user_id=self.user.id)
        global_id = to_global_id("ViterbiJobNode", job.id)
        response = self.client.execute(
            f"""
            query {{
                viterbiJob(id:"{global_id}"){{
                    id
                    name
                    userId
                    description
                    jobControllerId
                    private
                    lastUpdated
                    start {{
                        name
                        description
                        private
                    }}
                }}
            }}
            """
        )
        expected = {
            "viterbiJob": {
                "id": "Vml0ZXJiaUpvYk5vZGU6MQ==",
                "name": "",
                "userId": 1,
                "description": None,
                "jobControllerId": None,
                "private": False,
                "lastUpdated": job.last_updated.strftime("%Y-%m-%d %H:%M:%S UTC"),
                "start": {"name": "", "description": None, "private": False},
            }
        }
        self.assertDictEqual(
            expected, response.data, "viterbiJob query returned unexpected data."
        )

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
        response = self.client.execute(
            """
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
        )
        expected = {
            "viterbiJobs": {
                "edges": [
                    {"node": {"userId": 1, "name": "Test1", "description": None}},
                    {
                        "node": {
                            "userId": 1,
                            "name": "Test2",
                            "description": "A test job",
                        }
                    },
                ]
            }
        }
        self.assertDictEqual(
            response.data, expected, "viterbiJobs query returned unexpected data."
        )

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
        response = self.client.execute(
           """
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
        )
        expected = {'publicViterbiJobs':
                    {'edges': [
                        {'node': {
                            'description': 'A test job',
                            'id': 'Vml0ZXJiaUpvYk5vZGU6MQ==',
                            'name': 'Test1',
                            'jobStatus': {
                                'name': 'Completed'
                            },
                            'timestamp': '2020-01-01 12:00:00 UTC',
                            'user': 'buffy summers'
                        }},
                        {'node': {
                            'description': '',
                            'id': 'Vml0ZXJiaUpvYk5vZGU6Mg==',
                            'name': 'Test2',
                            'jobStatus': {
                                'name': 'Completed',
                            },
                            'timestamp': '2020-01-01 12:00:00 UTC',
                            'user': 'buffy summers'
                        }}
                    ]}}
        self.assertDictEqual(response.data, expected, "publicViterbiJobs query returned unexpected data.")

    @mock.patch('viterbi.models.request_file_list', side_effect=request_file_list_mock)
    @mock.patch('viterbi.schema.request_file_download_ids', side_effect=request_file_download_ids_mock)
    def test_viterbi_result_files(self, request_file_list, request_file_download_ids_mock):
        """
        ViterbiResultFiles query should return a file object.
        """
        job = ViterbiJob.objects.create(
            user_id=self.user.id,
            name="Test1",
            description="first job",
            job_controller_id=2,
            private=False
        )
        global_id = to_global_id("ViterbiJobNode", job.id)

        try:
            logging.disable(logging.ERROR)

            # Check user must be authenticated
            self.client.authenticate(None)
            response = self.client.execute(
                f"""
                query {{
                    viterbiResultFiles (jobId: "{global_id}") {{
                        files {{
                            path
                            isDir
                            fileSize
                            downloadToken
                        }}
                    }}
                }}
                """
            )

            self.assertEqual(response.data['viterbiResultFiles'], None)
            self.assertEqual(str(response.errors[0]), "You do not have permission to perform this action")
        finally:
            logging.disable(logging.NOTSET)

        # Check authenticated user
        self.client.authenticate(self.user)

        response = self.client.execute(
            f"""
            query {{
                viterbiResultFiles (jobId: "{global_id}") {{
                    files {{
                        path
                        isDir
                        fileSize
                        downloadToken
                    }}
                }}
            }}
            """
        )

        files = [
            {'path': '/a', 'isDir': True, 'fileSize': "0"},
            {'path': '/a/path', 'isDir': True, 'fileSize': "0"},
            {'path': '/a/path/here2.txt', 'isDir': False, 'fileSize': "12345"},
            {'path': '/a/path/here3.txt', 'isDir': False, 'fileSize': "123456"},
            {'path': '/a/path/here4.txt', 'isDir': False, 'fileSize': "1234567"}
        ]

        for i, f in enumerate(files):
            if f['isDir']:
                files[i]['downloadToken'] = None
            else:
                files[i]['downloadToken'] = str(FileDownloadToken.objects.get(job=job, path=f['path']).token)

        expected = {
            'viterbiResultFiles': {
                'files': files
            }
        }
        self.assertDictEqual(response.data, expected)
        download_tokens = [f['downloadToken'] for f in filter(lambda x: not x['isDir'], files)]

        # Check user must be authenticated
        self.client.authenticate(None)
        try:
            logging.disable(logging.ERROR)

            response = self.client.execute(
                """
                    mutation ResultFileMutation($input: GenerateFileDownloadIdsInput!) {
                        generateFileDownloadIds(input: $input) {
                            result
                        }
                    }
                """,
                {
                    'input': {
                        'jobId': global_id,
                        'downloadTokens': [download_tokens[0]]
                    }
                }
            )

            self.assertEqual(response.data['generateFileDownloadIds'], None)
            self.assertEqual(str(response.errors[0]), "You do not have permission to perform this action")
        finally:
            logging.disable(logging.NOTSET)

        # Check authenticated user
        self.client.authenticate(self.user)
        response = self.client.execute(
            """
                mutation ResultFileMutation($input: GenerateFileDownloadIdsInput!) {
                    generateFileDownloadIds(input: $input) {
                        result
                    }
                }
            """,
            {
                'input': {
                    'jobId': global_id,
                    'downloadTokens': [download_tokens[0]]
                }
            }
        )

        # Make sure the regex is parsable
        self.assertEqual(len(response.data['generateFileDownloadIds']['result']), 1)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][0], version=4)

        response = self.client.execute(
            """
                mutation ResultFileMutation($input: GenerateFileDownloadIdsInput!) {
                    generateFileDownloadIds(input: $input) {
                        result
                    }
                }
            """,
            {
                'input': {
                    'jobId': global_id,
                    'downloadTokens': download_tokens
                }
            }
        )

        # Make sure the regex is parsable
        self.assertEqual(len(response.data['generateFileDownloadIds']['result']), 3)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][0], version=4)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][1], version=4)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][2], version=4)

        # Expire one of the FileDownloadTokens
        tk = FileDownloadToken.objects.all()[1]
        tk.created = timezone.now() - timezone.timedelta(seconds=settings.FILE_DOWNLOAD_TOKEN_EXPIRY + 1)
        tk.save()

        try:
            logging.disable(logging.ERROR)
            response = self.client.execute(
                """
                            mutation ResultFileMutation($input: GenerateFileDownloadIdsInput!) {
                                generateFileDownloadIds(input: $input) {
                                    result
                                }
                            }
                        """,
                {
                    'input': {
                        'jobId': global_id,
                        'downloadTokens': download_tokens
                    }
                }
            )

            self.assertEqual(response.data['generateFileDownloadIds'], None)
            self.assertEqual(str(response.errors[0]), "At least one token was invalid or expired.")
        finally:
            logging.disable(logging.NOTSET)
