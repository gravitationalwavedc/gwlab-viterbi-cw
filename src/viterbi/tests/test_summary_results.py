from django.test import TestCase
from unittest.mock import patch
import responses
import json

from viterbi.models import ViterbiJob, Search, SearchParameter, ViterbiSummaryResults
from viterbi.views import get_viterbi_summary_results, path_to_plot_data, candidates_to_table_data


class TestCandidateToTableData(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.job = ViterbiJob.objects.create(
            user_id=1,
            name='Test Job',
            description='Test job description',
            private=False
        )
        cls.search = Search.objects.create(job=cls.job)
        cls.search_param1 = SearchParameter.objects.create(
            job=cls.job,
            search=cls.search,
            name='search_l_l_threshold',
            value='1'
        )

    def setUp(self):
        self.candidate_data = "11 12 13 14 15 16\n21 22 23 24 25 26"
        self.table_data = {
            'candidates': [
                {
                    'orbit_period': 11,
                    'asini': 12,
                    'orbit_tp': 13,
                    'logL': 14,
                    'score': 15,
                    'candidate_frequency': 16,
                },
                {
                    'orbit_period': 21,
                    'asini': 22,
                    'orbit_tp': 23,
                    'logL': 24,
                    'score': 25,
                    'candidate_frequency': 26,
                }
            ],
            'logL_threshold': 1
        }

    def test_path_to_plot_data(self):
        """
        Check that get_viterbi_summary_results returns None if job is incomplete
        """
        table_data = candidates_to_table_data(self.job, self.candidate_data)
        self.assertDictEqual(table_data, self.table_data)


class TestPathToPlotData(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.job = ViterbiJob.objects.create(
            user_id=1,
            name='Test Job',
            description='Test job description',
            private=False
        )
        cls.search = Search.objects.create(job=cls.job)
        cls.search_param1 = SearchParameter.objects.create(
            job=cls.job,
            search=cls.search,
            name='search_start_time',
            value='1'
        )
        cls.search_param2 = SearchParameter.objects.create(
            job=cls.job,
            search=cls.search,
            name='search_t_block',
            value='2'
        )

    def setUp(self):
        self.path_data = "1\n2\n3\n4\n5"
        self.plot_data = {'frequency': [1, 2, 3, 4, 5], 'time': [1, 3, 5, 7, 9]}

    def test_path_to_plot_data(self):
        """
        Check that get_viterbi_summary_results returns None if job is incomplete
        """
        plot_data = path_to_plot_data(self.job, self.path_data)
        self.assertDictEqual(plot_data, self.plot_data)


@patch("viterbi.views.path_to_plot_data", return_value='plot_data')
@patch("viterbi.views.candidates_to_table_data", return_value='table_data')
@patch("viterbi.views.request_file_download_ids")
@patch("viterbi.views.ViterbiJob.get_file_list")
@patch("viterbi.views.check_job_completed", return_value=True)
class TestViterbiSummaryResults(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.job = ViterbiJob.objects.create(
            user_id=1,
            name='Test Job',
            description='Test job description',
            private=False
        )

    def setUp(self):
        self.responses = responses.RequestsMock()
        self.responses.start()

        self.addCleanup(self.responses.stop)
        self.addCleanup(self.responses.reset)

        self.test_id1, self.test_id2 = 'test_id1', 'test_id2'
        self.candidate_data, self.path_data = "candidate_data", "path_data"

    def test_job_not_completed(self, check_completed_mock, *args):
        """
        Check that get_viterbi_summary_results returns None if job is incomplete
        """
        check_completed_mock.return_value = False
        self.assertIsNone(get_viterbi_summary_results(self.job))
        check_completed_mock.assert_called_with(self.job)

    def test_summary_results_exist(self, check_completed_mock, *args):
        """
        Check that get_viterbi_summary_results returns an existing summary results instance
        """
        vsr = ViterbiSummaryResults.objects.create(
            job=self.job,
            table_data="Table Data",
            plot_data="Plot Data",
        )
        self.assertEqual(get_viterbi_summary_results(self.job), vsr)

    def test_summary_results_generated(self, check_completed_mock, file_list_mock, download_ids_mock, *args):
        """
        Check that get_viterbi_summary_results generates a ViterbiSummaryResults object
        and returns it if none already exist
        """
        file_list_mock.return_value = (True, [
            {'path': 'test/file/results_a0_phase_loglikes_scores.dat'},
            {'path': 'test/file/results_path.dat'},
        ])
        download_ids_mock.return_value = (True, [self.test_id1, self.test_id2])
        self.responses.add(
            responses.GET,
            f"https://gwcloud.org.au/job/apiv1/file/?fileId={self.test_id1}",
            body=self.candidate_data,
            status=200
        )
        self.responses.add(
            responses.GET,
            f"https://gwcloud.org.au/job/apiv1/file/?fileId={self.test_id2}",
            body=self.path_data,
            status=200
        )

        results = get_viterbi_summary_results(self.job)

        file_list_mock.assert_called()
        download_ids_mock.assert_called_with(self.job, [
            'test/file/results_a0_phase_loglikes_scores.dat',
            'test/file/results_path.dat'
        ])

        self.assertEqual(results, ViterbiSummaryResults.objects.first())
        self.assertEqual(json.loads(results.table_data), 'table_data')
        self.assertEqual(json.loads(results.plot_data), 'plot_data')
