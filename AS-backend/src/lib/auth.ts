// CREATING A BETTER AUTH INSTANCE

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance

// Configuring Database Adapter for connecting to PostgreSQL 
export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!, // Importing secret key from .env
    trustedOrigins: [process.env.FRONTEND_URL!], // Allowing frontend origin
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),

    // Setting up email and password Authentication methods
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: 'string', required: true, defaultValue: 'student', input: true, // To allow registration of new users
            },
            imageCldPubId: {
                type: 'string', required: false, input: true, // To allow uploading of profile picture
            },
        }
    },
});