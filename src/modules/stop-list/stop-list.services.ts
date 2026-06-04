import { StopListDTO } from "./stop-list.dto";
import { mapStopListDTO } from "./stop-list.mapper";
import { addDishToStopRepo, addReamainderRepo, checkDishRemainderRepo, decrementRemainderRepo, getDishFromStopRepo, getStopListRepo, removeFromStopListRepo } from "./stop-list.repository";



export async function addDishToStop(itemId: number, userId:number){
    const dish = await checkDishInStop(itemId); // вывести в отдельный сервис 
    const remainder = await checkDishRemainder(itemId);
    if (dish || remainder) return;
    const catId = await addDishToStopRepo(itemId, userId);
    const res = await getStopList();
    return {
        currentStopList: res,
        catId
    };
}

export async function addRemainder(dishId: number, count: number ) {
    const dish = await addReamainderRepo(dishId, count)
   // if (!dish) return 
    const res = await getStopList();
    return res;
}

export async function getStopList(): Promise<StopListDTO[] | undefined> {
    const res = await getStopListRepo();
    return mapStopListDTO(res);
}

export async function removeFromStop(itemId:number , userId: number) {
    await removeFromStopListRepo(itemId, userId);
    const res = await getStopList();
    return res;
}


export async function checkDishInStop(itemId: number) { 
    const res = await getDishFromStopRepo(itemId);
    if (res.length >= 1 ) return true 
    return false;
}

export async function checkDishRemainder(dishId: number) {
    const res = await checkDishRemainderRepo(dishId);
    return res;
}

export async function decrementRemainder(dishId:number)  {
    const res = await decrementRemainderRepo(dishId);
    return res;
}