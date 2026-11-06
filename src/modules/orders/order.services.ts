//import { orders } from './order.storage'
import { NewOrder, Order } from './order.types'
import {  mapOrderToDTO, mapOrderFullDTO, mapOrderWithItems, mapOrderSlotDTO, mapOrderToSales } from './order.mapper';
import { OrderDTO, OrderFullDTO, OrderSlotsDTO} from './order.dto';
import { OrderStatus } from '../../domain/orderStatus';


import { findOrderByOrderIdRepo,
     findOrderByTableRepo,
      getAllOrdersRepo,
       saveOrderRepo,
         closeOrderRepo,
         precheckOrderRepo,
         getWaiterOrdersRepo,
         updateStatusOrderRepo,
         getHimOrderByTableRepo,
        } from './order.repository';
//import { findTableByTableIdRepo } from '../tables/tables.repository'
;
import { AppError, DishInStopList } from '../../errors/AppErrors';
import { getUserRoleRepo } from '../auth/users/users.repository';
import { Role } from '../auth/users/users.types';
import { stationService } from '../station/station.services';
// import { WebSocketService } from '../../websocet/firstSocet';
// import { wss } from '../../index';

import { webSocketService } from '../../bootstrap';    
import { addItemsToSale, getMarkItems, getOrderItems, markItemsPrinted } from '../order-items/orderItems.service';
import { mapItemsToSale, mapOrderItems } from '../order-items/orderItems.mapper';
import { pool } from '../../config/db';




 

const ACTIVE_STATUSES : OrderStatus[] = [
    "OPEN",
    "PRINTED",
    "PRECHECK",
    
]

export const ADMIN_ROLES : Role[]= [
    "MANAGER",
    "DIRECTOR"
]


// export async function createOrder(tableId: number, userId: number, items:OrderItem[], guestsCount?: number, tableNumber?: number) {
//         const newOrder: NewOrder = {
//         userId,
//         tableNumber,
//         guestsCount,
//         source: "POS",
//         status: "OPEN",
//         tableId,
//         createdAt: new Date(),
//         precheckAt: null,
//         closedAt: null,
//         items
//     };

//     const order = await saveOrderRepo(newOrder);
//     return order 
    
// }

export async function createOrGetOrder(tableId: number, userId: number, guestsCount?: number, tableNumber?: number): Promise<OrderFullDTO | null>{

    const existingOrder = await findOrderByTableRepo(tableId, userId);
    const order = mapOrderWithItems(existingOrder);
    const userRole = await getUserRoleRepo(userId);
   // const user = await getUserForSessionId(sessionId);
    
        
    if (order && ACTIVE_STATUSES.includes(order.status)) {
        return mapOrderFullDTO(existingOrder);
    } else if (userRole && ADMIN_ROLES.includes(userRole)) {
        const order = await getHimOrderByTableRepo(tableId, userId);
        return mapOrderFullDTO(order);
    }
    if (existingOrder.length < 1 ) {
        if (!guestsCount) {
            throw new AppError('GUEST_COUNT_REQUIRED!', 400);
        }
    }
    const newOrder: NewOrder = {
        userId,
        tableNumber,
        guestsCount,
        source: "POS",
        status: "OPEN",
        tableId,
        createdAt: new Date(),
        precheckAt: null,
        closedAt: null,
        items: []
    };
 

    await saveOrderRepo(newOrder);
    const retOrder = await findOrderByTableRepo(tableId, userId);
    if (!retOrder) throw new Error('FUCKING_SHIT');
    
    return mapOrderFullDTO(retOrder);
}

export async function printOrder(orderId : number) : Promise<OrderFullDTO | null > {

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const order = await findOrderByOrderIdRepo(orderId);
        if (!order || order[0].status !== "OPEN" && order[0].status !== "PRINTED") throw new Error("ORDER_NOT_FOUND"); // исправить 
        const checkStopList = await getMarkItems(orderId); 
        if ( checkStopList.length > 0 ) throw new DishInStopList();
        const markItems = await markItemsPrinted(client, orderId);
        const ticketId = await stationService.addOrder(orderId);
        await stationService.addItem(markItems, ticketId); // здесь просто прощупывание работы через классы
        webSocketService.sendMessage('message');
        
        await client.query("COMMIT");
        const res = await findOrderByOrderIdRepo(orderId);
        
        return mapOrderFullDTO(res);
    } catch (error) {
        await client.query("ROLLBACK");
        throw new Error("ERROR PRINTED");
    } finally {
        client.release();
    }

}


export async function precheckOrder(orderId: number): Promise<OrderFullDTO | null> {

    const order = await findOrderByOrderIdRepo(orderId);
 

    if (!order || order[0].status !== "OPEN" && order[0].status !== "PRINTED") {
        throw new Error("ORDER_NOT_FOUND");
    }
    await printOrder(orderId);
    const updateOrder = await precheckOrderRepo(orderId);
    if (!updateOrder) throw new Error('ORDER_NOT_PRECHECKED')
 
    return mapOrderFullDTO(updateOrder);
    
}

export async function cancelPrecheckOrder(orderId: number) {
    const up = await updateStatusOrderRepo(orderId, "PRINTED");
    const res = await findOrderByOrderIdRepo(orderId);
    return mapOrderFullDTO(res);
}


export async function closeOrderByOrderId(orderId: number, userId: number): Promise<OrderFullDTO | null > {

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const order = await findOrderByOrderIdRepo(orderId);
        const mapOrder = mapOrderFullDTO(order);
        if (!order || order[0].status !== "PRECHECK" || !mapOrder) {
            throw new Error('ORDER_NOT_FOUND');
        };
    
        const items = await getOrderItems(orderId);
        const mapItems = mapOrderItems(items);
        
        
        const closeOrder = await closeOrderRepo(
            client,
            orderId, 
            userId, 
            mapOrderToSales(mapOrder, userId)
        ); // Тут пока криво , потом решим
        const saleId = closeOrder.id;
        const saleItems = mapItemsToSale(mapItems, saleId);
        await addItemsToSale(client, saleItems);
        await client.query("COMMIT");
        return mapOrder;
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        throw new Error('ТРАНЗАКЦИЯ НЕ ЗАВЕРШЕНА!');
    
    } finally {
        client.release();
    }

};


export async function getOrderById(orderId: number): Promise<OrderFullDTO | null > {
    const order = await findOrderByOrderIdRepo(orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");
    return mapOrderFullDTO(order);
}

export async function getActiveOrders(): Promise<Order[] | undefined> {
    const orders = await getAllOrdersRepo();
 
    return  orders.filter(o => ACTIVE_STATUSES.includes(o.status)); 
    
}

export async function getWaiterOrders(waiterId: number) : Promise<OrderSlotsDTO[]> {
    const orders = await getWaiterOrdersRepo(waiterId);
    return mapOrderSlotDTO(orders); 
}
