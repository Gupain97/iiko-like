import { pool } from "../../config/db";


export async function getActiveUsersRepo() {
    const res = pool.query(`
        SELECT * FROM users`)
}


export async function getUserRoleRepo(userId: number) {
    const res = await pool.query(`SELECT role FROM users WHERE id = $1`, [userId]);
    return res.rows[0];
}