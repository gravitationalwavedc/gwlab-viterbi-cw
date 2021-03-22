import datetime
import json

import jwt
import requests
from django.conf import settings
from django.db import transaction

# from .forms import ViterbiJobForm
from .models import ViterbiJob, DataParameter, Label, SearchParameter, Data, Search


def create_viterbi_job(user_id, start, data, data_parameters, search_parameters):
    # validate_form = ViterbiJobForm(data={**start, **data, **signal, **sampler})
    # should be making use of cleaned_data below

    with transaction.atomic():
        viterbi_job = ViterbiJob(
            user_id=user_id,
            name=start.name,
            description=start.description,
            private=start.private,
            is_ligo_job=True
        )
        viterbi_job.save()

        job_data = Data(
            job=viterbi_job,
            data_choice=data.data_choice,
            source_dataset=data.source_dataset
        )

        job_data.save()

        for key, val in data_parameters.items():
            DataParameter(job=viterbi_job, data=job_data, name=key, value=val).save()

        job_search = Search(
            job=viterbi_job,
        )

        job_search.save()

        for key, val in search_parameters.items():
            SearchParameter(job=viterbi_job, search=job_search, name=key, value=val).save()

        # Submit the job to the job controller

        # Create the jwt token
        jwt_enc = jwt.encode(
            {
                'userId': user_id,
                'exp': datetime.datetime.now() + datetime.timedelta(days=30)
            },
            settings.JOB_CONTROLLER_JWT_SECRET,
            algorithm='HS256'
        )

        # Create the parameter json
        params = viterbi_job.as_json()

        # Construct the request parameters to the job controller, note that parameters must be a string, not an objects
        data = {
            "parameters": json.dumps(params),
            "cluster": "ozstar",
            "bundle": "0992ae26454c2a9204718afed9dc7b3d11d9cbf8"
        }

        # Initiate the request to the job controller
        result = requests.request(
            "POST", settings.GWCLOUD_JOB_CONTROLLER_API_URL + "/job/",
            data=json.dumps(data),
            headers={
                "Authorization": jwt_enc
            }
        )

        # Check that the request was successful
        if result.status_code != 200:
            # Oops
            msg = f"Error submitting job, got error code: {result.status_code}\n\n{result.headers}\n\n{result.content}"
            print(msg)
            raise Exception(msg)

        print(f"Job submitted OK.\n{result.headers}\n\n{result.content}")

        # Parse the response from the job controller
        result = json.loads(result.content)

        # Save the job id
        viterbi_job.job_id = result["jobId"]
        viterbi_job.save()

        return viterbi_job.id


def update_viterbi_job(job_id, user_id, private=None, labels=None):
    viterbi_job = ViterbiJob.objects.get(id=job_id)

    if user_id == viterbi_job.user_id:
        if labels is not None:
            viterbi_job.labels.set(Label.objects.filter(name__in=labels))

        if private is not None:
            viterbi_job.private = private

        viterbi_job.save()

        return 'Job saved!'
    else:
        raise Exception('You must own the job to change the privacy!')
