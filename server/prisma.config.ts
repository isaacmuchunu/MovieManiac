import 'dotenv/config';
import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: path.join(import.meta.dirname, 'prisma', 'schema.prisma'),

  datasource: {
    url: env('DATABASE_URL'),
  },

  migrate: {
    url: env('DATABASE_URL'),
  },

  studio: {
    url: env('DATABASE_URL'),
  },
});
