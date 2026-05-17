"""
Fișier de configurație Django pentru proiectul 'core'.

Generat automat de Django 5.2.8.

Pentru mai multe informații, consultați:
https://docs.djangoproject.com/en/5.2/topics/settings/
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Secret key: din env în producție, fallback în dev ────────────────────────
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-te^p!0cl-w2pe=6a3=8bu63-@+)u)9o60&!&v#v*22^re#@spo'
)

# ── Debug: False în producție ─────────────────────────────────────────────────
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# ── Allowed hosts ─────────────────────────────────────────────────────────────
ALLOWED_HOSTS_ENV = os.environ.get('ALLOWED_HOSTS', '')
ALLOWED_HOSTS = ALLOWED_HOSTS_ENV.split(',') if ALLOWED_HOSTS_ENV else ['localhost', '127.0.0.1']


# Aplicații instalate - includ tanto Django-uri built-in cât și aplicații custom și third-party
INSTALLED_APPS = [
    "django.contrib.admin",        # Admin panel
    "django.contrib.auth",         # Sistem de autentificare
    "django.contrib.contenttypes", # Sistem de tip conținut
    "django.contrib.sessions",     # Gestionare sesiuni
    "django.contrib.messages",     # Sistem de mesaje flash
    "django.contrib.staticfiles",  # Gestionare fișiere statice (CSS, JS)
    "rest_framework",              # Django REST Framework pentru API
    "catalog",                     # Aplicația noastră cu produse, branduri, categorii
    "corsheaders",                 # Permisiuni CORS (cross-origin requests)
    "rest_framework_simplejwt",    # Autentificare JWT
    "rest_framework_simplejwt.token_blacklist", # Blacklist for logout
]

# Middleware-uri procesate în ordine pentru fiecare request/response
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # TREBUIE să fie PRIMUL! Procesează CORS
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # Servire fișiere statice în producție
    "django.contrib.sessions.middleware.SessionMiddleware",  # Gestionare sesiuni
    "django.middleware.common.CommonMiddleware",  # Setări comune
    "django.middleware.csrf.CsrfViewMiddleware",  # Protecție contra CSRF
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # Autentificare utilizatori
    "django.contrib.messages.middleware.MessageMiddleware",  # Sistem de mesaje
    "django.middleware.clickjacking.XFrameOptionsMiddleware",  # Protecție clickjacking
]

# CORS — în dev accept orice, în prod accept doar frontend-ul specificat
CORS_ALLOWED_ORIGINS_ENV = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if CORS_ALLOWED_ORIGINS_ENV:
    CORS_ALLOWED_ORIGINS = [o.strip() for o in CORS_ALLOWED_ORIGINS_ENV.split(',')]
else:
    CORS_ALLOW_ALL_ORIGINS = True  # dev only

# Fișierul cu rutele URL principale al aplicației
ROOT_URLCONF = "core.urls"


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Configurare bază de date
# Folosim SQLite pentru development (simplu și rapid)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Motorul bazei de date
        'NAME': BASE_DIR / 'db.sqlite3',         # Fișierul SQLite
    }
}


# Validatori pentru parole - asigură că parolele sunt suficient de sigure
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Setări de internacionalizare (limbă, fus orar)
LANGUAGE_CODE = 'en-us'  # Limba implicită
TIME_ZONE = 'UTC'         # Fus orar universal
USE_I18N = True           # Activează suport internacionalizare
USE_TZ = True             # Activează timezone-aware datetimes


# Configurare fișiere statice
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
# În producție (DEBUG=False) folosim whitenoise pentru servire statice
# În dev (DEBUG=True) Django servește static files direct — nu e nevoie de collectstatic
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Configurare media (upload-uri aleatorilor / poze de produse)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Tipul implicit de câmp primary key pentru noi modele (BigAutoField = 64-bit integer)
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Adaugă django-filter pentru funcționalitatea de filtrare în API
INSTALLED_APPS += ["django_filters"]

# Configurare Django REST Framework - backend-ul pentru API
# ── Email ────────────────────────────────────────────────────────────────────
_email_user = os.environ.get('EMAIL_HOST_USER', '')
if _email_user:
    EMAIL_BACKEND       = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST          = 'smtp.gmail.com'
    EMAIL_PORT          = 587
    EMAIL_USE_TLS       = True
    EMAIL_HOST_USER     = _email_user
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
    DEFAULT_FROM_EMAIL  = f'Far Beyond Gear <{_email_user}>'
else:
    # DEV fallback: emailurile apar în terminal
    EMAIL_BACKEND      = 'django.core.mail.backends.console.EmailBackend'
    DEFAULT_FROM_EMAIL = 'Far Beyond Gear <noreply@farbeyondgear.ro>'

REST_FRAMEWORK = {
    # Backend implicit pentru filtrare în viewsets
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    # Clasă de paginare implicită și dimensiune pagini
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,  # Implicit 10 articole per pagină
    # Autentificare implicită JWT
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    )
}


