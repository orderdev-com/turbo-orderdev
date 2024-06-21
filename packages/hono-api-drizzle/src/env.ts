import { parseEnv } from 'znv';
import { z } from 'zod';

export const { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } = parseEnv(process.env, {
	TURSO_DATABASE_URL: z.string().min(1),
	TURSO_DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
});
