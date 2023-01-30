import requests
from .get_download_url import get_download_url
from .check_job_completed import check_job_completed
from .jobs.request_file_download_id import request_file_download_ids


def download_by_path(job, paths):
    # If job not completed, obviously don't bother
    if not check_job_completed(job):
        return None

    # Otherwise, generate results page data
    # Fetch the file list from the job controller
    success, files = job.get_file_list()
    if not success:
        raise Exception("Error getting file list. " + str(files))

    # Grab the candidates and best path files, and generate download ids
    full_paths = [f['path'] for f in filter(lambda f: any([path in f['path'] for path in paths]), files)]

    success, f_ids = request_file_download_ids(job, full_paths)

    if not success:
        raise Exception(f_ids)

    # Download the files
    return [requests.get(get_download_url(f_id)) for f_id in f_ids]
