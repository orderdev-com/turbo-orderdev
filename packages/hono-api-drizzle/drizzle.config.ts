import { type Config } from 'drizzle-kit';

export default {
	out: './migrations',
	schema: './src/schema.ts',
	breakpoints: true,
	dialect: 'sqlite',
	driver: 'turso',
	dbCredentials: {
		url: process.env['TURSO_DATABASE_URL']!,
		authToken: process.env['TURSO_DATABASE_AUTH_TOKEN']
	},
} satisfies Config;
