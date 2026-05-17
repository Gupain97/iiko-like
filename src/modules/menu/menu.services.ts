import { mapStopListItemsToService } from "./menu.mapper";
import { getAllMenuRepo, getCategoriesRepo, getCurrentStopListRepo } from "./menu.repository";


export async function getAllMenu() {
    const items = await getAllMenuRepo();
    const categories = await getCategoriesRepo();
    return {
        items,
        categories
    };
}


export async function getCurrentStopList() {
    const res = await getCurrentStopListRepo();
    return mapStopListItemsToService(res);
}

