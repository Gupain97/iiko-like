import { getAllMenuRepo, getCategoriesRepo } from "./menu.repository";


export async function getAllMenu() {
    const items = await getAllMenuRepo();
    const categories = await getCategoriesRepo();
    return {
        items,
        categories
    };
}

