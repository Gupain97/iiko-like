import { pool } from "../../config/db";


export async function openShiftRepo(userId: number) {
    const user = await pool.query(`
        INSERT INTO shifts (user_id, status) VALUES ($1, $2) RETURNING *`, [userId, "OPEN"]);
}
export async function getUserStatusRepo(userId: number) { 
    const res =  await pool.query(`SELECT status FROM shifts WHERE user_id = $1 ORDER BY id DESC LIMIT 1 `, [userId]);
 
    return res.rows[0].status;
}
export async function getActiveUsersRepo() {
    const res = await pool.query(`
        SELECT
        u.id AS user_id,
        u.name,
        u.surname,

        su.started_at,
        su.user_id AS shift_user_id,
        su.status

        FROM users u
        LEFT JOIN shifts su ON u.id = su.user_id
        
        WHERE su.status = $1`, ["OPEN"]);
 
    return res.rows;
}


export async function closeShiftUserRepo(userId: number) {
    await pool.query(`
        UPDATE shifts SET status = $1, ended_at = NOW() WHERE user_id = $2`, ["CLOSED", userId ]);
 
}