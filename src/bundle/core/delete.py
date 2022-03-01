import shutil

from core.misc import working_directory


def delete(details, job_data):
    # Make sure that the working directory is deleted if it exists
    try:
        shutil.rmtree(working_directory(details, job_data))
    except Exception:
        pass
