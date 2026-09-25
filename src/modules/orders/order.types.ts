import { OrderStatus } from "../../domain/orderStatus";
import { Sources } from "../../domain/sources";

export interface Order {
    id: number,
    userId: number,
    source: Sources,
    status: OrderStatus,
    tableId: number,
    tableNumber: number | undefined,
    guestsCount: number | undefined, 
    createdAt: Date,
    precheckAt: Date | null,
    closedAt: Date | null,
    items: OrderItem[],
}

export type NewOrder = Omit<Order, 'id'>

// export interface DeliveryOrder {
//     source: Sources,
//     userId: number,
//     status: OrderStatus,
//     guestsCount: number | undefined,
//     createdAt: Date,
//     precheckAt: Date | null,
//     closedAt: Date | null,
//     items: OrderItem[],

// }


export interface OrderItem {
    id: number, 
    orderId: number,
    price: number, 
    name: string,
    quantity: number,
    printed : boolean,
    printedAt : Date | null,
}
