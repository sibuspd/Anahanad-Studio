// BATCH ROUTER
// Provides Batch listing with optional searching and pagination

import express from "express";
import { and, desc, getTableColumns, ilike, sql, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { batches } from "../db/schema/index.js";
import { z } from "zod";

const router = express.Router();

/**
 * --------------------------------------------------------
 * CREATE / UPDATE BATCH ZOD VALIDATION SCHEMA
 * --------------------------------------------------------
 */

const batchSchema = z.object({
  name: z.string().min(2).max(255),

  capacity: z.number().int().positive(),

  schedule: z.array(
    z.object({
      day: z.string(),

      startTime: z.string(),

      endTime: z.string(),
    }),
  ),
});

/** GET /batches
 * Optional Query Parameters -
 * 1. search
 * 2. page
 * 3. limit
 */

router.get("/", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Pagination
    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.min(
      Math.max(1, parseInt(String(limit), 10) || 10),
      100,
    ); // Max 100 records per page
    const offset = (currentPage - 1) * limitPerPage;

    //Filters
    const filterConditions = [];

    // Search by Batch Name
    if (search) {
      filterConditions.push(ilike(batches.name, `%${search}%`));
    }
    // selecting columns according to filters
    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    // Count Query
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(batches)
      .where(whereClause);
    const totalCount = countResult[0]?.count ?? 0;

    // Data Query
    const batchesList = await db
      .select()
      .from(batches)
      .where(whereClause)
      .orderBy(desc(batches.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    //Response
    res.status(200).json({
      data: batchesList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
      totalCount,
    });
  } catch (e) {
    console.error(`GET /batches error: ${e}`);
    res.status(500).json({ error: "Failed to get batches" });
  }
});

/**
 * --------------------------------------------------------
 * POST /batches
 * --------------------------------------------------------
 */

router.post("/", async (req, res) => {
  try {
    const validatedData = batchSchema.parse(req.body);

    const [createdBatch] = await db
      .insert(batches)
      .values(validatedData)
      .returning({
        id: batches.id,
      });

    if (!createdBatch) {
      return res.status(500).json({
        error: "Failed to create batch",
      });
    }

    return res.status(201).json({
      data: createdBatch,
      message: "Batch created successfully",
    });
  } catch (e) {
    console.error("POST /batches error:", e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: e.issues,
      });
    }

    return res.status(500).json({
      error: "Failed to create batch",
    });
  }
});

/**
 * --------------------------------------------------------
 * GET /batches/:id
 * --------------------------------------------------------
 */

router.get("/:id", async (req, res) => {
  try {
    const batchId = Number(req.params.id);

    if (!Number.isFinite(batchId)) {
      return res.status(400).json({
        error: "Invalid batch id",
      });
    }

    const [batch] = await db
      .select({
        ...getTableColumns(batches),
      })
      .from(batches)
      .where(eq(batches.id, batchId));

    if (!batch) {
      return res.status(404).json({
        error: "Batch not found",
      });
    }

    return res.status(200).json({
      data: batch,
    });
  } catch (e) {
    console.error("GET /batches/:id", e);

    return res.status(500).json({
      error: "Failed to fetch batch",
    });
  }
});

/**
 * --------------------------------------------------------
 * PUT /batches/:id
 * --------------------------------------------------------
 */

router.put("/:id", async (req, res) => {
  try {
    const batchId = Number(req.params.id);

    if (!Number.isFinite(batchId)) {
      return res.status(400).json({
        error: "Invalid batch id",
      });
    }

    const validatedData = batchSchema.parse(req.body);

    const [updatedBatch] = await db
      .update(batches)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(batches.id, batchId))
      .returning({
        id: batches.id,
      });

    if (!updatedBatch) {
      return res.status(404).json({
        error: "Batch not found",
      });
    }

    return res.status(200).json({
      data: updatedBatch,
      message: "Batch updated successfully",
    });
  } catch (e) {
    console.error("PUT /batches", e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: e.issues,
      });
    }

    return res.status(500).json({
      error: "Failed to update batch",
    });
  }
});

/**
 * --------------------------------------------------------
 * DELETE /batches/:id
 * --------------------------------------------------------
 */

router.delete("/:id", async (req, res) => {
  try {
    const batchId = Number(req.params.id);

    if (!Number.isFinite(batchId)) {
      return res.status(400).json({
        error: "Invalid batch id",
      });
    }

    const [deletedBatch] = await db
      .delete(batches)
      .where(eq(batches.id, batchId))
      .returning({
        id: batches.id,
      });

    if (!deletedBatch) {
      return res.status(404).json({
        error: "Batch not found",
      });
    }

    return res.status(200).json({
      data: deletedBatch,
      message: "Batch deleted successfully",
    });
  } catch (e) {
    console.error("DELETE /batches", e);

    return res.status(500).json({
      error: "Failed to delete batch",
    });
  }
});

export default router;
