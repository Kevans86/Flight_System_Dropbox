FROM python:3.9

ENV PYTHONUNBUFFERED 1

ENV SECRET_KEY = 'django-insecure-620w%=z3%fmo5vl=)bof1ot6+otsvtids=1sh0#vxt0i)+)uv2'
ENV DROPBOX_APP_KEY = "4cv9c1playnm15w"
ENV DROPBOX_APP_SECRET = "joc6sazfvtqh8zf"
ENV DROPBOX_OAUTH2_REFRESH_TOKEN = "zoJ9u2LCWvUAAAAAAAAAAbDjSfrtNvjLqZag0G9QaNFJ35za7svtMaIPa04Lfn8-"

WORKDIR /
COPY requirements.txt /
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000


# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]