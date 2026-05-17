
import { Request, Response  } from "express";
import { getAllMenu, getCurrentStopList } from "./menu.services";


export const getAllMenuController = async (req:Request, res: Response ) => {

    const menu = await getAllMenu();

    res.json(menu);
}


export const getCurrentStopListController = async (req:Request, res: Response) => {
    console.log("контроллер отработал");
    const result = await getCurrentStopList();
    console.log("result controller menu ", result);
    res.json(result);
}