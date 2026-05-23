// import { timestamp } from "drizzle-orm/gel-core";
// import { pgTable, serial, text } from "drizzle-orm/pg-core";

// //Defining the Demo Users table
// export const demoUsers = pgTable('demo_users', {
//     id: serial('id').primaryKey(),
//     name: text('name').notNull(),
//     email: text('email').notNull(),
//     createdAt: timestamp('created_at').defaultNow().notNull()
// });

// //Export types for type-safe queries
// export type User = typeof demoUsers.$inferSelect;
// export type NewUser = typeof demoUsers.$inferInsert;

export * from './app'; // Extract schema from the file where it is defined
