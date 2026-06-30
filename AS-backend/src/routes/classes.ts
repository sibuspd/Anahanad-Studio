// CLASS ROUTER FOR CREATING A NEW SESSION/CLASS

import express from "express";

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        // Destructuring the properties passed via request body from the frontend
        const { name, teacherId, subjectId,  } = req.body;

    } catch (e){
        console.error(`POST /classes error ${e}`);
        res.status(500).json( { error: e});
    }
});

export default router;
