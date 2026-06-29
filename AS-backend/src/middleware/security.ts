// Creating a security middleware to check if the user is authenticated
import type {Request, Response, NextFunction} from "express";
import aj from '../config/arcjet.js';
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";

const securityMiddleware = async ( req: Request, res: Response, next: NextFunction) => {
    if(process.env.NODE_ENV === 'test') return next(); // No security analysis on a testing environment

    try{
        const role: RateLimitRole = req.user?.role ?? 'guest'; // Default role is guest 

        // Teachers and Admins should be able to make more request than Students
        let limit: number;
        let message: string;

        switch(role){
            case 'admin':
                limit = 2;
                message = 'Admin request limit exceeded (20 per minute)';
                break;
            case 'teacher':
            case 'student':
                limit = 10;
                message = 'User request limit exceeded (10 per minute). Please wait';
                break;
            default:
                limit = 5;
                message = 'Guest request limit exceeded (5 per minute). Please sign up for higher limits';    
        }

        const client = aj.withRule( slidingWindow({
            mode: 'LIVE',
            interval: '1m',
            max: limit,
        }))

        const arcjetRequest: ArcjetNodeRequest = {
            headers: req.headers,
            method: req.method,
            url: req.originalUrl ?? req.url,
            socket: { remoteAddress: req.socket.remoteAddress ?? req.ip ?? '0.0.0.0'} // Getting client IP address
        }

        const decision = await client.protect(arcjetRequest); // Arcjet decides if the request is allowed or not
        
        if(decision.isDenied() && decision.reason.isBot()){
            return res.status(403).json( { error: 'Forbidden', message: 'Automated bot requests are not allowed'});
        }
        if(decision.isDenied() && decision.reason.isShield()){
            return res.status(403).json( { error: 'Forbidden', message: 'Request blocked by security policy'});
        }
        if(decision.isDenied() && decision.reason.isRateLimit()){
            return res.status(429).json( { error: 'Too many requests', message});
        }

        next();
    }
    catch(e){
        console.error('Arcjet middleware error: ',e);
        res.status(500).json({ error: 'Internal Error', message: 'Something went wrong with Security Middleware'});
    }
};

export default securityMiddleware;