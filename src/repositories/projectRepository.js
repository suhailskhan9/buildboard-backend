import pool from "../config/database.js";

export async function getAllProjects(ownerId) {
    const result = await pool.query("SELECT * FROM projects WHERE owner_id = $1", [ownerId]);
    return result.rows;
}

export async function createProject({ name, description, ownerId}) {
    const result = await pool.query("INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *", [name, description, ownerId]);
    return result.rows[0];
}

export async function updateProject({ id, name, ownerId }) {
    const result = await pool.query("UPDATE projects SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *", [name, id, ownerId]);
    return result.rows[0];
}

export async function getProjectById({ id, ownerId }){
    const result = await pool.query("SELECT * from projects WHERE id = $1 AND owner_id = $2", [id, ownerId])
    return result.rows[0];
}

export async function deleteProject({ id, ownerId }) {
    const result = await pool.query("DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING *", [id, ownerId]);
    return result.rows[0];
}