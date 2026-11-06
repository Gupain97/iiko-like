import { InvalidCredentials } from "../errors/AppErrors";
import { getAllMenu } from "../modules/menu/menu.services";
import { AllMenuDTO, NewMenuItem } from "../modules/menu/menu.types";
import { NewUser, User } from "../modules/auth/users/users.types";
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
    updateRecipeRepo,
    getSalesRepo,
    getIngredientsUsageRepo
} from "./admin.repository";
import { AdminUser, Ingredient, IngredientUsageDTO, NewIngredient, Revenue, SalesReult } from "./admin.types";
import { mapIngredientsUsageDTO } from "./admin.mapper";


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

export async function getAllUsers() : Promise<User[]> {
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
    
};

export async function getSales(userId: number | null , from: Date, to:Date): Promise<SalesReult> {
    
    const res = await getSalesRepo(userId, from, to);
    const total = res.reduce(( sum , row ) => sum + Number(row.revenue), 0)
    return {employes: res, totalRevenue: total} ;
    
};

export async function getIngredientsUsage(from: Date, to: Date): Promise<IngredientUsageDTO[]> {
    const res = await getIngredientsUsageRepo(from, to);
    return mapIngredientsUsageDTO(res);
}




