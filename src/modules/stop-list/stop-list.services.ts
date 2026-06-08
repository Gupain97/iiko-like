import { StopListDTO } from "./stop-list.dto";
import { mapStopListDTO } from "./stop-list.mapper";
import { addDishToStopRepo, addReamainderRepo, checkDishRemainderRepo, decrementRemainderRepo, getDishFromStopRepo, getStopListRepo, removeFromStopListRepo } from "./stop-list.repository";



export async function addDishToStop(itemId: number, userId:number): Promise<{currentStopList: StopListDTO[], catId: number}| null>{
    const dish = await checkDishInStop(itemId); // вывести в отдельный сервис 
    const remainder = await checkDishRemainder(itemId);
    if (dish || remainder) return null;;
    const catId = await addDishToStopRepo(itemId, userId);
    const res = await getStopList();
    return {
        currentStopList: res,
        catId
    };
}

export async function addRemainder(dishId: number, count: number ): Promise<StopListDTO[]> {
    await addReamainderRepo(dishId, count)
   // if (!dish) return 
    const res = await getStopList();
    return res;
}

export async function getStopList(): Promise<StopListDTO[]> {
    const res = await getStopListRepo();
    return mapStopListDTO(res);
}

export async function removeFromStop(itemId:number , userId: number): Promise<StopListDTO[]>{
    await removeFromStopListRepo(itemId, userId);
    const res = await getStopList();
    return res;
}


export async function checkDishInStop(itemId: number): Promise<boolean> { 
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