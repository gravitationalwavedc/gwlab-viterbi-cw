from graphene import AbstractType, ObjectType, Int, String, Boolean


class OutputStartType(ObjectType):
    name = String()
    description = String()
    private = Boolean()


class AbstractDataType(AbstractType):
    data_type = String()
    source_dataset = String()
    start_time = String()
    duration = String()
    h0 = String()
    a0 = String()
    orbit_tp = String()
    signal_frequency = String()
    psi = String()
    cosi = String()
    alpha = String()
    delta = String()
    orbit_period = String()
    rand_seed = String()
    ifo = String()
    noise_level = String()


class AbstractSearchType(AbstractType):
    frequency = String()
    band = String()
    a0_start = String()
    a0_end = String()
    a0_bins = String()
    orbit_tp_start = String()
    orbit_tp_end = String()
    orbit_tp_bins = String()
    alpha_search = String()
    delta_search = String()
    orbit_period_search = String()


class JobStatusType(ObjectType):
    name = String()
    number = Int()
    date = String()
