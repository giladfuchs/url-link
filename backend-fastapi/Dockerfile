FROM python:3.14-slim-bookworm

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn","main:app","-k","uvicorn.workers.UvicornWorker","-w","1","-b","0.0.0.0:80","--access-logfile","-","--error-logfile","-","--log-level","info","--timeout","120","--graceful-timeout","30","--keep-alive","5"]


# ---------------------------------------------------------------
# Local Postgres run command for reference:
#
# docker run --name url-link-pg \
#   -e POSTGRES_USER=admin \
#   -e POSTGRES_PASSWORD=admin \
#   -p 5437:5432 \
#   -v url_link_pgdata:/var/lib/postgresql/data \
#   -e POSTGRES_INITDB_ARGS="--locale-provider=libc --locale=C.UTF-8" \
#   -d postgres:17
# ---------------------------------------------------------------