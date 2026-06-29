/** THIS IS THE SERVER FILE */

import AgentAPI from 'apminsight';
AgentAPI.config(); // Agent to run the web app performance monitoring

import express from 'express';
import subjectsRouter from './routes/subject.js'; // Router imported for Subjects display
import cors from 'cors';
import securityMiddleware from './middleware/security.js';
import {toNodeHandler} from "better-auth/node"
import { auth } from './lib/auth.js';

const app = express();
const PORT = 8000;

// Validationg Frontend URL environment variable for security
if (!process.env.FRONTEND_URL) throw new Error('Frontend URL is not set in .env file');

// CORS handshake 
app.use(cors( {
    origin: process.env.FRONTEND_URL, // Requests from frontend origin allowed
    methods: ['GET','POST','PUT','DELETE'], // Allowed methods
    credentials: true // Allow cookies
} ));


app.all('/api/auth/*splat', toNodeHandler(auth)); // Set up a route handler for authentication
app.use(express.json()); // Middleware for parsing JSON
app.use(securityMiddleware); // Implemented Arcjet security middleware for API Requests

app.use('/api/subjects',subjectsRouter );

app.get('/', (req, res) => {
    res.send('Welcome to Anahanad Studio API');
});

app.listen(PORT, ()=> {
    console.log(`Server is running at  http://localhost:${PORT}`);
});

