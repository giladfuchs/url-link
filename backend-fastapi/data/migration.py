import os
import subprocess
from urllib.parse import unquote, urlparse

from common.config import DATABASE_URL_LOCAL, DATABASE_URL_PROD, conf


def normalize_url(u: str) -> str:
    return u.replace("postgresql+asyncpg", "postgresql")


db_source = normalize_url(DATABASE_URL_PROD)
db_target = normalize_url(DATABASE_URL_LOCAL)
db_target = normalize_url(conf.POSTGRES_DATABASE_URL)

dump_path = "dump.sql"


def split_url(u: str):
    p = urlparse(u)
    return {
        "user": unquote(p.username) if p.username else "postgres",
        "pwd": unquote(p.password) if p.password else "",
        "host": p.hostname or "localhost",
        "port": str(p.port or 5432),
        "db": p.path.lstrip("/") or "postgres",
    }


def run(cmd: list[str], env=None):
    e = os.environ.copy()
    if env:
        e.update(env)
    r = subprocess.run(cmd, env=e)
    if r.returncode != 0:
        raise SystemExit(f"Command failed: {' '.join(cmd)}")


def download_sql():
    s = split_url(db_source)
    env = {}
    if s["pwd"]:
        env["PGPASSWORD"] = s["pwd"]

    cmd = [
        "pg_dump",
        "-h",
        s["host"],
        "-p",
        s["port"],
        "-U",
        s["user"],
        "-d",
        s["db"],
        "--no-owner",
        "--no-privileges",
        "-f",
        dump_path,
    ]
    run(cmd, env)


def reset_target_schema():
    t = split_url(db_target)
    env = {}
    if t["pwd"]:
        env["PGPASSWORD"] = t["pwd"]

    cmd = [
        "psql",
        "-h",
        t["host"],
        "-p",
        t["port"],
        "-U",
        t["user"],
        "-d",
        t["db"],
        "-v",
        "ON_ERROR_STOP=1",
        "-c",
        "DROP SCHEMA IF EXISTS public CASCADE;",
        "-c",
        "CREATE SCHEMA public;",
    ]
    run(cmd, env)


def import_sql():
    t = split_url(db_target)
    env = {}
    if t["pwd"]:
        env["PGPASSWORD"] = t["pwd"]

    cmd = [
        "psql",
        "-h",
        t["host"],
        "-p",
        t["port"],
        "-U",
        t["user"],
        "-d",
        t["db"],
        "-v",
        "ON_ERROR_STOP=1",
        "-f",
        dump_path,
    ]
    run(cmd, env)


if __name__ == "__main__":
    download_sql()
    reset_target_schema()
    import_sql()
