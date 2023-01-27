import math
from .consts import (
    O1_START,
    O1_END,
    O2_START,
    O2_END,
    O3_START,
    O3_END
)


def source_dataset_from_time(time):
    time = float(time)
    if O1_START <= time <= O1_END:
        return 'o1'
    elif O2_START <= time <= O2_END:
        return 'o2'
    elif O3_START <= time <= O3_END:
        return 'o3'
    else:
        return None


def phase_from_p_tasc(p, tasc):
    return (math.tau * tasc / p) % math.tau
