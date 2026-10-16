import { pool } from "../config/db";
import { NewMenuItem } from "../modules/menu/menu.types";
import { NewUser } from "../modules/auth/users/users.types";
import { AdminUser, Ingredient, NewIngredient } from "./admin.types";


export async function getAllCategoriesRepo() {
    const res = await pool.query(`
        SELECT *  FROM category`);
    
    return res.rows;

};

export async function addCategoryRepo(catName: string) {
    const res = await pool.query(`
        INSERT INTO category (name) VALUES ($1) RETURNING *`, [catName]);
    return res; 
    
};

export async function addMenuItemRepo(item: NewMenuItem) {
    await pool.query(`
        INSERT INTO menu_items (name, price, category_id, is_active)
        VALUES ($1, $2, $3, $4)`,
        [item.name, item.price, item.categoryId, item.isActive]);
};

export async function getAllUsersRepo() {
    const res = await pool.query(`
        SELECT * FROM users`);
    return res.rows;
};

export async function addUserRepo(user: NewUser){
    await pool.query(`
        INSERT INTO users (name, surname, role, pin)
        VALUES ($1, $2, $3, $4)`,
        [user.name, user.surname, user.role, user.pin]);
};


export async function getAdminUserRepo(login: string, password: string) : Promise<AdminUser> {
    const res = await pool.query(`SELECT id, name, role FROM admins_users WHERE login = $1 AND password = $2`, [login, password]);
    return res.rows[0];
    
};

export async function getIgredientsRepo() {
    const res = await pool.query(`SELECT * FROM ingredients`);
    return res.rows;
};

export async function getIngredientsForDish(dishId: number) {
    const res = await pool.query(`SELECT * FROM dish_ingredients WHERE menu_item_id = $1`, [dishId]);
    return res.rows;
}

export async function addIngredientRepo(name:string, unit:string, quantity:number) {
    await pool.query(`INSERT INTO ingredients (name, unit, quantity) VALUES ($1, $2, $3)`, [name, unit, quantity]);

}

export async function updateRecipeRepo(dishId: number, ingredients:NewIngredient[]) {
    if (ingredients.length === 0 ) return;
    const values : (number | string )[] = ingredients.flatMap(
        (ingredient): (number | string)[] => [
            dishId,
            ingredient.ingredientId,
            ingredient.quantity,
        ]
        
    )
    const placeholder = ingredients.map((_ , index) => {
        const offset = index * 3;

        
        return `($${offset + 1}, $${offset + 2}, $${offset + 3})`
    });

    const sql = `
        INSERT INTO dish_ingredients
        (menu_item_id, ingredient_id, quantity)
        VALUES ${placeholder.join(', ')}
        `
    await pool.query(sql, values);
    
    
}