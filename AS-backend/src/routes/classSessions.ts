/** CLASS SESSION ROUTER */
// Handles creation and listing of music class sessions

import express from "express";
import { and, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { classSessions, courses, batches } from "../db/schema/app.js";
import { user } from "../db/schema/auth.js";
import { z } from "zod";

/**
 * ------------------------------------------------------------------
 * CREATE SESSION ZODVALIDATION
 * ------------------------------------------------------------------
 */
const createSessionSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(5),
  courseId: z.number().int().positive(),
  batchId: z.number().int().positive(),
  teacherId: z.string().min(1),
  sessionDate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  bannerUrl: z.url(),
  bannerCldPubId: z.string().min(1),
  status: z.enum(["scheduled", "completed", "cancelled"]),
});

const router = express.Router();

// GET /class-sessions

router.get("/", async (req, res) => {
  try {
    const {
      search,
      courseId,
      batchId,
      teacherId,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    // Pagination
    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.min(
      Math.max(1, parseInt(String(limit), 10) || 10),
      100,
    );
    const offset = (currentPage - 1) * limitPerPage;

    // Filters
    const filterConditions = [];

    // Search by Session Name
    if (search) {
      filterConditions.push(ilike(classSessions.name, `%${search}%`));
    }

    // Course Filter
    if (courseId) {
      filterConditions.push(eq(classSessions.courseId, Number(courseId)));
    }

    // Batch Filter
    if (batchId) {
      filterConditions.push(eq(classSessions.batchId, Number(batchId)));
    }

    // Teacher Filter
    if (teacherId) {
      filterConditions.push(eq(classSessions.teacherId, teacherId as string));
    }

    // Status Filter
    if (status) {
      filterConditions.push(
        eq(
          classSessions.status,
          status as "scheduled" | "completed" | "cancelled",
        ),
      );
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    // Count
    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(classSessions)
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    // Fetch Sessions
    const sessions = await db
      .select()
      .from(classSessions)
      .leftJoin(batches, eq(classSessions.batchId, batches.id))
      .leftJoin(courses, eq(classSessions.courseId, courses.id))
      .leftJoin(user, eq(classSessions.teacherId, user.id))
      .where(whereClause)
      .orderBy(desc(classSessions.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    // Response
    res.status(200).json({
      data: sessions,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
      totalCount,
    });
  } catch (e) {
    console.error(`GET /class-sessions error: ${e}`);
    res.status(500).json({ error: "Failed to get class sessions" });
  }
});

// POST /class-sessions
router.post("/", async (req, res) => {
  try {
    const validatedData = createSessionSchema.parse(req.body);
    const {
      name,
      description,
      courseId,
      batchId,
      teacherId,
      sessionDate,
      startTime,
      endTime,
      bannerUrl,
      bannerCldPubId,
      status,
    } = validatedData; // Only validated data reaches Drizzle after passing the Zod validation

    const inviteCode = Math.random().toString(36).substring(2, 9).toUpperCase();

    const [createdSession] = await db
      .insert(classSessions)
      .values({
        name,
        description,
        courseId,
        batchId,
        teacherId,
        sessionDate,
        startTime,
        endTime,
        bannerUrl,
        bannerCldPubId,
        status,
        inviteCode,
      })
      .returning({ id: classSessions.id });

    if (!createdSession) {
      return res.status(500).json({ error: "Failed to create class session" });
    }

    res.status(201).json({
      data: createdSession,
      message: "Class session created successfully",
    });
  } catch (e) {
    console.error(`POST /class-sessions error: ${e}`);
    if(e instanceof z.ZodError){
        return res.status(400).json({
            error: "Validation failed",
            issues: e.issues,
        });
    }
    res.status(500).json({ error: "Failed to create class session" });
  }
});

export default router;
