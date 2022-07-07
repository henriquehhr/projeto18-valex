import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
let configDatabase: pg.PoolConfig;

if(process.env.MODE === "PROD") {
    configDatabase = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
} else {
    configDatabase = {
        connectionString: process.env.DATABASE_URL
    }
}

export const connection = new Pool(configDatabase);