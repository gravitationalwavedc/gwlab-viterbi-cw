import datetime
import json

import jwt
import requests
from django.conf import settings
from django.db import transaction

# from .forms import ViterbiJobForm
from .models import ViterbiJob, DataParameter, Label, SearchParameter, Data, Search, ViterbiSummaryResults
from .utils.jobs.request_file_download_id import request_file_download_ids
from .utils.check_job_completed import check_job_completed
from .utils.get_download_url import get_download_url


def create_viterbi_job(user, start, data, data_parameters, search_parameters):
    # validate_form = ViterbiJobForm(data={**start, **data, **signal, **sampler})
    # should be making use of cleaned_data below

    # Right now, it is not possible to create a non-ligo job
    if not user.is_ligo:
        raise Exception("User must be ligo")

    with transaction.atomic():
        viterbi_job = ViterbiJob(
            user_id=user.user_id,
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
                'userId': user.user_id,
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
            "cluster": "ozstar_gwlab",
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
        viterbi_job.job_controller_id = result["jobId"]
        viterbi_job.save()

        return viterbi_job


def update_viterbi_job(job_id, user, private=None, labels=None):
    viterbi_job = ViterbiJob.get_by_id(job_id, user)

    if user.user_id == viterbi_job.user_id:
        if labels is not None:
            viterbi_job.labels.set(Label.filter_by_name(labels))

        if private is not None:
            viterbi_job.private = private

        viterbi_job.save()

        return 'Job saved!'
    else:
        raise Exception('You must own the job to change the privacy!')


def candidates_to_table_data(job, candidate_file_data):
    logL_threshold = float(job.search_parameter.get(name='search_l_l_threshold').value)

    candidate_dicts = []
    for candidate_data in candidate_file_data.strip().split('\n'):
        candidate = candidate_data.split()
        candidate_dicts.append({
            'orbitPeriod': float(candidate[0]),
            'asini': float(candidate[1]),
            'orbitTp': float(candidate[2]),
            'logL': float(candidate[3]),
            'score': float(candidate[4]),
            'frequency': float(candidate[5]),
        })
    return {'candidates': candidate_dicts, 'logLThreshold': logL_threshold}


def path_to_plot_data(job, path_file_data):
    start_time = float(job.search_parameter.get(name='search_start_time').value)
    t_block = float(job.search_parameter.get(name='search_t_block').value)

    return [
        {'frequency': float(path_data), 'time': start_time + i*t_block}
        for i, path_data in enumerate(path_file_data.strip().split('\n'))
    ]

def get_viterbi_summary_results(job):
    # If job not completed, obviously don't bother
    if not check_job_completed(job):
        return None

    # If job has already had results model generated, return that
    if hasattr(job, 'summary_result'):
        return job.summary_result

    # Otherwise, generate results page data
    # Fetch the file list from the job controller
    success, files = job.get_file_list()
    if not success:
        raise Exception("Error getting file list. " + str(files))

    # Grab the candidates and best path files, and generate download ids
    candidate_file = next(filter(lambda f: 'results_a0_phase_loglikes_scores.dat' in f['path'], files))
    path_file = next(filter(lambda f: 'results_path.dat' in f['path'], files))
    paths = [candidate_file['path'], path_file['path']]
    success, f_ids = request_file_download_ids(job, paths)

    if not success:
        raise Exception(f_ids)

    # Download the files
    candidate_file_url = get_download_url(f_ids[0])
    path_file_url = get_download_url(f_ids[1])

    candidate_file_data = requests.get(candidate_file_url).text
    path_file_data = requests.get(path_file_url).text

    # Make results model so we don't need to download and process it every time the page is rendered
    results = ViterbiSummaryResults(
        job=job,
        table_data=json.dumps(candidates_to_table_data(job, candidate_file_data)),
        plot_data=json.dumps(path_to_plot_data(job, path_file_data))
    )
    results.save()

    return results
