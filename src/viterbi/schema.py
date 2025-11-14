from decimal import Decimal

import graphene
from django_filters import FilterSet, OrderingFilter
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from .utils.decorators import login_required
from graphql_relay.node.node import from_global_id, to_global_id

from .models import ViterbiJob, Label, Data, Search, FileDownloadToken, ViterbiSummaryResults
from .status import JobStatus
from .types import OutputStartType, JobStatusType, AbstractDataType, AbstractSearchType
from .utils.auth.lookup_users import request_lookup_users
from .utils.db_search.db_search import perform_db_search
from .utils.derive_job_status import derive_job_status
from .utils.derive_job_running_time import derive_job_running_time
from .utils.jobs.request_file_download_id import request_file_download_ids
from .utils.jobs.request_job_filter import request_job_filter
from .views import (
    create_viterbi_job,
    cancel_viterbi_job,
    update_viterbi_job,
    get_viterbi_summary_results,
    submit_candidates
)


def parameter_resolvers(name):
    def func(parent, info):
        try:
            param = parent.parameter.get(name=name)
            if param.value in ['true', 'True']:
                return True
            elif param.value in ['false', 'False']:
                return False
            else:
                return param.value

        except parent.parameter.model.DoesNotExist:
            return None

    return func


# Used to give values to fields in a DjangoObjectType, if the fields were not present in the Django model
# Specifically used here to get values from the parameter models
def populate_fields(object_to_modify, field_list, resolver_func):
    for name in field_list:
        setattr(object_to_modify, 'resolve_{}'.format(name), staticmethod(resolver_func(name)))


class LabelType(DjangoObjectType):
    class Meta:
        model = Label
        interfaces = (relay.Node,)


class UserViterbiJobFilter(FilterSet):
    class Meta:
        model = ViterbiJob
        fields = '__all__'

    order_by = OrderingFilter(
        fields=(
            ('last_updated', 'lastUpdated'),
            ('name', 'name'),
        )
    )

    @property
    def qs(self):
        return ViterbiJob.user_viterbi_job_filter(super(UserViterbiJobFilter, self).qs, self)


class PublicViterbiJobFilter(FilterSet):
    class Meta:
        model = ViterbiJob
        fields = '__all__'

    order_by = OrderingFilter(
        fields=(
            ('last_updated', 'last_updated'),
            ('name', 'name'),
        )
    )

    @property
    def qs(self):
        return ViterbiJob.public_viterbi_job_filter(super(PublicViterbiJobFilter, self).qs, self)


class ViterbiJobNode(DjangoObjectType):
    class Meta:
        model = ViterbiJob
        convert_choices_to_enum = False
        interfaces = (relay.Node,)

    user = graphene.String()
    job_status = graphene.Field(JobStatusType)
    job_running_time = graphene.String()
    last_updated = graphene.String()
    start = graphene.Field(OutputStartType)
    labels = graphene.List(LabelType)

    @classmethod
    def get_queryset(parent, queryset, info):
        return ViterbiJob.viterbi_job_filter(queryset, info)

    def resolve_user(parent, info):
        success, users = request_lookup_users([parent.user_id], info.context.user.id)
        if success and users:
            return f"{users[0]['firstName']} {users[0]['lastName']}"
        return "Unknown User"

    def resolve_last_updated(parent, info):
        return parent.last_updated.strftime("%Y-%m-%d %H:%M:%S UTC")

    def resolve_start(parent, info):
        return {
            "name": parent.name,
            "description": parent.description,
            "private": parent.private
        }

    def resolve_labels(parent, info):
        return parent.labels.all()

    def resolve_job_status(parent, info):
        try:
            # Get job details from the job controller
            _, jc_jobs = request_job_filter(
                info.context.user.id,
                ids=[parent.job_controller_id]
            )

            status_number, status_name, status_date = derive_job_status(jc_jobs[0]["history"])

            return {
                "name": status_name,
                "number": status_number,
                "date": status_date.strftime("%Y-%m-%d %H:%M:%S UTC")
            }
        except Exception as e:
            print(e)
            return {
                "name": "Unknown",
                "number": 0,
                "data": "Unknown"
            }

    def resolve_job_running_time(parent, info):
        try:
            # Get job details from the job controller
            _, jc_jobs = request_job_filter(
                info.context.user.id,
                ids=[parent.job_controller_id]
            )

            return derive_job_running_time(jc_jobs[0]["history"])
        except Exception as e:
            print(e)
            return "Unknown"


class DataType(DjangoObjectType, AbstractDataType):
    class Meta:
        model = Data
        interfaces = (relay.Node,)
        convert_choices_to_enum = False


populate_fields(
    DataType,
    [
        'start_frequency_band',
        'min_start_time',
        'max_start_time',
        'asini',
        'freq_band',
        'alpha',
        'delta',
        'orbit_tp',
        'orbit_period',
        'drift_time',
        'd_freq'
    ],
    parameter_resolvers
)


class SearchType(DjangoObjectType, AbstractSearchType):
    class Meta:
        model = Search
        interfaces = (relay.Node,)
        convert_choices_to_enum = False


populate_fields(
    SearchType,
    [
        'search_start_time',
        'search_t_block',
        'search_central_a0',
        'search_a0_band',
        'search_a0_bins',
        'search_central_p',
        'search_p_band',
        'search_p_bins',
        'search_central_orbit_tp',
        'search_orbit_tp_band',
        'search_orbit_tp_bins',
        'search_l_l_threshold',
    ],
    parameter_resolvers
)


class UserDetails(graphene.ObjectType):
    username = graphene.String()

    def resolve_username(parent, info):
        return "Todo"


class ViterbiResultFile(graphene.ObjectType):
    path = graphene.String()
    is_dir = graphene.Boolean()
    file_size = graphene.Decimal()
    download_token = graphene.String()


class ViterbiResultFiles(graphene.ObjectType):
    class Meta:
        interfaces = (relay.Node,)

    class Input:
        job_id = graphene.ID()

    files = graphene.List(ViterbiResultFile)


class ViterbiSummaryResultsType(DjangoObjectType):
    class Meta:
        model = ViterbiSummaryResults
        fields = ("table_data", "plot_data")

    class Input:
        job_id = graphene.ID()


class ViterbiPublicJobNode(graphene.ObjectType):
    user = graphene.String()
    name = graphene.String()
    job_status = graphene.Field(JobStatusType)
    labels = graphene.List(LabelType)
    description = graphene.String()
    timestamp = graphene.String()
    id = graphene.ID()


class ViterbiPublicJobConnection(relay.Connection):
    class Meta:
        node = ViterbiPublicJobNode


class Query(object):
    viterbi_job = relay.Node.Field(ViterbiJobNode)
    viterbi_jobs = DjangoFilterConnectionField(ViterbiJobNode, filterset_class=UserViterbiJobFilter)
    public_viterbi_jobs = relay.ConnectionField(
        ViterbiPublicJobConnection,
        search=graphene.String(),
        time_range=graphene.String()
    )

    all_labels = graphene.List(LabelType)

    viterbi_result_files = graphene.Field(ViterbiResultFiles, job_id=graphene.ID(required=True))
    viterbi_summary_results = graphene.Field(ViterbiSummaryResultsType, job_id=graphene.ID(required=True))

    gwclouduser = graphene.Field(UserDetails)

    @login_required
    def resolve_all_labels(self, info, **kwargs):
        return Label.all()

    @login_required
    def resolve_public_viterbi_jobs(self, info, **kwargs):
        # Perform the database search
        success, jobs = perform_db_search(info.context.user, kwargs)
        if not success:
            return []

        # Parse the result in to graphql objects
        result = []
        for job in jobs:
            result.append(
                ViterbiPublicJobNode(
                    user=f"{job['user']['firstName']} {job['user']['lastName']}",
                    name=job['job']['name'],
                    description=job['job']['description'],
                    job_status=JobStatusType(
                        name=JobStatus.display_name(job['history'][0]['state']),
                        number=job['history'][0]['state'],
                        date=job['history'][0]['timestamp']
                    ),
                    labels=ViterbiJob.get_by_id(job['job']['id'], info.context.user).labels.all(),
                    timestamp=job['history'][0]['timestamp'],
                    id=to_global_id("ViterbiJobNode", job['job']['id'])
                )
            )

        # Nb. The perform_db_search function currently requests one extra record than kwargs['first'].
        # This triggers the ArrayConnection used by returning the result array to correctly set
        # hasNextPage correctly, such that infinite scroll works as expected.
        return result

    @login_required
    def resolve_gwclouduser(self, info, **kwargs):
        return info.context.user

    @login_required
    def resolve_viterbi_result_files(self, info, **kwargs):
        # Get the model id of the viterbi job
        _, job_id = from_global_id(kwargs.get("job_id"))

        # Try to look up the job with the id provided
        job = ViterbiJob.get_by_id(job_id, info.context.user)

        # Fetch the file list from the job controller
        success, files = job.get_file_list()
        if not success:
            raise Exception("Error getting file list. " + str(files))

        # Generate download tokens for the list of files
        paths = [f['path'] for f in filter(lambda x: not x['isDir'], files)]
        tokens = FileDownloadToken.create(job, paths)

        # Generate a dict that can be used to query the generated tokens
        token_dict = {tk.path: tk.token for tk in tokens}

        # Build the resulting file list and send it back to the client
        result = [
            ViterbiResultFile(
                path=f["path"],
                is_dir=f["isDir"],
                file_size=Decimal(f["fileSize"]),
                download_token=token_dict.get(f["path"], None)
            )
            for f in files
        ]

        return ViterbiResultFiles(files=result)

    @login_required
    def resolve_viterbi_summary_results(self, info, **kwargs):
        # Get the model id of the viterbi job
        _, job_id = from_global_id(kwargs.get("job_id"))

        # Try to look up the job with the id provided
        job = ViterbiJob.get_by_id(job_id, info.context.user)
        return get_viterbi_summary_results(job)


class StartInput(graphene.InputObjectType):
    name = graphene.String()
    description = graphene.String()
    private = graphene.Boolean()


class DataInput(graphene.InputObjectType):
    data_choice = graphene.String()
    source_dataset = graphene.String()


class DataParametersInput(graphene.InputObjectType):
    start_frequency_band = graphene.String()
    min_start_time = graphene.String()
    max_start_time = graphene.String()
    asini = graphene.String()
    freq_band = graphene.String()
    alpha = graphene.String()
    delta = graphene.String()
    orbit_tp = graphene.String()
    orbit_period = graphene.String()
    drift_time = graphene.String()
    d_freq = graphene.String()


class SearchParametersInput(graphene.InputObjectType):
    search_start_time = graphene.String()
    search_t_block = graphene.String()
    search_central_a0 = graphene.String()
    search_a0_band = graphene.String()
    search_a0_bins = graphene.String()
    search_central_p = graphene.String()
    search_p_band = graphene.String()
    search_p_bins = graphene.String()
    search_central_orbit_tp = graphene.String()
    search_orbit_tp_band = graphene.String()
    search_orbit_tp_bins = graphene.String()
    search_l_l_threshold = graphene.String()


class ViterbiJobCreationResult(graphene.ObjectType):
    job_id = graphene.String()


class ViterbiJobMutation(relay.ClientIDMutation):
    class Input:
        start = StartInput()
        data = DataInput()
        data_parameters = DataParametersInput()
        search_parameters = SearchParametersInput()

    result = graphene.Field(ViterbiJobCreationResult)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, start, data, data_parameters, search_parameters):
        # Create the viterbi job
        viterbi_job = create_viterbi_job(info.context.user, start, data, data_parameters, search_parameters)

        # Convert the viterbi job id to a global id
        job_id = to_global_id("ViterbiJobNode", viterbi_job.id)

        # Return the viterbi job id to the client
        return ViterbiJobMutation(
            result=ViterbiJobCreationResult(job_id=job_id)
        )


class CancelViterbiJobMutation(relay.ClientIDMutation):
    class Input:
        job_id = graphene.ID(required=True)

    result = graphene.String()

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **kwargs):
        job_id = kwargs.pop("job_id")

        # Update privacy of viterbi job
        message = cancel_viterbi_job(from_global_id(job_id)[1], info.context.user, **kwargs)

        # Return the viterbi job id to the client
        return CancelViterbiJobMutation(
            result=message
        )


class UpdateViterbiJobMutation(relay.ClientIDMutation):
    class Input:
        job_id = graphene.ID(required=True)
        private = graphene.Boolean(required=False)
        labels = graphene.List(graphene.String, required=False)

    result = graphene.String()

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **kwargs):
        job_id = kwargs.pop("job_id")

        # Update privacy of viterbi job
        message = update_viterbi_job(from_global_id(job_id)[1], info.context.user, **kwargs)

        # Return the viterbi job id to the client
        return UpdateViterbiJobMutation(
            result=message
        )


class GenerateFileDownloadIds(relay.ClientIDMutation):
    class Input:
        job_id = graphene.ID(required=True)
        download_tokens = graphene.List(graphene.String, required=True)

    result = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, job_id, download_tokens):
        user = info.context.user

        # Get the job these file downloads are for
        job = ViterbiJob.get_by_id(from_global_id(job_id)[1], user)

        # Verify the download tokens and get the paths
        paths = FileDownloadToken.get_paths(job, download_tokens)

        # Check that all tokens were found
        if None in paths:
            raise GraphQLError("At least one token was invalid or expired.")

        # Request the list of file download ids from the list of paths
        # Only the original job author may generate a file download id
        success, result = request_file_download_ids(
            job,
            paths
        )

        # Report the error if there is one
        if not success:
            raise GraphQLError(result)

        # Return the list of file download ids
        return GenerateFileDownloadIds(
            result=result
        )


class GenerateCandidates(relay.ClientIDMutation):
    class Input:
        job_id = graphene.ID(required=True)

    group_id = graphene.ID()

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, job_id):
        user = info.context.user

        # Get the job the for which to collect candidate data
        job = ViterbiJob.get_by_id(from_global_id(job_id)[1], user)
        success, users = request_lookup_users([job.user_id], user.id)

        if not (success and users):
            raise Exception('Error getting job user.')

        group_id = submit_candidates(
            job,
            f"{users[0]['firstName']} {users[0]['lastName']}",
            headers=info.context.headers
        )

        # Return the list of file download ids
        return GenerateCandidates(
            group_id=group_id
        )


class Mutation(graphene.ObjectType):
    new_viterbi_job = ViterbiJobMutation.Field()
    cancel_viterbi_job = CancelViterbiJobMutation.Field()
    update_viterbi_job = UpdateViterbiJobMutation.Field()
    generate_file_download_ids = GenerateFileDownloadIds.Field()
    generate_candidates = GenerateCandidates.Field()
