/** COURSES ROUTER API FOR GETTING ALL COURSES */

import express from "express";
import { and, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import {db} from "../db/index.js";
import {courses, subjects} from "../db/schema/index.js";

const router = express.Router();

/** GET /COURSES
 * 
 * Optional Query Parameters - 
 * 1. search --> Search by Course name
 * 2. subjectId --> Filter courses according to Subject selected
 * 3. level  --> beginner | intermediate | advanced
 * 4. page
 * 5. limit
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
        const coursesList = await db().from(courses).leftJoin(subjects, eq(courses.subjectId, subjects.id)).where(whereClause)
        .orderBy(desc(courses.createdAt)).limit(limitPerPage).offset(offset);

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

export default router;