FROM python:3.10
LABEL maintainer="yaroslavsysoiev2000@gmail.com"

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

RUN mkdir -p /files/my_media /files/static

RUN adduser \
    --disabled-password \
    --no-create-home \
    my_user

RUN chown -R my_user /files/my_media && \
    chmod -R 755 /files/my_media

# USER my_user