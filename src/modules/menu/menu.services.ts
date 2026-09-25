
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
