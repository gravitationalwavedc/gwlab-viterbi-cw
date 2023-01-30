import math
from django.test import TestCase

from viterbi.utils.misc import source_dataset_from_time, phase_from_p_tasc


class TestMisc(TestCase):
    def test_source_dataset_from_time(self):
        """
        Check that get_download_url returns correct URL
        """
        self.assertIsNone(source_dataset_from_time(0))

        self.assertIsNone(source_dataset_from_time(1126051216))
        self.assertEqual(source_dataset_from_time(1126051217), 'o1')
        self.assertEqual(source_dataset_from_time(1131652817), 'o1')
        self.assertEqual(source_dataset_from_time(1137254417), 'o1')
        self.assertIsNone(source_dataset_from_time(1137254418))

        self.assertIsNone(source_dataset_from_time(1164556816))
        self.assertEqual(source_dataset_from_time(1164556817), 'o2')
        self.assertEqual(source_dataset_from_time(1176145217), 'o2')
        self.assertEqual(source_dataset_from_time(1187733618), 'o2')
        self.assertIsNone(source_dataset_from_time(1187733619))

        self.assertIsNone(source_dataset_from_time(1238166017))
        self.assertEqual(source_dataset_from_time(1238166018), 'o3')
        self.assertEqual(source_dataset_from_time(1253764818), 'o3')
        self.assertEqual(source_dataset_from_time(1269363618), 'o3')
        self.assertIsNone(source_dataset_from_time(1269363619))

    def test_phase_from_p_tasc(self):
        """
        Check that get_download_url returns None if input is Falsy
        """
        self.assertEqual(phase_from_p_tasc(1, 1), 0)
        self.assertEqual(phase_from_p_tasc(2, 1), math.pi)
        self.assertEqual(phase_from_p_tasc(2, 3), math.pi)
        self.assertEqual(phase_from_p_tasc(4, 1), 0.5*math.pi)
