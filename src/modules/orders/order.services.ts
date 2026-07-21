//import { orders } from './order.storage'
import { NewOrder, Order } from './order.types'
import {  mapOrderToDTO, mapOrderFullDTO, mapOrderWithItems, mapOrderSlotDTO } from './order.mapper';
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
import { AppError } from '../../errors/AppErrors';
import { markItemsPrintedRepo } from '../order-items/orderItems.repository';
import { getUserStatusRepo } from '../shifts/shifts.repository';
import { getUserRoleRepo } from '../users/users.repository';
import { Role } from '../users/users.types';
import { stationService } from '../station/station.services';
// import { WebSocketService } from '../../websocet/firstSocet';
// import { wss } from '../../index';

import { webSocketService } from '../../bootstrap';    




 

const ACTIVE_STATUSES : OrderStatus[] = [
    "OPEN",
    "PRINTED",
    "PRECHECK",
    
]

export const ADMIN_ROLES : Role[]= [
    "MANAGER",
    "DIRECTOR"
]

export async function createOrGetOrder(tableId: number, userId: number, guestsCount?: number, tableNumber?: number): Promise<OrderFullDTO | null>{


    const existingOrder = await findOrderByTableRepo(tableId, userId);
    const order = mapOrderWithItems(existingOrder);
    const userRole = await getUserRoleRepo(userId);
   // const user = await getUserForSessionId(sessionId);
    
        
    if (order && ACTIVE_STATUSES.includes(order.status)) {
        return mapOrderFullDTO(existingOrder);
    } else if (userRole && ADMIN_ROLES.includes(userRole)) {
        const order = await getHimOrderByTableRepo(tableId, userId);
      //  console.log("userRole:", userRole, ADMIN_ROLES);
        return mapOrderFullDTO(order);
    }
    if (existingOrder.length < 1 ) {
        if (!guestsCount) {
            throw new AppError('GUEST_COUNT_REQUIRED!', 400);
        }
    }
    const newOrder: NewOrder = {
        userId,
        tableNumber:  tableNumber,
        guestsCount: guestsCount, 
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

    const order = await findOrderByOrderIdRepo(orderId);
    if (!order || order[0].status !== "OPEN" && order[0].status !== "PRINTED") throw new Error("ORDER_NOT_FOUND"); // исправить 

    const markItems = await markItemsPrintedRepo(orderId);
    const ticketId = await stationService.addOrder(orderId);
    await stationService.addItem(markItems, ticketId);
    webSocketService.sendMessage('message');
    
    const res = await findOrderByOrderIdRepo(orderId);
    
    return mapOrderFullDTO(res);
    
   

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

    const order = await findOrderByOrderIdRepo(orderId);
    
    
    if (!order || order[0].status !== "PRECHECK") {
        throw new Error('ORDER_NOT_FOUND');
    };
    
    await closeOrderRepo(orderId, userId);

    return mapOrderFullDTO(order);
}

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
