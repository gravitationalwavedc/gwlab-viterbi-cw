from types import SimpleNamespace

viterbi_parameters = SimpleNamespace()

viterbi_parameters.FAKE_DATA = ["simulated", "Simulated"]
viterbi_parameters.REAL_DATA = ["real", "Real"]

viterbi_parameters.DATA_SOURCES = [
    viterbi_parameters.FAKE_DATA,
    viterbi_parameters.REAL_DATA
]

viterbi_parameters.O1 = ["o1", "O1"]
viterbi_parameters.O2 = ["o2", "O2"]
viterbi_parameters.O3 = ["o3", "O3"]

viterbi_parameters.SOURCE_DATASETS = [
    viterbi_parameters.O1,
    viterbi_parameters.O2,
    viterbi_parameters.O3
]
