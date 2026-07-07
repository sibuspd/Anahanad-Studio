// BATCH ROUTER
// Provides Batch listing with optional searching and pagination

import express from "express";
import { and, desc, getTableColumns, ilike, sql } from "drizzle-orm";
import {db} from "../db/index.js";
import {batches} from "../db/schema/index.js";
import { filter } from "@arcjet/node";

const router = express.Router();

/** GET /batches
 * Optional Query Parameters - 
 * 1. search
 * 2. page
 * 3. limit
 */

router.get('/', async (req, res) => {
    try{
        const { search, page=1, limit=10 } = req.query;

        // Pagination
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min( Math.max(1, parseInt(String(limit),10) || 10), 100); // Max 100 records per page
        const offset = (currentPage - 1) * limitPerPage;

        //Filters
        const filterConditions = [];

        // Search by Batch Name
        if(search){
            filterConditions.push(
                ilike(batches.name, `%${search}%`)
            );
        }
        // selecting columns according to filters
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        // Count Query
        const countResult = await db.select( {count: sql<number>`count(*)`,} ).from(batches).where(whereClause);
        const totalCount = countResult[0]?.count ?? 0;

        // Data Query
        const batchesList = await db.select().from(batches).where(whereClause).orderBy(desc(batches.createdAt)).limit(limitPerPage).offset(offset);

        //Response
        res.status(200).json( { data: batchesList, pagination: {
            page: currentPage,
            limit: limitPerPage,
            total: totalCount,
            totalPages: Math.ceil(totalCount/limitPerPage),
        }, totalCount } );
    }catch(e){
        console.error(`GET /batches error: ${e}`);
        res.status(500).json( { error: "Failed to get batches",});
    }
});

export default router;