from django.db import models

from viterbi.utils.jobs.request_file_download_id import request_file_download_id
from viterbi.utils.jobs.request_file_list import request_file_list
from viterbi.utils.jobs.request_job_status import request_job_status
from .variables import viterbi_parameters


class Label(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Label: {self.name}"


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

    job_id = models.IntegerField(default=None, blank=True, null=True)

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

    def get_file_download_id(self, path):
        return request_file_download_id(self, path)

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

