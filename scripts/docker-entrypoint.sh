#!/bin/sh
set -e

echo "🚀 Starting NestJS application..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until node -e "
const { PrismaClient } = require('./generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

prisma.\$connect()
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Database connection failed:', err.message);
    process.exit(1);
  })
  .finally(() => {
    prisma.\$disconnect().then(() => pool.end());
  });
"; do
  echo "🔄 Database not ready, retrying in 2 seconds..."
  sleep 2
done

# Run database migrations
echo "🔄 Running database migrations..."
pnpm prisma migrate deploy

# Start the application
echo "🎯 Starting the application..."
exec node dist/main