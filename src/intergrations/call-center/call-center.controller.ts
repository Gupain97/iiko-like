import { Request, Response } from "express";
import { createDelivery } from "../../modules/delivery/delivery.services";
import { mapCallCenterToDelivery } from "./call-center.mapper";
import { getDishBySearch } from "../../modules/menu/menu.services";


export const createDeliveryController = async (req:Request, res:Response) => {
    console.log('зашли куда-то');
    const data = req.body;
    await createDelivery(mapCallCenterToDelivery(req.body));
    return res.json({received: true, data});
}

export const getDishCCController = async (req:Request, res:Response) => {
    console.log('коллцентрконтроллер , гетДиш', req.body);
    const query = req.body.query;
    const result = await getDishBySearch(query);
    console.log('нашли блюдо, передали', result);
    return res.json(result);
    
}