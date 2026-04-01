
import { Request, Response  } from "express";
import { getAllMenu } from "./menu.services";


export const getAllMenuController = async (req:Request, res: Response ) => {
    console.log('зашли в контроллер гет меню')
    const menu = await getAllMenu();

    res.json(menu);
}