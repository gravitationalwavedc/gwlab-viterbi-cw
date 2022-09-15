from datetime import datetime

from viterbi.status import JobStatus


def timedelta_to_string(delta):
    """
    Takes a datetime.timedelta object and outputs showing the days, hours and minutes

    :param delta: The timedelta object
    """
    total_seconds = int(delta.total_seconds())
    days, remainder = divmod(total_seconds, 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, _ = divmod(remainder, 60)

    time_strs = []
    if days:
        time_strs.append(f"{days} day{'s' if days!=1 else ''}")
    if hours:
        time_strs.append(f"{hours} hour{'s' if hours!=1 else ''}")
    if minutes:
        time_strs.append(f"{minutes} minute{'s' if minutes!=1 else ''}")

    if len(time_strs) > 1:
        return ', '.join(time_strs[:-1]) + ' and ' + time_strs[-1]
    elif len(time_strs) == 1:
        return time_strs[0]
    return None


def derive_job_running_time(history):
    """
    Takes a job history returned from the job controller and outputs
    a formatted string of how long the job has been running for

    :param history: The job history object returned from the job controller
    """
    history_items = [
        {
            "timestamp": datetime.strptime(h["timestamp"], '%Y-%m-%d %H:%M:%S.%f UTC'),
            "state": h["state"],
            "what": h["what"],
        } for h in history
    ]

    history_items.sort(key=lambda x: x["timestamp"])

    try:
        running_start = next(item["timestamp"] for item in history_items if item["state"] == JobStatus.RUNNING)
    except StopIteration:
        return None

    running_end = next(
        (item["timestamp"] for item in history_items if item["what"] == '_job_completion_'),
        datetime.now()
    )
    return timedelta_to_string(running_end-running_start)
