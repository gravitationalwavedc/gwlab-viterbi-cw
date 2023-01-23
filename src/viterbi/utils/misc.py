import math


def source_dataset_from_time(time):
    if 1126051217 <= time <= 1137254417:
        return 'o1'
    elif 1164556817 <= time <= 1187733618:
        return 'o2'
    elif 1238166018 <= time <= 1269363618:  # I believe this range covers O3a and O3b
        return 'o3'
    else:
        return None


def phase_from_p_tasc(p, tasc):
    return (math.tau * tasc / p) % math.tau
