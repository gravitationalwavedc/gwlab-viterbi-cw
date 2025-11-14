import os
from decouple import config

MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')
MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_ROOT_PASSWORD = os.getenv('MYSQL_ROOT_PASSWORD')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')

SECRET_KEY = config("SECRET_KEY")
JOB_CONTROLLER_JWT_SECRET = config("JOB_CONTROLLER_JWT_SECRET")
DB_SEARCH_SERVICE_JWT_SECRET = config("DB_SEARCH_JWT_SECRET_KEY")

ADACS_SSO_CLIENT_SECRET = config("ADACS_SSO_CLIENT_SECRET")

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': MYSQL_DATABASE,
        'HOST': MYSQL_HOST,
        'USER': MYSQL_USER,
        'PORT': 3306,
        'PASSWORD': MYSQL_PASSWORD,
    },
}
