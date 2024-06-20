import { drizzle } from 'drizzle-orm/better-sqlite3';
// import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from 'better-sqlite3';

const sqlite = new Database('dev-sqlite/test.sqlite');
export const db = drizzle(sqlite);


// import { sql } from "drizzle-orm";
// import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
// const users = sqliteTable('users', {
//   id: text('id'),
//   textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
//   intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
// });
