import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_DATABASE_AUTH_TOKEN });
export const db = drizzle(client);


// import { sql } from "drizzle-orm";
// import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
// const users = sqliteTable('users', {
//   id: text('id'),
//   textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
//   intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
// });
