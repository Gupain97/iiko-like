import { OrderStatus } from "../domain/orderStatus";

export interface Order {
    id: number,
    userId: number,
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


export interface OrderItem {
    id: number, 
    orderId: number,
    price: number, 
    name: string,
    quantity: number,
    printed : boolean,
    printedAt : Date | null,
}

export interface OrderView {
    id: number,
    userId: number,

    waiterName: string,
    waiterSurName: string, 

    status: OrderStatus,
    tableId: number,
    tableNumber: number | undefined,
    guestsCount: number | undefined, 
    createdAt: Date,
    precheckAt: Date | null,
    closedAt: Date | null,
    items: OrderItem[],
}