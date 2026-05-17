//import { orders } from './order.storage'
import { NewOrder, Order } from './order.types'
import { mapOrderItemToDTO, mapOrderToDTO, mapRowOrder, mapOrderFullDTO, mapOrderWithItems } from './order.mapper';
import { OrderDTO, OrderItemDTO, OrderWithNameDTO} from './order.dto';
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
import { findTableByTableIdRepo } from '../tables/tables.repository'
;
import { AppError } from '../../errors/AppErrors';
import { markItemsPrintedRepo } from '../order-items/orderItems.repository';
import { getUserStatusRepo } from '../shifts/shifts.repository';
import { getUserRoleRepo } from '../users/users.repository';


 

const ACTIVE_STATUSES : OrderStatus[] = [
    "OPEN",
    "PRINTED",
    "PRECHECK",
    
]

export async function createOrGetOrder(tableId: number, userId: number, guestsCount?: number, tableNumber?: number): Promise<OrderWithNameDTO | undefined>{

    const existingOrder = await findOrderByTableRepo(tableId, userId);
    const order = mapOrderWithItems(existingOrder);
    const userRole = await getUserRoleRepo(userId);
    
        
    if (order && ACTIVE_STATUSES.includes(order.status)) {
        return mapOrderFullDTO(existingOrder);
    } else if (userRole && userRole === "MANAGER") {
        const order = await getHimOrderByTableRepo(tableId, userId);
        return mapOrderFullDTO(order);
    }
      
    const existingTable = await findTableByTableIdRepo(tableId);
    if (!existingTable?.isOpen) {
        if(!guestsCount){
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

export async function printOrder(orderId : number) : Promise<OrderDTO> {

    const order = await findOrderByOrderIdRepo(orderId);
    if (!order || order[0].status !== "OPEN" && order[0].status !== "PRINTED") throw new Error("ORDER_NOT_FOUND"); 

    const updateOrder = await markItemsPrintedRepo(orderId);
    const res = mapOrderWithItems(updateOrder);
    
    if (!res) throw new Error('break update order');
    

    return mapOrderToDTO(res);
    
   

}


export async function precheckOrder(orderId: number): Promise<OrderWithNameDTO | undefined> {

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


export async function closeOrderByOrderId(orderId: number, userId: number): Promise<OrderWithNameDTO | undefined> {

    const order = await findOrderByOrderIdRepo(orderId);
    
    
    if (!order || order[0].status !== "PRECHECK") {
        throw new Error('ORDER_NOT_FOUND');
    }
    const tableId = order[0].table_id;
    
    await closeOrderRepo(orderId, userId, tableId );

    return mapOrderFullDTO(order);// исправить
}

export async function getOrderById(orderId: number): Promise<OrderDTO | undefined> {
    const order = await findOrderByOrderIdRepo(orderId);
    if (!order) throw new Error("OEDER_NOT_FOUND");
    return mapOrderFullDTO(order);
}

export async function getActiveOrders(): Promise<Order[] | undefined> {
    const orders = await getAllOrdersRepo();
 
    return  orders.filter(o => ACTIVE_STATUSES.includes(o.status)); 
    
}

export async function getWaiterOrders(waiterId: number) {
    const orders = await getWaiterOrdersRepo(waiterId);
    return orders; 
}

// export async function getOpenCash(userId: number) {
//     const res = await getOpenCashRepository(userId);
    
// }
