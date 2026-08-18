import pool from "../config/database.js";

export async function getAllProjects(userId) {
    const result = await pool.query("SELECT p.* FROM projects p JOIN project_members pm ON pm.project_id = p.id WHERE pm.user_id = $1", [userId]);
    return result.rows;
}

export async function createProject(client,{ name, description }){
    const result = await client.query("INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *", [name, description]);
    return result.rows[0];
}

export async function updateProject({ id, name, userId }) {
    const result = await pool.query("UPDATE projects p SET name = $1 FROM project_members pm WHERE p.id = $2 AND pm.project_id = p.id AND pm.user_id = $3 AND pm.role IN ('owner', 'editor') RETURNING p.*", [name, id, userId]);
    return result.rows[0];
}

export async function getProjectById({ id, userId }){
    const result = await pool.query("SELECT p.* from projects p JOIN project_members pm ON pm.project_id = p.id WHERE p.id = $1 AND pm.user_id = $2", [id, userId])
    return result.rows[0];
}

export async function deleteProject({ id, userId }) {
    const result = await pool.query("DELETE FROM projects p USING project_members pm WHERE p.id = $1 AND pm.project_id = p.id AND pm.user_id = $2 AND pm.role = 'owner' RETURNING p.*", [id, userId]);
    return result.rows[0];
}