import { Request, Response } from "express";
import { addDishToStop, addRemainder, getStopList, removeFromStop } from "./stop-list.services";


export const addDishToStopController = async ( req:Request, res: Response ) => {
    const {userId, itemId} = req.body;
    const result = await addDishToStop(itemId, userId );
    res.json(result);

}

export const addRemainderController = async (req: Request, res: Response) => {
    const {dishId, count} = req.body;
    const result = await addRemainder(dishId, count) ;
    res.json(result);
}

export const getStopListController = async (req:Request, res:Response) => {
    const result = await getStopList();
    res.json(result);
}

export const removeFromStopController = async (req:Request, res:Response) => {
    const {itemId, userId} = req.body;
    const result = await removeFromStop(itemId, userId);
    res.json(result);
}