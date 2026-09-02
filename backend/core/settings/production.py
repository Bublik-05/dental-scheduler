from .base import *
import dj_database_url
from decouple import config

DEBUG = False

ALLOWED_HOSTS = [
    config('RAILWAY_PUBLIC_DOMAIN', default=''),
    '.railway.app',
]

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
    )
}

FRONTEND_URL = config('FRONTEND_URL', default='')

CORS_ALLOWED_ORIGINS = [
    'https://dental-scheduler-seven.vercel.app',
    'https://dental-scheduler-98nzsa7zz-bublik-05s-projects.vercel.app',
]
CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SAMESITE = 'None'

CSRF_TRUSTED_ORIGINS = [
    FRONTEND_URL,
    'https://dental-scheduler-production-71a9.up.railway.app',
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
