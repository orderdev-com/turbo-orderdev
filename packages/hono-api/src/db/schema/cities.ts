import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { countries } from './countries';
import { z } from 'zod';

export const cities = sqliteTable('cities', {
    id: integer('id').primaryKey(),
    name: text('name'),
    countryId: integer('country_id').references(() => countries.id),
});


export const insertCitySchema = createInsertSchema(cities);
export const selectCitySchema = createSelectSchema(cities, {
    // id: z.number().optional(),
    // name: z.string().optional(),
    // countryId: z.number().optional(),
});



// import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
// import { z } from 'zod';

// const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   email: text('email').notNull(),
//   role: text('role', { enum: ['admin', 'user'] }).notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// // Schema for inserting a user - can be used to validate API requests
// const insertUserSchema = createInsertSchema(users);

// // Schema for selecting a user - can be used to validate API responses
// const selectUserSchema = createSelectSchema(users);

// // Overriding the fields
// const insertUserSchema = createInsertSchema(users, {
//   role: z.string(),
// });

// // Refining the fields - useful if you want to change the fields before they become nullable/optional in the final schema
// const insertUserSchema = createInsertSchema(users, {
//   id: (schema) => schema.id.positive(),
//   email: (schema) => schema.email.email(),
//   role: z.string(),
// });

// // Usage

// const user = insertUserSchema.parse({
//   name: 'John Doe',
//   email: 'johndoe@test.com',
//   role: 'admin',
// });

// // Zod schema type is also inferred from the table schema, so you have full type safety
// const requestSchema = insertUserSchema.pick({ name: true, email: true });
