import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma-common/schema.prisma',
  migrations: {
    path: 'prisma-common/migrations',
  },
  datasource: {
    url: env('DATABASE_COMMON_URL'),
  },
});
