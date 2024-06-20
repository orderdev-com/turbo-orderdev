import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: 'src/db/schema/**',
    out: './drizzle',
    dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        url: 'dev-sqlite/test.sqlite'
    },
});
