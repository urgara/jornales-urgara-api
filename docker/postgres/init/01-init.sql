-- PostgreSQL initialization script for Urgara Jornales API
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist
-- Note: The database is already created by the POSTGRES_DB environment variable
-- This script is for any additional setup needed

-- Set timezone
SET timezone = 'UTC';

-- Create indexes that might be needed before Prisma migrations
-- These will be created by Prisma migrations, but including here for reference

-- Add comments to the databases (connect to each one to add comments)
\c urgara_jornales_api_prod
COMMENT ON DATABASE urgara_jornales_api_prod IS 'Urgara Jornales API Production Database';

\c urgara_jornales_api_dev
COMMENT ON DATABASE urgara_jornales_api_dev IS 'Urgara Jornales API Development Database';

\c urgara_jornales_api_test
COMMENT ON DATABASE urgara_jornales_api_test IS 'Urgara Jornales API Test Database';
