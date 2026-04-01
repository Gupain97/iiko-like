import { pool } from "../config/db";
import { NewMenuItem } from "../modules/menu/menu.types";
import { NewUser } from "../modules/users/users.types";


export async function getAllCategoriesRepo() {
    const res = await pool.query(`
        SELECT *  FROM category`);
    
    return res.rows;

}

export async function addCategoryRepo(catName: string) {
    const res = await pool.query(`
        INSERT INTO category (name) VALUES ($1) RETURNING *`, [catName]);
    return res; 
    
}

export async function addMenuItemRepo(item: NewMenuItem) {
    await pool.query(`
        INSERT INTO menu_items (name, price, category_id, is_active)
        VALUES ($1, $2, $3, $4)`,
        [item.name, item.price, item.categoryId, item.isActive]);
}

export async function getAllUsersRepo() {
    const res = await pool.query(`
        SELECT * FROM users`);
    return res.rows;
}

export async function addUserRepo(user: NewUser){
    await pool.query(`
        INSERT INTO users (name, surname, role, pin)
        VALUES ($1, $2, $3, $4)`,
        [user.name, user.surname, user.role, user.pin]);
}