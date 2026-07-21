import { pool } from "../../config/db";
import { Station } from "../station/station.types";
import { UserRaw } from "../users/users.types";
import { SessionRaw } from "./auth.types/session.type";


export async function openSessionRepository(sessionId: string, entityType: string, entityId: number) {
    const res = await pool.query(`
        INSERT INTO sessions (session_id, entity_type, entity_id)
        VALUES ($1, $2, $3)
        RETURNING *`, [sessionId, entityType, entityId]);
    return res.rows;
};


export async function getUserForSessionIdRepo(sessionId: string ) : Promise<UserRaw> {
    const res = await pool.query(`
        SELECT
        
        u.id,
        u.name, 
        u.surname, 
        u.role
         
        FROM sessions s
        LEFT JOIN users u ON s.entity_id = u.id
        WHERE s.session_id = $1`, [sessionId]);
    
    return res.rows[0];
}

export async function getStationRepo(sessionId: string): Promise<Station> {
    const res = await pool.query(`
        SELECT 
        st.id, 
        st.name 

        FROM sessions s
        LEFT JOIN station st ON s.entity_id = st.id
        WHERE session_id = $1
        `, [sessionId]);
    return res.rows[0];
};

export async function deleteSessionRepo(sessionId: string) {
    const res = await pool.query(`DELETE FROM sessions WHERE session_id = $1`, [sessionId]);
    return res.rows[0];
};

export async function getSessionRepo(sessionId: string): Promise<SessionRaw[]> {
    const res = await pool.query(`SELECT * FROM sessions WHERE session_id = $1`, [sessionId]);
    return res.rows;
}

