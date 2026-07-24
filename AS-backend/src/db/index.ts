import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

console.log("DATABASE_URL:");
console.log(process.env.DATABASE_URL);

const sql= neon(process.env.DATABASE_URL!);

export const db = drizzle(sql);