from django.test import TestCase
from django.conf import settings

from viterbi.utils.get_download_url import get_download_url


class TestGetDownloadURL(TestCase):
    def test_get_download_url(self):
        """
        Check that get_download_url returns correct URL
        """
        self.assertEqual(
            get_download_url('testid'),
            settings.GWCLOUD_JOB_CONTROLLER_API_URL + '/file/?fileId=testid'
        )
        self.assertEqual(
            get_download_url(100),
            settings.GWCLOUD_JOB_CONTROLLER_API_URL + '/file/?fileId=100'
        )

    def test_get_download_url_none(self):
        """
        Check that get_download_url returns None if input is Falsy
        """
        self.assertEqual(
            get_download_url(None),
            None,
        )
