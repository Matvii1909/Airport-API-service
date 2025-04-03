FROM python:3.10
LABEL maintainer="yaroslavsysoiev2000@gmail.com"

ENV PYTHONUNBUFFERED 1

WORKDIR app/

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
