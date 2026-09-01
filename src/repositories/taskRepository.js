import pool from "../config/database.js";

export async function createTask({ projectId, taskData }){
    const result = await pool.query(`INSERT INTO tasks (project_id, assigned_to_id, title, description, status, due_date) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [projectId, taskData.assigned_to_id, taskData.title, taskData.description, taskData.status, taskData.due_date]
    );

    return result.rows[0];
}