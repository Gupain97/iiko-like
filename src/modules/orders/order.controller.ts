import { Request, Response } from "express";
import {
    createOrGetOrder,
    printOrder,
    precheckOrder,

    closeOrderByOrderId,
    getWaiterOrders,
    cancelPrecheckOrder,

    
} from './order.services'



export const getOrdersController = async (req: Request, res: Response) => {
    const waiterId = Number(req.params.id); 
    const cook = req.cookies;
    console.log('coockie in backend:', cook);
    const orders = await getWaiterOrders(waiterId);
    res.json(orders);
};

export const createOrGetOrderController = async (req: Request, res: Response) => {
        const sessionId = req.cookies.sessionId;

        const tableId = Number(req.body.tableId);
        const userId = Number(req.body.waiterId);
        const guestsCount = Number(req.body.guestsCount);
        const tableNumber = Number(req.body.tableNumber);

        const order = await createOrGetOrder(tableId, userId, sessionId, guestsCount, tableNumber);
 
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



export const closeOrderByOrderIdController = async (req:Request, res:Response) => {
    const oId = Number(req.body.orderId);
    const userId = Number(req.body.userId);
    const result = await closeOrderByOrderId(oId, userId);
    res.json(result);

}
