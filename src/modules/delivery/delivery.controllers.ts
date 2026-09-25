import { Request, Response } from "express";
import { getWeather } from "../../intergrations/weather/wather.client";
import { getDeliveryFromOrderId, getDeliveryOrders, getWeathForDev, updateStatusDelivery } from "./delivery.services"; 
import { AuthRequest } from "../auth/auth.types/auth-request";


export const getWeatherController = async (req:Request, res:Response) => {
    const result = await getWeathForDev(47.22, 39.72 );
    res.json(result)
};


export const getDeliveryOrdersController = async (req:Request, res:Response) => {
    const result = await getDeliveryOrders();
    res.json(result);
}


export const updateStatusDeliveryController = async (req:AuthRequest, res: Response) => {
    if (!req.user) throw new Error("User not found");
    const userId = req.user.id; 
    console.log("req.body:", req.body);
    const orderId = req.body.orderId;
    console.log("orderId", orderId);
    const status = req.body.status;
    const deliveryId = Number(await getDeliveryFromOrderId(orderId));
    console.log("deliveryId", deliveryId);
    const result = await updateStatusDelivery(deliveryId, status, userId)
    res.json(result);
}