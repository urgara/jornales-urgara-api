#!/bin/sh
set -e

echo "🚀 Starting NestJS application..."

# Wait for common database to be ready
echo "⏳ Waiting for common database to be ready..."
until node -e "
const { PrismaClient } = require('./generated/prisma-common');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_COMMON_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

prisma.\$connect()
  .then(() => {
    console.log('✅ Common database connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Common database connection failed:', err.message);
    process.exit(1);
  })
  .finally(() => {
    prisma.\$disconnect().then(() => pool.end());
  });
"; do
  echo "🔄 Common database not ready, retrying in 2 seconds..."
  sleep 2
done

# Wait for locality database to be ready
echo "⏳ Waiting for locality database to be ready..."
until node -e "
const { PrismaClient } = require('./generated/prisma-locality');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_LOCALITY_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

prisma.\$connect()
  .then(() => {
    console.log('✅ Locality database connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Locality database connection failed:', err.message);
    process.exit(1);
  })
  .finally(() => {
    prisma.\$disconnect().then(() => pool.end());
  });
"; do
  echo "🔄 Locality database not ready, retrying in 2 seconds..."
  sleep 2
done

# Run database migrations for common database
echo "🔄 Running common database migrations..."
pnpm run prisma:migrate:deploy:common

# Run database migrations for locality database
echo "🔄 Running locality database migrations..."
pnpm run prisma:migrate:deploy:locality

# Start the application
echo "🎯 Starting the application..."
exec node dist/main