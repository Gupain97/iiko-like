import { pool } from "../../config/db";
import { mapMenuItemToService } from "./menu.mapper";
import { MenuItem } from "./menu.types";


export async function getAllMenuRepo() {
    const result = await pool.query(`SELECT * FROM menu_items`);
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


export async function getCurrentStopListRepo() {
    const res = await pool.query(`SELECT * FROM menu_items WHERE is_active = false`)
    console.log(res.rows);
    return res.rows;
}

