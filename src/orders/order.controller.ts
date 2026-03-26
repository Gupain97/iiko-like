import { Request, Response } from "express";
import { orders } from './order.storage';
import {
    createOrGetOrder,
    getOrderByTable,
   // addItemToOrder,
   // closeOrderByTable,
    getOrderById,
  //  calculateTotal,
    printOrder,
    precheckOrder,
    addItemFromDB,
    
} from './order.services'
import { openTable } from "../tables/tables.services";


export const getOrders = async (req: Request, res: Response) => {
    res.json(orders);
};

export const createOrGetOrderController = async (req: Request, res: Response) => {

        const tableId = Number(req.body.tableId);
        const userId = Number(req.body.userId);
        const guestsCount = Number(req.body.guestsCount);
        const tableNumber = Number(req.body.tableNumber);

        // const table = await openTable(tableId, userId, guestsCount);
       // const order = orders.find(o => o.tableId === tableId)
        const order = await createOrGetOrder(tableId, userId, guestsCount, tableNumber);
 
        res.json(order);
    
};

 

// export const addItemToOrderController = async (req: Request, res: Response) => {
    
//         const { orderId, name, price, quantity } = req.body;
//         const itemData = { name, price, quantity };
//         const order = await addItemToOrder(orderId, itemData);
//         res.json({...order});
    
// };
export const addItemToOrderControllerNew = async (req:Request, res: Response) => {
    const { menuItemId } = req.body;
    const orderId = Number(req.params.id);
    const order = await addItemFromDB(orderId, menuItemId);
    res.json({...order});
}

export const printOrderController = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.body.orderId);
        const printedOrder = await printOrder(orderId);
        res.json(printedOrder);
    } catch (err) {
        res.status(400).json({message: (err as Error).message});
    }
}

// export const getOrderByIdController = (req: Request, res: Response) => {
//     try {
//         const orderId = Number(req.params.orderId);
//         const order = getOrderById(orderId);
//         if (!order) throw new Error("TABLE_NOT_FOUND");
//         res.json({...order});
//     } catch (err) {
//         res.status(400).json({message: (err as Error).message});
//     }
// };

export const prechekOrderController = async (req: Request, res: Response) => {
        const orderId = Number(req.body.orderId);
        const order = await precheckOrder(orderId);
        if (!order) throw new Error("ORDER_NOT_FOUND_BY_CONTROLLER");
        res.json({...order});

}

// export const closeOrderController = (req: Request, res: Response) => {
//     try {
//         const tableId = Number(req.body.tableId);
//         const order = closeOrderByTable(tableId);
//         res.json({...order, total: calculateTotal(order)});
//     } catch (err) {
//         res.status(400).json({message: (err as Error).message});
//     }
// };