import { InvalidCredentials } from "../errors/AppErrors";
import { getAllMenu } from "../modules/menu/menu.services";
import { AllMenuDTO, NewMenuItem } from "../modules/menu/menu.types";
import { NewUser } from "../modules/auth/users/users.types";
import { 
    addCategoryRepo, 
    getAllCategoriesRepo, 
    addMenuItemRepo, 
    getAllUsersRepo,
    addUserRepo,
    getAdminUserRepo,
    getIgredientsRepo,
    addIngredientRepo,
    getIngredientsForDish,
    updateRecipeRepo
} from "./admin.repository";
import { AdminUser, Ingredient, NewIngredient } from "./admin.types";


export async function getAllItems(): Promise<AllMenuDTO[]> {
    const res = await getAllMenu(); // сервис меню 
    return res.items;
}

export async function getAllCategories() {
    const cats = await getAllCategoriesRepo();
    return cats;
}

export async function addCategory(name: string): Promise<any> {
    const res = await addCategoryRepo(name);
    return res;
}

export async function addMenuItem(name: string, price: number, categoryId:number) {
    const item : NewMenuItem = {
        name,
        price,
        categoryId,
        isActive: true 
    }
    await addMenuItemRepo(item);
}

export async function getAllUsers() {
    const result = await getAllUsersRepo();
    return result; 
}

export async function addUser(name:string, surname: string, role: string, pin: number) {
    const user : NewUser = {
        name,
        surname,
        role,
        pin
    }
    await addUserRepo(user);
};


export async function getIngredients() : Promise<Ingredient[]> {
    const ingredients = await getIgredientsRepo();
    const res = []
    for (const row of ingredients) {
        res.push({
            id: row.id,
            name: row.name,
            quantity: row.quantity,
            unit: row.unit,
            createdAt: row.created_at // поменяем
        });
    }

    return res 
}

export async function addIngredient(name: string, unit: string, quantity:number) {
    await addIngredientRepo(name, unit, quantity);
};

export async function updateDishRecipe(dishId: number, ingredients: NewIngredient[]) {
    const exists = await getIngredientsForDish(dishId);
    const existsId = new Set(
        exists.map(ingredient => ingredient.ingredient_id)
    );
    const insert = ingredients.filter(ingredient => !existsId.has(ingredient.ingredientId));
    await updateRecipeRepo(dishId, insert);
    
}




