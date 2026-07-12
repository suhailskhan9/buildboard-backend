import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import pool from './db/database.js';


const PORT = process.env.PORT || 3000;

try {
    const res = await pool.query("SELECT NOW()")
    console.log("connected to the database")
}
catch(err) {
    console.log("Database connection failed", err)
    process.exit(1)
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})