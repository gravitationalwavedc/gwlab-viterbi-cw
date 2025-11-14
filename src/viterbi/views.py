import json
from datetime import datetime, timedelta

import jwt
import requests
from django.conf import settings
from django.db import transaction

# from .forms import ViterbiJobForm
from .models import ViterbiJob, DataParameter, Label, SearchParameter, Data, Search, ViterbiSummaryResults
from .utils.auth.is_ligo_user import is_ligo_user
from .utils.download_by_path import download_by_path
from .utils.misc import phase_from_p_tasc, source_dataset_from_time


def create_viterbi_job(user, start, data, data_parameters, search_parameters):
        # validate_form = ViterbiJobForm(data={**start, **data, **signal, **sampler})
    # should be making use of cleaned_data below

    # Right now, it is not possible to create a non-ligo job
    if not is_ligo_user(user):
        raise Exception("User must be ligo")

    with transaction.atomic():
        viterbi_job = ViterbiJob(
            user_id=user.id,
            name=start.name,
            description=start.description,
            private=start.private,
            is_ligo_job=getattr(user, 'is_ligo', False)  # Set based on user's LIGO status
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

        # Use data parameters to fill in search time and coherence time
        # This used to be in the forms, but the fields were somewhat doubled up
        # Fixing it here requires no changes to the bundle, nor the model json
        # It's also more easily reversible if needed
        SearchParameter(
            job=viterbi_job, search=job_search, name='search_start_time', value=data_parameters['min_start_time']
        ).save()
        SearchParameter(
            job=viterbi_job, search=job_search, name='search_t_block', value=data_parameters['drift_time']
        ).save()

        # Submit the job to the job controller

        # Create the jwt token
        jwt_enc = jwt.encode(
            {
                'userId': user.id,
                'exp': datetime.now() + timedelta(days=30)
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


def cancel_viterbi_job(job_id, user):
    viterbi_job = ViterbiJob.get_by_id(job_id, user)

    if not user.id == viterbi_job.user_id:
        raise Exception('You must own the job to cancel it!')

    # Create the jwt token
    jwt_enc = jwt.encode(
        {
            'userId': user.id,
            'exp': datetime.now() + timedelta(days=30)
        },
        settings.JOB_CONTROLLER_JWT_SECRET,
        algorithm='HS256'
    )

    # Construct the request parameters to the job controller, note that parameters must be a string, not an objects
    data = {
        "jobId": viterbi_job.job_controller_id
    }

    # Initiate the request to the job controller
    result = requests.request(
        "PATCH", settings.GWCLOUD_JOB_CONTROLLER_API_URL + "/job/",
        data=json.dumps(data),
        headers={
            "Authorization": jwt_enc
        }
    )

    # Check that the request was successful
    if result.status_code != 200:
        # Oops
        msg = f"Error cancelling job, got error code: {result.status_code}\n\n{result.headers}\n\n{result.content}"
        print(msg)
        raise Exception(msg)

    print(f"Job cancelled OK.\n{result.headers}\n\n{result.content}")

    return 'Job cancelled!'


def update_viterbi_job(job_id, user, private=None, labels=None):
    viterbi_job = ViterbiJob.get_by_id(job_id, user)

    if user.id == viterbi_job.user_id:
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
    # If job has already had results model generated, return that
    if hasattr(job, 'summary_result'):
        return job.summary_result

    # Download required results files
    files = download_by_path(job, ['results_a0_phase_loglikes_scores.dat', 'results_path.dat'])

    if not files:
        return None

    # Make results model so we don't need to download and process it every time the page is rendered
    results = ViterbiSummaryResults(
        job=job,
        table_data=json.dumps(candidates_to_table_data(job, files[0].text)),
        plot_data=json.dumps(path_to_plot_data(job, files[1].text))
    )
    results.save()

    return results


def get_candidate_data(job):
    files = download_by_path(job, ['results_a0_phase_loglikes_scores.dat', 'results_path.dat'])

    job_json = job.as_json()
    data, search = job_json['data'], job_json['search']

    source_dataset = source_dataset_from_time(float(data['min_start_time']))

    max_logl = 0
    candidates = []
    for i, candidate_data in enumerate(files[0].text.strip().split('\n')):
        candidate = candidate_data.split()
        candidates.append(
            {
                'name': None,
                'description': None,
                'jobId': job.id,
                'source': {
                    'rightAscension': float(data['alpha']),
                    'declination': float(data['delta']),
                    'frequency': float(candidate[5]),
                    'frequencyPath': [],
                    'isBinary': True,

                    'binary': {
                        'semiMajorAxis': float(candidate[1]),
                        'orbitalPhase': phase_from_p_tasc(float(candidate[0]), float(candidate[2])),
                        'timeOfAscension': float(candidate[2]),
                        'orbitalPeriod': float(candidate[0]),
                        'orbitalEccentricity': 0,
                        'orbitalArgumentOfPeriapse': 0
                    }
                },
                'search': {
                    'module': 'viterbi',
                    'sourceDataset': source_dataset,
                    'detectors': ['h1', 'l1', 'v1', 'k1'],
                    'startTime': float(data['min_start_time']),
                    'endTime': float(data['max_start_time']),
                    'detectionStatistic': float(candidate[4]),

                    'other': {
                        'viterbi': {
                            'coherenceTime': float(data['drift_time']),
                            'likelihood': float(candidate[3]),
                            'score': float(candidate[4]),
                            'threshold': float(search['search_l_l_threshold'])
                        }
                    }
                }
            }
        )

        if float(candidate[3]) > max_logl:
            max_logl = float(candidate[3])
            i_max_logl = i

    # Set best frequency path on candidate with maximum log-likelihood
    candidates[i_max_logl]['source']['frequencyPath'] = [float(freq) for freq in files[1].text.strip().split('\n')]

    return candidates


def submit_candidates(job, job_user, headers={}):
    query = """
        mutation NewCandidatesMutation($input: NewCandidatesMutationInput!) {
            newCandidates(input: $input) {
                result {
                    groupId
                }
            }
        }
    """

    variables = {
        "input": {
            "name": f"ViterbiGroup-{datetime.now().strftime('%H%M%S-%d%m%y')}",
            "description": f"This group of candidates comes from the results of the Viterbi job {job.name}, "
                           f"run by {job_user}.",
            "candidates": get_candidate_data(job)
        }
    }

    result = requests.request(
        method="POST",
        url=settings.GWLAB_GWCANDIDATE_GRAPHQL_URL,
        headers=headers,
        json={
            "query": query,
            "variables": variables
        }
    )

    return json.loads(result.content)['data']['newCandidates']['result']['groupId']
