import { pool } from "../../config/db";


export async function openSessionRepository(sessionId: string, entityType: string, entityId: number) {
    const res = await pool.query(`
        INSERT INTO sessions (session_id, entity_type, entity_id)
        VALUES ($1, $2, $3)
        RETURNING *`, [sessionId, entityType, entityId]);
    return res.rows;
}

export async function deleteSessionRepo(sessionId: string) {
    const res = await pool.query(`DELETE FROM sessions WHERE session_id = $1`, [sessionId]);
    return res.rows[0];
}