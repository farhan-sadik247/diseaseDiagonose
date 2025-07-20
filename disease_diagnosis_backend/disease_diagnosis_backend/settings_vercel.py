import os
from .settings import *

# Vercel-specific settings
DEBUG = False

# Allowed hosts for Vercel
ALLOWED_HOSTS = [
    '.vercel.app',
    '.now.sh',
    'localhost',
    '127.0.0.1',
]

# Database configuration for Vercel (using SQLite for simplicity)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': '/tmp/db.sqlite3',
    }
}

# Static files configuration for Vercel
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# CORS settings for Vercel
CORS_ALLOWED_ORIGINS = [
    "https://*.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
]

CORS_ALLOW_ALL_ORIGINS = True  # For development, restrict in production

# Security settings
SECURE_SSL_REDIRECT = False  # Vercel handles SSL
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Disable Django's own staticfiles handling in production
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Media files (if needed)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
    },
}

# Secret key from environment variable
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-vercel-key-change-in-production')

# Time zone
USE_TZ = True
