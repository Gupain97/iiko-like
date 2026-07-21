import { Request, Response } from "express";
import {
    createOrGetOrder,
    printOrder,
    precheckOrder,

    closeOrderByOrderId,
    getWaiterOrders,
    cancelPrecheckOrder,

    
} from './order.services'
import { AuthRequest } from "../auth/auth.types/auth-request";



export const getOrdersController = async (req: Request, res: Response) => {
    const waiterId = Number(req.params.id); 
    const orders = await getWaiterOrders(waiterId);
    res.json(orders);
};

export const createOrGetOrderController = async (req: Request, res: Response) => {
        const tableId = Number(req.body.tableId);
        const userId = Number(req.body.waiterId);
        const guestsCount = Number(req.body.guestsCount);
        const tableNumber = Number(req.body.tableNumber);

        const order = await createOrGetOrder(tableId, userId, guestsCount, tableNumber);
 
        res.json(order);
    
};

 



export const printOrderController = async (req: Request, res: Response) => {
 
        const orderId = Number(req.body.orderId);
        const printedOrder = await printOrder(orderId);
        res.json(printedOrder);
 
}


export const prechekOrderController = async (req: Request, res: Response) => {
        const orderId = Number(req.body.orderId);
        const order = await precheckOrder(orderId);
        if (!order) throw new Error("ORDER_NOT_FOUND_BY_CONTROLLER");
        res.json({...order});

}

export const cancelPrecheckOrderController = async (req: Request, res: Response) => {
    const orderId = Number(req.body.orderId);
    const order = await cancelPrecheckOrder(orderId);
    res.json(order);
}



export const closeOrderByOrderIdController = async (req:AuthRequest, res:Response) => {
    const oId = Number(req.body.orderId);
    if (!req.user) throw new Error('Пользователь не найден');
    const userId = req.user.id;
    const result = await closeOrderByOrderId(oId, userId);
    res.json(result);

}
