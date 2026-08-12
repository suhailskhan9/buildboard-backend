import dotenv from 'dotenv';
import { Pool } from "pg";
dotenv.config()

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

export async function withTransaction(callback) {
    const client = await pool.connect();
    
    try{
        await client.query("BEGIN");

        const result = await callback(client);
         
        await client.query("COMMIT");

        return result;
    }
    catch(err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
    
}

export default pool;