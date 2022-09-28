from db import get_job_by_id
from scheduler.slurm import slurm_cancel
from pathlib import Path


def cancel(details, job_data):
    # Get the job
    job = get_job_by_id(details['scheduler_id'])
    if not job:
        # Job doesn't exist. Report error
        return False

    slurm_cancel(job['submit_id'])

    slurm_ids_file = Path(job['working_directory']) / 'submit' / 'slurm_ids'

    with open(slurm_ids_file) as f:
        for line in f.readlines():
            slurm_cancel(line.split()[1])

    return True
