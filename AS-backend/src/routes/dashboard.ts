import express from "express";
import { sql, eq, desc, gte, asc } from "drizzle-orm";

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
const today = new Date().toISOString().split("T")[0];

console.log("Dashboard router loaded");

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
      todaysSessions,
      upcomingSessions,
      recentEnrollments,
      recentTeachers,
      recentStudents,
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
      db
        .select({
          id: classSessions.id,
          name: classSessions.name,
          startTime: classSessions.startTime,
          endTime: classSessions.endTime,
        })
        .from(classSessions)
        .where(eq(classSessions.sessionDate, today))
        .orderBy(asc(classSessions.startTime))
        .limit(10),
      db
        .select({
          id: classSessions.id,
          name: classSessions.name,
          sessionDate: classSessions.sessionDate,
          startTime: classSessions.startTime,
        })
        .from(classSessions)
        .where(gte(classSessions.sessionDate, today))
        .orderBy(asc(classSessions.sessionDate))
        .limit(10),
      db
        .select({
          id: enrollments.id,
          enrolledAt: enrollments.enrolledAt,

          student: {
            id: user.id,
            name: user.name,
          },
        })
        .from(enrollments)
        .leftJoin(user, eq(enrollments.studentId, user.id))
        .orderBy(desc(enrollments.enrolledAt))
        .limit(8),
      db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
        })
        .from(user)
        .where(sql`${user.role}='teacher'`)
        .orderBy(desc(user.createdAt))
        .limit(5),
      db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
        })
        .from(user)
        .where(sql`${user.role}='student'`)
        .orderBy(desc(user.createdAt))
        .limit(5),
    ]);

    res.json({
      stats: {
        students: students[0]?.count ?? 0,
        teachers: teachers[0]?.count ?? 0,
        departments: departmentsCount[0]?.count ?? 0,
        subjects: subjectsCount[0]?.count ?? 0,
        courses: coursesCount[0]?.count ?? 0,
        batches: batchesCount[0]?.count ?? 0,
        sessions: sessionsCount[0]?.count ?? 0,
        enrollments: enrollmentsCount[0]?.count ?? 0,
      },

      today: todaysSessions,
      
      upcoming: upcomingSessions,

      recent: {
        enrollments: recentEnrollments,

        teachers: recentTeachers,

        students: recentStudents,
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
