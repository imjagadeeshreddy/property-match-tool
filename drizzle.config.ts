import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Read .env.local first so the CLI uses the same database as `next dev`.
config({ path: '.env.local' });

const url = process.env.DATABASE_URL ?? 'file:./data/plot-match.db';

// A local file uses the plain sqlite driver; a hosted libSQL (Turso) URL
// needs the turso dialect so the auth token is sent.
const isRemote = url.startsWith('libsql://') || url.startsWith('https://');

export default defineConfig(
  isRemote
    ? {
        schema: './src/db/schema.ts',
        out: './drizzle',
        dialect: 'turso',
        dbCredentials: { url, authToken: process.env.DATABASE_AUTH_TOKEN },
      }
    : {
        schema: './src/db/schema.ts',
        out: './drizzle',
        dialect: 'sqlite',
        dbCredentials: { url },
      },
);
