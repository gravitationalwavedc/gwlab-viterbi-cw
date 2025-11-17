from .base import *

INSTALLED_APPS += ("corsheaders",)
# For requests to include credentials (i.e., http-only cookies) the
# CORS_ALLOWED_ORIGINS must not be ['*']
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_CREDENTIALS = True

MIDDLEWARE.append("corsheaders.middleware.CorsMiddleware")

SITE_URL = "http://localhost:3000"

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# If you're running the adacs-sso auth host on the same host (localhost)
# you'll want to change the SESSION_COOKIE_NAME, otherwise the sessions
# will overwrite one another
SESSION_COOKIE_NAME = "gwlab_viterbi_session"

# adacs-sso settings
ADACS_SSO_CLIENT_NAME = "gwlab_viterbi_dev"
ADACS_SSO_AUTH_HOST = "http://localhost:8000"
ADACS_SSO_CLIENT_SECRET = "gwlab_viterbi_dev_secret"

try:
    from .local import *
except:
    pass
