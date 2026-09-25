import { Request, Response } from "express";
import { createDelivery } from "../../modules/delivery/delivery.services";
import { mapCallCenterToDelivery } from "./call-center.mapper";
import { getDishBySearch } from "../../modules/menu/menu.services";


export const createDeliveryController = async (req:Request, res:Response) => {
    const data = req.body;
    await createDelivery(mapCallCenterToDelivery(data));
    return res.json({received: true, data});
}

export const getDishCCController = async (req:Request, res:Response) => {
    const query = req.body.query;
    const result = await getDishBySearch(query);
    return res.json(result);
    
}