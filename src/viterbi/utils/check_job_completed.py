from viterbi.status import JobStatus
from viterbi.utils.jobs.request_job_status import request_job_status


def check_job_completed(job):
    """
    Takes a ViterbiJob, queries the job controller and checks if that job is completed

    :param job: The ViterbiJob to check
    """
    _, history = request_job_status(job)
    job_completion_history = next(filter(lambda h: h['what'] == '_job_completion_', history), None)
    if not job_completion_history:
        return False

    if not job_completion_history['state'] == JobStatus.COMPLETED:
        return False

    return True
