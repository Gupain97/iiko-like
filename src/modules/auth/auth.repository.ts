import { pool } from "../../config/db";
import { UserRaw } from "../users/users.types";


export async function openSessionRepository(sessionId: string, entityType: string, entityId: number) {
    const res = await pool.query(`
        INSERT INTO sessions (session_id, entity_type, entity_id)
        VALUES ($1, $2, $3)
        RETURNING *`, [sessionId, entityType, entityId]);
    return res.rows;
};


export async function getUserForSessionIdRepo(ssessionId: string ) : Promise<UserRaw> {
    const res = await pool.query(`
        SELECT
        
        u.id,
        u.name, 
        u.surname, 
        u.role
         
        FROM sessions s
        LEFT JOIN users u ON s.entity_id = u.id
        WHERE s.session_id = $1`, [ssessionId]);
    
    console.log(res.rows[0]);
    return res.rows[0];
}

export async function deleteSessionRepo(sessionId: string) {
    const res = await pool.query(`DELETE FROM sessions WHERE session_id = $1`, [sessionId]);
    return res.rows[0];
}