from .base import *
import dj_database_url
from decouple import config

DEBUG = False

ALLOWED_HOSTS = [
    config('RAILWAY_PUBLIC_DOMAIN', default=''),
    '.railway.app',
    '.onrender.com',
]

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
    )
}

FRONTEND_URL = config('FRONTEND_URL', default='')

CORS_ALLOWED_ORIGINS = [FRONTEND_URL] if FRONTEND_URL else []
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"https://dental-scheduler.*\.vercel\.app",
    'https://dental-scheduler-1-db0l.onrender.com',
]
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_HEADERS = [
    'accept',
    'authorization',
    'content-type',
    'x-csrftoken',
    'x-requested-with',
]

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'

CSRF_TRUSTED_ORIGINS = [
    FRONTEND_URL,
    'https://dental-scheduler-bvay.onrender.com',
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')