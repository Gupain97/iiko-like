import { Request, Response } from "express";
import { addItemFromDB, addItemQuantity, decrementItemQantity, deletItemFromOrder } from "./orderItems.service";




export const addItemToOrderControllerNew = async (req:Request, res: Response) => {
    const { menuItemId } = req.body;
    const orderId = Number(req.params.id);
    const order = await addItemFromDB(orderId, menuItemId);
    res.json({...order});
}




export const addItemQuantityController = async (req: Request, res:Response) => {
 
    const itemId = Number(req.params.itemId);
    const orderId = Number(req.body.orderId);
    const result = await addItemQuantity(itemId, orderId);
    res.json(result);
    
}

export const decrementItemQantityController = async (req: Request, res: Response) => {
    const itemId = Number(req.params.itemId);
    const orderId = Number(req.body.orderId);
    const result = await decrementItemQantity(itemId, orderId);
    res.json(result);
}

export const deleteItemController = async (req: Request, res: Response) => {
    const itemId = Number(req.params.itemId);
    const orderId = Number(req.body.orderId);
    const result = await deletItemFromOrder(itemId, orderId);
    res.json(result);
}

