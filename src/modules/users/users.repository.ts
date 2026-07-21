import { pool } from "../../config/db";
import { Role, User } from "./users.types";


// export async function getActiveUsersRepo() {
//     const res = pool.query(`
//         SELECT * FROM users`)
// }


export async function getUserRoleRepo(userId: number) {
    const res = await pool.query(`SELECT role FROM users WHERE id = $1`, [userId]);
    return res.rows[0];
}

export async function getUsersRepo(): Promise<User[]> {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows
}


export async function getUserForPinRepo(pin: number): Promise<User> {
    
    const res = await pool.query(`SELECT * FROM users WHERE pin = $1`, [pin]);
    return res.rows[0];
}

