from .base import *

DEBUG = False

SITE_URL = "https://gwlab.org.au"

STATIC_URL = "/viterbi/static/"

ALLOWED_HOSTS = ['*']

EMAIL_HOST = 'mail.swin.edu.au'
EMAIL_PORT = 25

GWCLOUD_JOB_CONTROLLER_API_URL = "http://gwcloud-job-server:8000/job/apiv1"
GWCLOUD_AUTH_API_URL = "http://gwcloud-auth:8000/auth/graphql"

try:
    from .environment import *
except ImportError:
    pass
