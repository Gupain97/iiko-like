import { pool } from "../../config/db";


export async function getActiveUsersRepo() {
    const res = pool.query(`
        SELECT * FROM users`)
}