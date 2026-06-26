// BUSINESS SCHEMA DESIGN

import { relations } from "drizzle-orm";
// import { timestamp } from "drizzle-orm/gel-core";
import { pgTable, integer, varchar, timestamp, numeric } from "drizzle-orm/pg-core";

const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull() 
}

// Department Table
export const departments= pgTable('departments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(), // Primary Key
    code: varchar('code', {length: 50}).notNull().unique(),
    name: varchar('name', {length: 80}).notNull(),
    description: varchar('description', {length: 500}).notNull(),
    ...timestamps // Destructuring the timestamps object created above
});

// Subject Table
export const subjects= pgTable('subjects', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer('department_id').notNull().references( () => departments.id, { onDelete: 'restrict' }),
    code: varchar('code', {length: 50}).notNull().unique(),
    name: varchar('name', {length: 255}).notNull(),
    description: varchar('description', {length: 500}),
    ...timestamps 
});

//Defining mutual relations between various tables
export const departmentRelations = relations(departments, ( {many} ) => ({ subjects: many(subjects) }));

export const subjectRelations = relations(subjects, ( {one, many} ) => ({ 
    department: one(departments, {
        fields: [subjects.departmentId],
        references: [departments.id],
    })
}));

// Defining Types for inserting and selecting data to/from the database
export type Department = typeof departments.$inferSelect;
export type newDepartment = typeof departments.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;