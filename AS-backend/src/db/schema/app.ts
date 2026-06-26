// BUSINESS SCHEMA DESIGN

// import { timestamp } from "drizzle-orm/gel-core";
import { relations } from "drizzle-orm";
import {user} from "./auth.js"; // Imported the User model
import { pgTable, integer, varchar, timestamp, numeric, text, jsonb, pgEnum, index, unique, primaryKey, date, time } from "drizzle-orm/pg-core";

const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull() 
}

// Course Levels
export const courseLevelEnum = pgEnum( "course_level", ["beginner", "intermediate", "advanced"]);

// Status of a particular Teaching Session
export const sessionStatusEnum = pgEnum("session_status", ["scheduled", "completed", "cancelled"]);

// Attendance Status
export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent"]);

/** DATABASE SCHEMA TABLES ARE DEFINED BELOW */

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

// Classes Table 
// export const classes = pgTable('classes', {
//     id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
//     subjectId: integer('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
//     teacherId: text('teacher_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
//     inviteCode: text('invite_code').notNull().unique(),
//     name: varchar('name', {length: 255}).notNull(),
//     bannerCldPubId: text('banner_cld_pub_id'),
//     bannerUrl: text('banner_url'),
//     description: text('description'),
//     capacity: integer('capacity').default(50).notNull(),
//     status: classStatusEnum('status').default('active').notNull(),
//     schedules: jsonb('schedules').$type<any[]>().default([]).notNull(),
//     ...timestamps
// }, (table) => [
//     index('classes_subject_id_idx').on(table.subjectId),
//     index('classes_teacher_id_idx').on(table.teacherId),
// ]);

// Enrollment Table
// export const enrollments = pgTable('enrollments', {
//     studentId: text('student_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     classId: integer('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
// }, (table) => [
//     primaryKey({ columns: [table.studentId, table.classId] }),
//     unique('enrollments_student_id_class_id_unique').on(table.studentId, table.classId),
//     index('enrollments_student_id_idx').on(table.studentId),
//     index('enrollments_class_id_idx').on(table.classId),
// ]);

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