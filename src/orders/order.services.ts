//import { orders } from './order.storage'
import { NewOrder, Order, OrderItem } from './order.types'
import { mapOrderItemToDTO, mapOrderToDTO, mapRowOrder } from './order.mapper';
import { OrderDTO, OrderItemDTO, OrderWithNameDTO} from './order.dto';
import { OrderStatus } from '../domain/orderStatus';

import { findOrderByOrderIdRepo,
     findOrderByTableRepo,
      getAllOrdersRepo,
       saveOrderRepo,
        getNextOrderIdSeq,
         getNextOrderItemsIdSeq,
         updateStatusOrderRepo,
         closeOrderRepo,
         precheckOrderRepo,
        } from './order.repositiry';
import { findTableByTableIdRepo } from '../tables/tables.repository'
import { openTable } from '../tables/tables.services';
import { AppError } from '../errors/AppErrors';
import { addItemRepo, markItemsPrintedRepo } from '../order-items/orderItems.repository';
import { findItemByIdRepo } from '../menu/menu.repository';


 

const ACTIVE_STATUSES : OrderStatus[] = [
    "OPEN",
    "PRECHECK",
    
]

export async function createOrGetOrder(tableId: number, userId: number, guestsCount?: number, tableNumber?: number): Promise<OrderWithNameDTO | undefined>{

    const existingOrder = await findOrderByTableRepo(tableId);
 
    if (existingOrder && ACTIVE_STATUSES.includes(existingOrder.status)) {
        
        return mapOrderToDTO(existingOrder);
    }
      
    const existingTable = await findTableByTableIdRepo(tableId);
    if (!existingTable?.isOpen) {
        if(!guestsCount){
            throw new AppError('GUEST_COUNT_REQUIRED!', 400);
        }
        await openTable(tableId, userId, guestsCount);
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
    const retOrder = await findOrderByTableRepo(tableId);
    if (!retOrder) throw new Error('FUCKING_SHIT');
    
    return mapOrderToDTO(retOrder);
}


// export async function addItemToOrder(orderId: number, itemData: Omit<OrderItem, 'id' | 'orderId' | 'printed' | 'printedAt' >): Promise<OrderDTO> {
//     const order = await findOrderByOrderIdRepo(orderId);
//     if ( !order || order.status !=="OPEN" ) throw new Error('ORDER_NOT_OPEN');
    
//     const item : OrderItem = {
//         id: getNextOrderItemsIdSeq(),
//         orderId: order.id,
//         printed: false,
//         printedAt: null,
//         ...itemData
//     };


    
//     const existingItem = order.items.find(i => i.name === item.name && item.printed !== true );
//     if (existingItem) {
//         existingItem.quantity += item.quantity;
//     } else {
//         console.log('добавляю позицию в заказ')
//         await addItemRepo(item);
//         console.log('добавил позицию в заказ')
//     }
//     return mapOrderToDTO(order);
// }

export async function addItemFromDB(orderId: number, itemId: number) : Promise<OrderDTO | undefined> {
    const order = await findOrderByOrderIdRepo(orderId);
    const itemData = await findItemByIdRepo(itemId);
    
    if (!order || !itemData) throw new Error("ORDER_OR_ITEM_NOT_FOUND");
    if (order.status !== "OPEN") throw new AppError("ORDER_NOT_OPEN!", 400);

    const item : OrderItem = {
        id: getNextOrderItemsIdSeq(),
        orderId: order.id,
        printed: false,
        printedAt: null,
        name: itemData.name,
        price: itemData.price,
        quantity: 1
    };

    if (!item) throw new Error("ITEM_NOT_CREATED");

    await addItemRepo(item);
    

    const newOrder = await findOrderByOrderIdRepo(orderId);
    if (!newOrder) return mapOrderToDTO(order);

    return mapOrderToDTO(newOrder); 
}

export async function printOrder(orderId : number) : Promise<OrderDTO> {

    const order = await findOrderByOrderIdRepo(orderId);
    if (!order || order.status !== "OPEN") throw new Error("ORDER_NOT_FOUND"); 

    const updateOrder = await markItemsPrintedRepo(orderId);
    if (!updateOrder) throw new Error('break update order'); 

    return mapOrderToDTO(updateOrder);
    
   

}


export async function getOrderByTable(tableId: number): Promise<OrderDTO | undefined> {
    const order = await findOrderByTableRepo(tableId);

    if (!order) {

    }
    return 
}

export async function precheckOrder(orderId: number): Promise<OrderDTO> {

    const order = await findOrderByOrderIdRepo(orderId);
 

    if (!order || order.status !== "OPEN") {
        throw new Error("ORDER_NOT_FOUND");
    }

    const updateOrder = await precheckOrderRepo(orderId);
    if (!updateOrder) throw new Error('ORDER_NOT_PRECHECKED')
 
    return mapOrderToDTO(updateOrder);
    
}


export async function closeOrderByOrderId(orderId: number, userId: number): Promise<OrderDTO> {

    const order = await findOrderByOrderIdRepo(orderId);
    
    
    if (!order || order.status !== "PRECHECK") {
        throw new Error('ORDER_NOT_FOUND');
    }
    const tableId = order.tableId;
    
    await closeOrderRepo(orderId, userId, tableId );

    return mapOrderToDTO(order);// исправить
}

export async function getOrderById(orderId: number): Promise<OrderDTO | undefined> {
    const order = await findOrderByOrderIdRepo(orderId);
    if (!order) throw new Error("OEDER_NOT_FOUND");
    return mapOrderToDTO(order);
}

export async function getActiveOrders(): Promise<Order[] | undefined> {
    const orders = await getAllOrdersRepo();
 
    return  orders.filter(o => ACTIVE_STATUSES.includes(o.status)); 
    
}