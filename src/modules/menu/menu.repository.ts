import { pool } from "../../config/db";
import { mapMenuItemToService } from "./menu.mapper";
import { MenuItem } from "./menu.types";


export async function getAllMenuRepo() {
    const result = await pool.query(`
        SELECT

        d.id,
        d.name,
        d.price,
        d.category_id,
        d.is_active,
        CASE 
            WHEN sl.id IS NOT NULL AND sl.remainder > 0 THEN sl.remainder
            ELSE NULL
        END AS remainder,

        CASE 
            WHEN sl.id IS NOT NULL AND sl.remainder < 1  THEN true
            ELSE false
        END AS is_stopped 
        FROM menu_items d
        LEFT JOIN stop_list sl
        ON sl.dish_id = d.id
        AND sl.removed_at IS NULL `);
        // console.log("result menu repo", result.rows);
    return result.rows;
    
}

export async function getCategoriesRepo() {
    const result = await pool.query(`SELECT * FROM category`);
    return result.rows;
    
}

export async function findItemByIdRepo(itemId: number): Promise<MenuItem | undefined> {
    const row = await pool.query(`SELECT * FROM menu_items WHERE id = $1`,[itemId]);
    if (!row) return 
    return mapMenuItemToService(row.rows[0]);
}


// export async function getCurrentStopListRepo() {
//     const res = await pool.query(`SELECT * FROM menu_items WHERE is_active = false`)
//     return res.rows;
// }

// export async function addItemToStopRepo(itemId: number) {
//     const res = await pool.query(`UPDATE menu_items SET is_active = false WHERE id = $1 RETURNING *`, [itemId]);
//     console.log("catId in add to Stop Repo ", res.rows[0].category_id)
//     return res.rows[0].category_id;
// }

// export async function deleteItemFromStopRepo(itemId: number) { 
//     const res = await pool.query(`UPDATE menu_items SET is_active = true WHERE id = $1 RETURNING *`, [itemId]);
//     return res.rows
// }
