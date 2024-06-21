import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: 'src/db/schema/**',
    out: './drizzle',
    dialect: 'sqlite',
    driver: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_DATABASE_AUTH_TOKEN
    },
});