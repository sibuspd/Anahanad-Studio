import express from 'express';
import subjectsRouter from './routes/subject'; // Router imported for Subjects display
import cors from 'cors';

const app = express();
const PORT = 8000;

// CORS handshake 
app.use(cors( {
    origin: process.env.FRONTEND_URL, // Requests from frontend origin allowed
    methods: ['GET','POST','PUT','DELETE'], // Allowed methods
    credentials: true // Allow cookies
} ));

app.use(express.json());

app.use('/api/subjects',subjectsRouter );

app.get('/', (req, res) => {
    res.send('Welcome to Anahanad Studio API');
});

app.listen(PORT, ()=> {
    console.log(`Server is running at  http://localhost:${PORT}`);
});

