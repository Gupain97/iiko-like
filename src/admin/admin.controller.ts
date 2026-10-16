import { Request, Response } from "express";
import { getAllItems, getAllCategories, addCategory, addMenuItem, getAllUsers, addUser, getIngredients, addIngredient, updateDishRecipe} from "./admin.services";
import { getDishForAdminRepo } from "../modules/menu/menu.repository";
import { getDishForAdmin } from "../modules/menu/menu.services";
import { getAdminUser, loginAdmin } from "./admin.auth";


export const getPossiblyfunctionsController = async (req: Request, res: Response) => {
    const result = await getAllItems();
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
    const result = await  addCategory(name); 
}

export const addMenuItemController = async (req: Request, res: Response) => {
    const {name, price, categoryId} = req.body ;
    await addMenuItem(name, price, categoryId);
}

export const getAllUsersController = async (req: Request, res: Response) => {
    const result = await getAllUsers();

    res.json(result);
}

export const addUserController = async (req: Request, res: Response) => {
    const {name, surname, role, pin } = req.body;
    await addUser(name, surname, role, pin);
};


export const getAdminUserController = async (req:Request, res: Response) => {
    console.log("Мы в контроллере админ")
    const {login, password } = req.body;
    const response = await getAdminUser(login, password);
    res.json(response)
};

export const getDishForAdminController = async (req:Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await getDishForAdmin(id);
    res.json(result);
};

export const loginAdminController = async (req: Request, res: Response) => {
    const {login, password} = req.body;
    const token = await loginAdmin(login, password);
    res.cookie('token', token);
    res.json({message:'ok'});
};

export const getIngredientsController = async (req:Request, res: Response) => {
    const result = await getIngredients();
    res.json(result);
}

export const addIngredientController = async (req: Request, res: Response) => {
    const {name, unit, quantity} = req.body
    await addIngredient(name, unit, quantity);
};

export const updateRecipeController = async (req:Request, res:Response) => {
   const ingredients = req.body.ingredients;
   const dishId = Number(req.params.itemId);
   await updateDishRecipe(dishId, ingredients);
   
}