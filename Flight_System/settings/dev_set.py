from .common import *
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-620w%=z3%fmo5vl=)bof1ot6+otsvtids=1sh0#vxt0i)+)uv2'
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
DROPBOX_APP_KEY = "4cv9c1playnm15w"
DROPBOX_APP_SECRET = "joc6sazfvtqh8zf"
DROPBOX_OAUTH2_REFRESH_TOKEN = "zoJ9u2LCWvUAAAAAAAAAAbDjSfrtNvjLqZag0G9QaNFJ35za7svtMaIPa04Lfn8-"
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

#Database
#https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}