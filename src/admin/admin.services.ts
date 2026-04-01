import { getAllMenuRepo } from "../modules/menu/menu.repository";
import { NewMenuItem } from "../modules/menu/menu.types";
import { NewUser } from "../modules/users/users.types";
import { 
    addCategoryRepo, 
    getAllCategoriesRepo, 
    addMenuItemRepo, 
    getAllUsersRepo,
    addUserRepo
} from "./admin.repository";


export async function getAllItems() {
    const res = await getAllMenuRepo();
    return res;
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
}
