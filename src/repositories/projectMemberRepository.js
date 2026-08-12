export async function create(client, data) {
    const result = await client.query(
        `INSERT into project_members (project_id, user_id, role)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [data.projectId, data.userId, data.role]
    )

    return result.rows[0]
}