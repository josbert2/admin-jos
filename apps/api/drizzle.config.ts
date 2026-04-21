import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: ['../../.env', '.env'] });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'mysql://portfolio:portfolio@localhost:3307/portfolio',
  },
});
