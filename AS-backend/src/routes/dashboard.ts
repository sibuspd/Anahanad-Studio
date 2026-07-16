import express from "express";
import { sql } from "drizzle-orm";

import { db } from "../db";
import {
  departments,
  subjects,
  courses,
  batches,
  classSessions,
  enrollments,
} from "../db/schema/app";

import { user } from "../db/schema/auth";

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const [
      students,
      teachers,
      departmentsCount,
      subjectsCount,
      coursesCount,
      batchesCount,
      sessionsCount,
      enrollmentsCount,
    ] = await Promise.all([
      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(user)
        .where(sql`${user.role}='student'`),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(user)
        .where(sql`${user.role}='teacher'`),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(departments),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(subjects),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(courses),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(batches),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(classSessions),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(enrollments),
    ]);

    res.json({
      stats: {
        students: students[0].count,
        teachers: teachers[0].count,
        departments: departmentsCount[0].count,
        subjects: subjectsCount[0].count,
        courses: coursesCount[0].count,
        batches: batchesCount[0].count,
        sessions: sessionsCount[0].count,
        enrollments: enrollmentsCount[0].count,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
});

export default router;