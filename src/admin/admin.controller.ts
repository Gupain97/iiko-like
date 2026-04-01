import { Request, Response } from "express";
import { getAllItems, getAllCategories, addCategory, addMenuItem, getAllUsers, addUser } from "./admin.services";


export const getPossiblyfunctionsController = async (req: Request, res: Response) => {
    const result = await getAllItems();
    console.log('мы зашли в контроллер админа', result);
    res.json(result);
    
}

export const getAllItemsController = async (req:Request, res: Response) => {
    const result = await getAllItems();
    res.json(result);
}

export const getAllCategoriesController = async (req: Request, res: Response) => {
    const result = await getAllCategories();
    res.json(result);
}

export const addCategoryController = async (req: Request, res: Response) => {
    const name = req.body.name;
    console.log('nameRepo', name);
    const result = await  addCategory(name); 
}

export const addMenuItemController = async (req: Request, res: Response) => {
    const {name, price, categoryId} = req.body ;
    await addMenuItem(name, price, categoryId);
}

export const getAllUsersController = async (req: Request, res: Response) => {
    const result = await getAllUsers();
    console.log('getUsersController',result);
    res.json(result);
}

export const addUserController = async (req: Request, res: Response) => {
    const {name, surname, role, pin } = req.body;
    await addUser(name, surname, role, pin);
}