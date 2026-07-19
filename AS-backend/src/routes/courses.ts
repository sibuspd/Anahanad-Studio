/** COURSES ROUTER API FOR GETTING ALL COURSES */

import express from "express";
import { and, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import {db} from "../db/index.js";
import {courses, subjects} from "../db/schema/index.js";

const router = express.Router();

/**
 * --------------------------------------------------------
 * ZOD VALIDATION COURSE SCHEMA
 * --------------------------------------------------------
 */

const createCourseSchema = z.object({
  name: z.string().min(2).max(255),

  subjectId: z.number().int().positive(),

  level: z.enum([
    "beginner",
    "intermediate",
    "advanced",
  ]),

  durationMonths: z.number().int().positive(),

  feeAmount: z.coerce.number().positive(),

  description: z.string().optional(),
});

/** GET /COURSES
 * --------------------------------------------------------
 * Optional Query Parameters - 
 * 1. search --> Search by Course name
 * 2. subjectId --> Filter courses according to Subject selected
 * 3. level  --> beginner | intermediate | advanced
 * 4. page
 * 5. limit
 * --------------------------------------------------------
 */

router.get("/", async (req, res) => {
    try{
        const { search, subjectId, level, page=1, limit=10} = req.query;

        // Pagination
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10 ) || 10), 100);
        const offset = (currentPage - 1) * limitPerPage;

        // Filters
        const filterConditions = [];

        // Search by Course Name
        if(search){
            filterConditions.push(ilike(courses.name, `%${search}%`));
        }

        // Filter by Subject
        if(subjectId) {
            filterConditions.push(eq(courses.subjectId, Number(subjectId)));
        }

        //Filter by Level
        if(level){
            filterConditions.push(eq(courses.level, level as "beginner" | "intermediate" | "advanced"));
        }

        // Combine filters
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        // Count Query
        const countResult = await db.select( { count: sql<number> `count(*)`}).from(courses).where(whereClause);
        const totalCount = countResult[0]?.count ?? 0;

        // Data Query
        const coursesList = await db.select( 
            {
            ...getTableColumns(courses),
            subject: {
                ...getTableColumns(subjects),
            }
        }).from(courses).leftJoin(subjects, eq(courses.subjectId, subjects.id))
        .where(whereClause).orderBy(desc(courses.createdAt))
        .limit(limitPerPage).offset(offset);

        // Response to be passed to frontend
        res.status(200).json( {
            data: coursesList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount/limitPerPage),
            },
            totalCount,
        } );
    } catch(e){
        console.error(`GET /courses error: ${e}`);
        res.status(500).json( {
            error: "Failed to get courses",
        });
    }
});

/**
 * --------------------------------------------------------
 * POST /courses
 * --------------------------------------------------------
 */

router.post("/", async (req, res) => {
  try {
    const validatedData = createCourseSchema.parse(req.body);

    const {
      name,
      subjectId,
      level,
      durationMonths,
      feeAmount,
      description,
    } = validatedData;

    const [createdCourse] = await db
      .insert(courses)
      .values({
        name,
        subjectId,
        level,
        durationMonths,
        feeAmount: feeAmount.toString(),
        description,
      })
      .returning({
        id: courses.id,
      });

    if (!createdCourse) {
      return res.status(500).json({
        error: "Failed to create course",
      });
    }

    return res.status(201).json({
      data: createdCourse,
      message: "Course created successfully",
    });

  } catch (e) {
    console.error("POST /courses error:", e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: e.issues,
      });
    }

    return res.status(500).json({
      error: "Failed to create course",
    });
  }
});

/**
 * --------------------------------------------------------
 * GET /courses/:id
 * --------------------------------------------------------
 */

router.get("/:id", async (req, res) => {
  try {
    const courseId = Number(req.params.id);

    if (!Number.isFinite(courseId)) {
      return res.status(400).json({
        error: "Invalid course id",
      });
    }

    const [course] = await db
      .select({
        ...getTableColumns(courses),

        subject: {
          ...getTableColumns(subjects),
        },
      })
      .from(courses)
      .leftJoin(
        subjects,
        eq(courses.subjectId, subjects.id),
      )
      .where(eq(courses.id, courseId));

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    return res.status(200).json({
      data: course,
    });

  } catch (e) {
    console.error("GET /courses/:id error:", e);

    return res.status(500).json({
      error: "Failed to fetch course",
    });
  }
});

/**
 * --------------------------------------------------------
 * PUT /courses/:id
 * --------------------------------------------------------
 */

router.put("/:id", async (req, res) => {
  try {
    const courseId = Number(req.params.id);

    if (!Number.isFinite(courseId)) {
      return res.status(400).json({
        error: "Invalid course id",
      });
    }

    const validatedData = createCourseSchema.parse(req.body);

    const {
      name,
      subjectId,
      level,
      durationMonths,
      feeAmount,
      description,
    } = validatedData;

    const [updatedCourse] = await db
      .update(courses)
      .set({
        name,
        subjectId,
        level,
        durationMonths,
        feeAmount: feeAmount.toString(),
        description,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning({
        id: courses.id,
      });

    if (!updatedCourse) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    return res.status(200).json({
      data: updatedCourse,
      message: "Course updated successfully",
    });

  } catch (e) {
    console.error("PUT /courses error:", e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: e.issues,
      });
    }

    return res.status(500).json({
      error: "Failed to update course",
    });
  }
});

/**
 * --------------------------------------------------------
 * DELETE /courses/:id
 * --------------------------------------------------------
 */

router.delete("/:id", async (req, res) => {
  try {
    const courseId = Number(req.params.id);

    if (!Number.isFinite(courseId)) {
      return res.status(400).json({
        error: "Invalid course id",
      });
    }

    const [deletedCourse] = await db
      .delete(courses)
      .where(eq(courses.id, courseId))
      .returning({
        id: courses.id,
      });

    if (!deletedCourse) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    return res.status(200).json({
      data: deletedCourse,
      message: "Course deleted successfully",
    });

  } catch (e) {
    console.error("DELETE /courses error:", e);

    return res.status(500).json({
      error: "Failed to delete course",
    });
  }
});

export default router;