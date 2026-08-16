
import { mapMenuDTO, mapMenuItems } from "./menu.mapper";
import {getAllMenuRepo, getCategoriesRepo, getDishBySearchRepo} from "./menu.repository";
import { AllMenuDTO, AllMenuRow, Categories, MenuItem } from "./menu.types";


export async function getAllMenu(): Promise<{ items: AllMenuDTO[]; categories: Categories[]}> {
    const menu = await getAllMenuRepo();
    const categories = await getCategoriesRepo();
    return {
        items: mapMenuDTO(menu),
        categories
    };
}

export async function getDishBySearch(query: string): Promise<MenuItem[]> {
    const res = await getDishBySearchRepo(query);
    return mapMenuItems(res);
}


// export async function getCurrentStopList() {
//     const res = await getCurrentStopListRepo();
//     return mapStopListItemsToService(res);
// }

// export async function addItemToStop(itemId: number) {
    
//     const catId = await addItemToStopRepo(itemId);
//     const res = await getCurrentStopList();
//     return { currentStopList : res, catId };
// }


// export async function deleteItemFromStop(itemId: number) {
//     await deleteItemFromStopRepo(itemId);
//     const res = await getCurrentStopListRepo();
//     return mapStopListItemsToService(res);
// }
