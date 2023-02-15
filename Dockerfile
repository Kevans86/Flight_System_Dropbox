FROM node:alpine3.16 AS stage1
WORKDIR /frontend
COPY /frontend .
RUN npm install 
RUN npm run build


FROM python:3.9 
ENV PYTHONUNBUFFERED 1
WORKDIR /
COPY requirements.txt /
RUN pip install -r requirements.txt
COPY . .
COPY --from=stage1 /frontend/ ./frontend

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


