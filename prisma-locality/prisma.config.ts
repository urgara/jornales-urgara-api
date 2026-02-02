import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma-locality/schema.prisma',
  migrations: {
    path: 'prisma-locality/migrations',
  },
  datasource: {
    url: env('DATABASE_LOCALITY_URL'),
  },
});
