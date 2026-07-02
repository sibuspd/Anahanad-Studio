// CLASS ROUTER API FOR CREATING A NEW SESSION/CLASS

import express from "express";
import {db} from "../db/index.js";
import {classSessions} from "../db/schema/index.js"

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        // Destructuring the properties passed via request body from the frontend (Not needed actually)
        // const { name, teacherId, subjectId, capacity, description, status, bannerUrl, bannerCldPubId  } = req.body;

        const [createdClass] = await db.insert(classSessions)
        .values({...req.body, inviteCode: Math.random().toString(36).substring(2,9), schedules:[]} )
        .returning( { id: classSessions.id });

        if(!createdClass) throw Error;

        res.status(201).json( { data: createdClass});
        
    } catch (e){
        console.error(`POST /classes error ${e}`);
        res.status(500).json( { error: e});
    }
});

export default router;
