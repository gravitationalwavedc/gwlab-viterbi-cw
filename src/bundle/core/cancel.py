from db import get_job_by_id
from scheduler.slurm import slurm_cancel, SLURM_STATUS
from scheduler.status import JobStatus
from pathlib import Path


def cancel(details, job_data):
    # Get the job
    job = get_job_by_id(details['scheduler_id'])
    if not job:
        # Job doesn't exist. Report error
        return False

    slurm_ids_file = Path(job['working_directory']) / 'submit' / 'slurm_ids'

    slurm_ids = [job['submit_id']]

    with open(slurm_ids_file) as f:
        for line in f.readlines():
            slurm_ids.append(line.split()[1])

    # Try to cancel the job and return the success status
    return all([slurm_cancel(sid) for sid in slurm_ids])
