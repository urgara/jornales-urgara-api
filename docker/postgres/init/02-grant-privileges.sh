#!/bin/bash
set -e

# Grant all privileges to the DATABASE_USER on all databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE urgara_jornales_api_prod TO "$POSTGRES_USER";
    GRANT ALL PRIVILEGES ON DATABASE urgara_jornales_api_dev TO "$POSTGRES_USER";
    GRANT ALL PRIVILEGES ON DATABASE urgara_jornales_api_test TO "$POSTGRES_USER";
EOSQL

echo "Database privileges granted to user: $POSTGRES_USER"
