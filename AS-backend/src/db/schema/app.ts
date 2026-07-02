// BUSINESS SCHEMA DESIGN

// import { timestamp } from "drizzle-orm/gel-core";
import { relations } from "drizzle-orm";
import {user} from "./auth.js"; // Imported the User model
import { pgTable, integer, varchar, timestamp, numeric, text, jsonb, pgEnum, index, unique, primaryKey, date, time } from "drizzle-orm/pg-core";
// import { int } from "drizzle-orm/mysql-core/index.js";

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

// Courses Table
export const courses = pgTable('courses', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    subjectId: integer("subject_id").notNull().references(() => subjects.id, {onDelete: "cascade"}),
    name: varchar("name", {length: 255}).notNull(),
    description: text("description"),
    level: courseLevelEnum("level").default("beginner").notNull(),
    durationMonths: integer("duration_months").notNull(),
    feeAmount: numeric("fee_amount", {
        precision: 10,
        scale: 2
    }).notNull(),
    ...timestamps,
}, (table) => [
    index("courses_subject_id_idx").on(table.subjectId), 
]);

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

// Batches Table
export const batches = pgTable('batches', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", {length: 255}).notNull(),
    capacity: integer("capacity").default(30).notNull(),
    schedule: jsonb("schedule").$type<{
        day: string,
        startTime: string,
        endTime: string,
    }[]>().default([]).notNull(),
    ...timestamps, 
    },
);

// Class or Sessions Table
export const classSessions = pgTable('class_sessions', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    batchId: integer("batch_id").notNull().references(() => batches.id, {onDelete: "cascade"}),
    courseId: integer("course_id").notNull().references(() => courses.id, {onDelete: "cascade"}),
    teacherId: text("teacher_id").notNull().references(() => user.id, {onDelete: "restrict"}),
    inviteCode: text("invite_code").notNull().unique(),
    name: varchar("name", {length: 255}).notNull(),
    description: text("description"),
    sessionDate: date("session_date").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    bannerUrl: text("banner_url"),
    bannerCldPubId: text("banner_cld_pub_id"),
    status: sessionStatusEnum("status").default("scheduled").notNull(),
    ...timestamps,
}, (table) => [
    index("class_sessions_batch_idx").on(table.batchId),
    index("class_sessions_course_idx").on(table.courseId),
    index("class_sessions_teacher_idx").on(table.teacherId),
]);

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

// Enrollments Table
export const enrollments = pgTable('enrollments', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    studentId: text("student_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    batchId: integer("batch_id").notNull().references(() => batches.id, {onDelete: "cascade"}),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
    ...timestamps,
}, (table) => [
    unique("enrollments_student_batch_unique").on(table.studentId, table.batchId),
    index("enrollments_student_idx").on(table.studentId),
    index("enrollments_batch_idx").on(table.batchId),
]);

// Attendance Table
export const attendance = pgTable('attendance', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    sessionId: integer("session_id").notNull().references(() => classSessions.id, {onDelete: "cascade"}),
    studentId: text("student_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    status: attendanceStatusEnum("status").default("present").notNull(),
    remarks: text("remarks"),
    ...timestamps
}, (table) => [
    unique("attendance_session_student_unique").on(table.sessionId, table.studentId),
    index("attendance_session_idx").on(table.sessionId),
    index("attendance_student_idx").on(table.studentId),
]);

//Defining mutual relations between various tables
export const departmentRelations = relations(departments, ( {many} ) => ({ subjects: many(subjects) }));

export const subjectRelations = relations(subjects, ( {one, many} ) => ({ 
    department: one(departments, {
        fields: [subjects.departmentId],
        references: [departments.id],
    }),
    courses: many(courses),
}));

// Defining Types for inserting and selecting data to/from the database
export type Department = typeof departments.$inferSelect;
export type newDepartment = typeof departments.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type ClassSession = typeof classSessions.$inferSelect;
export type NewClassSession = typeof classSessions.$inferInsert;

export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;

