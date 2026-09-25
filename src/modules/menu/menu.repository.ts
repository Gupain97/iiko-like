import { pool } from "../../config/db";
import { AllMenuRow, Categories, MenuItem, MenuItemRow } from "./menu.types";


export async function getAllMenuRepo(): Promise<AllMenuRow[]> {
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
    return result.rows;
    
}

export async function getCategoriesRepo(): Promise<Categories[]>{
    const result = await pool.query(`SELECT * FROM category`);
    return result.rows;
    
}

export async function findItemByIdRepo(itemId: number): Promise<MenuItemRow | null> {
    const res = await pool.query(`SELECT * FROM menu_items WHERE id = $1`,[itemId]);
    if (!res) return null;
    return res.rows[0];
}

export async function getDishBySearchRepo(query: string): Promise<MenuItemRow[]>{
    const res = await pool.query(`
        SELECT * 
        FROM menu_items mi
        WHERE name ILIKE $1
        AND NOT EXISTS (
            SELECT 1
            FROM stop_list sl
            WHERE mi.id = sl.dish_id
            AND removed_at IS NULL
        )`, [`%${query}%`]);
    return res.rows;
}
