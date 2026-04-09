
import { Request, Response  } from "express";
import { getAllMenu } from "./menu.services";


export const getAllMenuController = async (req:Request, res: Response ) => {

    const menu = await getAllMenu();

    res.json(menu);
}