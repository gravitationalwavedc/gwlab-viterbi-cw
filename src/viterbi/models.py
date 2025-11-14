import datetime
import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone

from viterbi.utils.jobs.request_file_list import request_file_list
from viterbi.utils.jobs.request_job_status import request_job_status
from viterbi.utils.auth.is_ligo_user import is_ligo_user
from .variables import viterbi_parameters


class Label(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Label: {self.name}"

    @classmethod
    def all(cls):
        """
        Retrieves all labels

        :return: QuerySet of all Labels
        """
        return cls.objects.all()

    @classmethod
    def filter_by_name(cls, labels):
        """
        Filter all Labels by name in the provided labels

        :param labels: A list of strings representing the label names to match
        :return: QuerySet of filtered Labels
        """
        return cls.objects.filter(name__in=labels)


class ViterbiJob(models.Model):
    """
    ViterbiJob model
    """
    user_id = models.IntegerField()
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    creation_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)

    private = models.BooleanField(default=False)

    job_controller_id = models.IntegerField(default=None, blank=True, null=True)

    labels = models.ManyToManyField(Label)
    # is_ligo_job indicates if the job has been run using proprietary data. If running a real job with GWOSC, this will
    # be set to False, otherwise a real data job using channels other than GWOSC will result in this value being True
    is_ligo_job = models.BooleanField(default=False)

    class Meta:
        unique_together = (
            ('user_id', 'name'),
        )

    def __str__(self):
        return f"Viterbi Job: {self.name}"

    @property
    def job_status(self):
        return request_job_status(self)

    def get_file_list(self, path='', recursive=True):
        return request_file_list(self, path, recursive)

    def as_json(self):
        # Get the data container type for this job
        data = {
            "type": self.data.data_choice,
            "source": self.data.source_dataset
        }

        # Iterate over the data parameters
        for d in self.data_parameter.all():
            data[d.name] = d.value

        # Get the search parameters
        search = {}
        for s in self.search_parameter.all():
            search[s.name] = s.value

        return dict(
            name=self.name,
            description=self.description,
            data=data,
            search=search
        )

    @classmethod
    def get_by_id(cls, bid, user):
        """
        Get ViterbiJob by the provided id

        This function will raise an exception if:-
        * the job requested is a ligo job, but the user is not a ligo user
        * the job requested is private an not owned by the requesting user

        :param bid: The id of the ViterbiJob to return
        :param user: The GWCloudUser instance making the request
        :return: ViterbiJob
        """
        job = cls.objects.get(id=bid)

        # Ligo jobs may only be accessed by ligo users
        if job.is_ligo_job and not is_ligo_user(user):
            raise Exception("Permission Denied")

        # Users can only access the job if it is public or the user owns the job
        if job.private and user.id != job.user_id:
            raise Exception("Permission Denied")

        return job

    @classmethod
    def user_viterbi_job_filter(cls, qs, user_job_filter):
        """
        Used by UserViterbiJobFilter to filter only jobs owned by the requesting user

        :param qs: The UserViterbiJobFilter queryset
        :param user_job_filter: The UserViterbiJobFilter instance
        :return: The queryset filtered by the requesting user
        """
        return qs.filter(user_id=user_job_filter.request.user.id)

    @classmethod
    def public_viterbi_job_filter(cls, qs, public_job_filter):
        """
        Used by PublicViterbiJobFilter to filter only public jobs

        :param qs: The PublicViterbiJobFilter queryset
        :param public_job_filter: The PublicViterbiJobFilter instance
        :return: The queryset filtered by public jobs only
        """
        return qs.filter(private=False)

    @classmethod
    def viterbi_job_filter(cls, queryset, info):
        """
        Used by ViterbiJobNode to filter which jobs are visible to the requesting user.

        A user must be logged in to view any viterbi jobs
        A user who is not a ligo user can not view ligo jobs

        :param queryset: The ViterbiJobNode queryset
        :param info: The ViterbiJobNode queryset info object
        :return: queryset filtered by ligo jobs if required
        """
        if info.context.user.is_anonymous:
            raise Exception("You must be logged in to perform this action.")

        # Users may not view ligo jobs if they are not a ligo user
        if is_ligo_user(info.context.user):
            return queryset
        else:
            return queryset.exclude(is_ligo_job=True)


class Data(models.Model):
    """
    Model to store Data Source Information
    """
    job = models.OneToOneField(ViterbiJob, related_name='data', on_delete=models.CASCADE)

    data_choice = models.CharField(
        max_length=55,
        choices=viterbi_parameters.DATA_SOURCES,
        default=viterbi_parameters.REAL_DATA[0]
    )

    source_dataset = models.CharField(
        max_length=2,
        choices=viterbi_parameters.SOURCE_DATASETS,
        default=viterbi_parameters.O1[0],
        null=True,
        blank=True
    )

    def __str__(self):
        return '{} ({})'.format(self.data_choice, self.job.name)

    def as_json(self):
        return dict(
            id=self.id,
            value=dict(
                job=self.job.id,
                choice=self.data_choice,
                source=self.source_dataset
            ),
        )


class DataParameter(models.Model):
    """
    Model to Store Data Parameters.
    Serves for Real and Simulated Data parameters.
    """
    job = models.ForeignKey(ViterbiJob, related_name='data_parameter', on_delete=models.CASCADE)
    data = models.ForeignKey(Data, related_name='parameter', on_delete=models.CASCADE)

    name = models.CharField(max_length=55, blank=False, null=False)
    value = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return '{} - {} ({})'.format(self.name, self.value, self.data)


class FileDownloadToken(models.Model):
    """
    This model tracks files from job file lists which can be used to generate file download tokens from the job
    controller
    """
    # The job this token is for
    job = models.ForeignKey(ViterbiJob, on_delete=models.CASCADE, db_index=True)
    # The token sent to the client and used by the client to generate a file download token
    token = models.UUIDField(unique=True, default=uuid.uuid4, db_index=True)
    # The file path this token is for
    path = models.TextField()
    # When the token was created
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    @classmethod
    def get_by_token(cls, token):
        """
        Returns the instance matching the specified token, or None if expired or not found
        """
        # First prune any old tokens which may have expired
        cls.prune()

        # Next try to find the instance matching the specified token
        inst = cls.objects.filter(token=token)
        if not inst.exists():
            return None

        return inst.first()

    @classmethod
    def create(cls, job, paths):
        """
        Creates a bulk number of FileDownloadToken objects for a specific job and list of paths, and returns the
        created objects
        """
        data = [
            cls(
                job=job,
                path=p
            ) for p in paths
        ]

        return cls.objects.bulk_create(data)

    @classmethod
    def prune(cls):
        """
        Removes any expired tokens from the database
        """
        cls.objects.filter(
            created__lt=timezone.now() - datetime.timedelta(seconds=settings.FILE_DOWNLOAD_TOKEN_EXPIRY)
        ).delete()

    @classmethod
    def get_paths(cls, job, tokens):
        """
        Returns a list of paths from a list of tokens, any token that isn't found will have a path of None

        The resulting list, will have identical size and ordering to the provided list of tokens
        """
        # First prune any old tokens which may have expired
        cls.prune()

        # Get all objects matching the list of tokens
        objects = {
            str(rec.token): rec.path for rec in cls.objects.filter(job=job, token__in=tokens)
        }

        # Generate the list and return
        return [
            objects[str(tok)] if str(tok) in objects else None for tok in tokens
        ]


class Search(models.Model):
    """
    Search Container
    """
    job = models.OneToOneField(ViterbiJob, related_name='search', on_delete=models.CASCADE)


class SearchParameter(models.Model):
    """
    Model to Store Search Parameters.
    """
    job = models.ForeignKey(ViterbiJob, related_name='search_parameter', on_delete=models.CASCADE)
    search = models.ForeignKey(Search, related_name='parameter', on_delete=models.CASCADE)

    name = models.CharField(max_length=55, blank=False, null=False)
    value = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return '{} - {} ({})'.format(self.name, self.value, self.search)


class ViterbiSummaryResults(models.Model):
    job = models.OneToOneField(ViterbiJob, related_name='summary_result', on_delete=models.CASCADE)

    plot_data = models.TextField()
    table_data = models.TextField()
