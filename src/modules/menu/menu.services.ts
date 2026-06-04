import { mapStopListItemsToService } from "./menu.mapper";
import {getAllMenuRepo, getCategoriesRepo} from "./menu.repository";


export async function getAllMenu() {
    const items = await getAllMenuRepo();
    const categories = await getCategoriesRepo();
    return {
        items,
        categories
    };
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
