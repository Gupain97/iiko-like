import { pool } from "../../config/db";



export async function addDishToStopRepo(itemdId: number, userId: number) {
    await pool.query(`INSERT INTO stop_list (dish_id, created_by, remainder) VALUES ($1, $2, $3) RETURNING *`, [itemdId, userId, 0 ]);
    const res = await pool.query(`SELECT category_id FROM menu_items WHERE id = $1`, [itemdId]);
    return res.rows[0].category_id;
}

export async function getStopListRepo() {
    const res = await pool.query(`
        SELECT 
        m.name,

        d.dish_id,
        d.created_at,
        d.remainder,

        u.name AS created_by

        FROM stop_list d
        LEFT JOIN users u on d.created_by = u.id
        LEFT JOIN menu_items m on d.dish_id = m.id

        WHERE removed_at IS NULL
        `);
    return res.rows;
}

export async function removeFromStopListRepo(itemId: number, userId:number) {
    const res = await pool.query(`
        UPDATE stop_list SET removed_at = NOW(), removed_by =$1
        WHERE dish_id = $2
        RETURNING *`, [userId, itemId] );

    return res.rows[0];
}

export async function getDishFromStopRepo(dishId: number) {
    const res = await pool.query(`
        SELECT * FROM stop_list 
        WHERE dish_id = $1 
        AND remainder < 1
        AND removed_at IS NULL`, [dishId]);
    return res.rows;
}


export async function addReamainderRepo(dishId: number, count:number) {
    const res = await pool.query(`UPDATE stop_list SET remainder = $2 WHERE dish_id = $1 AND removed_at IS NULL RETURNING *`, [dishId, count]);
    return res.rows[0]
}

export async function checkDishRemainderRepo(dishId: number) {
    const res = await pool.query(`
        SELECT remainder FROM stop_list 
        WHERE dish_id = $1
        AND removed_at IS NULL `, [dishId]);

    if ( res.rows.length < 1) {
        return 
    }
    return res.rows[0].remainder;
}

export async function decrementRemainderRepo(dishId: number) { 
    const res = await pool.query(`
        UPDATE stop_list 
        SET remainder = remainder - 1 
        WHERE dish_id = $1
        AND removed_at IS NULL 
        RETURNING *`, [dishId]);
    return res.rows[0];
}