
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
