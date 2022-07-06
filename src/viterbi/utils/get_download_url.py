from django.conf import settings


def get_download_url(file_id):
    """
    Get the URL to download the file from the file ID
    """
    if file_id:
        return settings.GWCLOUD_JOB_CONTROLLER_API_URL + '/file/?fileId=' + str(file_id)
    return None
