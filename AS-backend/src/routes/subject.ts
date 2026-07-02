/**API FOR SECTION - SUBJECT */

import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema/index.js";
import { db } from "../db/index.js";

//Defining a router
const router = express.Router();

//Defining routes
// Getting all subjects with optional searching, filtering and pagination
router.get("/", async (req, res) => {
    try{
        const { search, department, page = 1, limit = 10 } = req.query // Destructuring the query parameters

        // The below variables are used for pagination
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);    // Logic is to make sure page is at least 1
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10  ), 100); // Logic is to make sure limit is between 1 and 100 

        // Setting how many records to skip to get to next page
        const offset = (currentPage - 1) * limitPerPage;

        // Defining an array of objects to store filter conditions
        const filterConditions = [];

        // If search is provided, results are filtered by subject name or subject code
        if (search){
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )

            );
        }

        // If department is provided, results are filtered by department (To be simplified later)
        if(department){
            // filterConditions.push(
            //     ilike(departments.name, `%${department}%` )
            // );
            const deptPattern = `%${String(department).replace(/[%_]/g, `\\$&`)}%`; // RegEx to escape special characters
            filterConditions.push(ilike(departments.name, deptPattern)); // Adding filter condition for case-insensitive search
        }

        // Combine all filters using AND if any exists
        const whereClause = filterConditions.length > 0 ? and(...filterConditions):undefined;

        // Getting count of all elements in a page
        const countResult = await db.select( { count: sql<number>`count(*)`})
        .from(subjects)
        .leftJoin(departments, eq(subjects.departmentId, departments.id)) // Returns all rows from left table and matching rows from right table
        .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;
        
        //  Getting all elements in a page
        const subjectsList = await db.select({...getTableColumns(subjects), department: {...getTableColumns(departments)}}) // Get all columns of specified table but also adds additional id column from departments table
                            .from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id))
                            .where(whereClause)
                            .orderBy(desc(subjects.createdAt))
                            .limit(limitPerPage)
                            .offset(offset);
                            
        res.status(200).json({
            data: subjectsList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount/ limitPerPage)
            }, 
            totalCount: totalCount,

        });
    }
    catch (e) {
        console.error(`GET /subjects error: ${e}`);
        res.status(500).json({ error: 'Failed to get subjects'}); // Internal Server Error
    }
});

export default router;