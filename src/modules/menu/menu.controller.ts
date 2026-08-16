
import { Request, Response  } from "express";
import {getAllMenu, getDishBySearch} from "./menu.services";


export const getAllMenuController = async (req:Request, res: Response ) => {

    const menu = await getAllMenu();

    res.json(menu);
};

export const getDishBySearchController = async (req: Request, res: Response) => {
    const result = await getDishBySearch(req.body.query);
    res.json(result);
}


// export const getCurrentStopListController = async (req:Request, res: Response) => {
//     const result = await getCurrentStopList();
//     res.json(result);
// }

// export const addItemToStopController = async (req:Request, res:Response) => {
//     console.log("Сработал контроллер меню")
//     const itemId = req.body.itemId; 
//     const result = await addItemToStop(itemId);
//     res.json(result);
// }

// export const deleteItemFromStopController = async (req:Request, res:Response) => {
//     const itemId = req.body.itemId;
//     const result = await deleteItemFromStop(itemId);
//     res.json(result);
// }