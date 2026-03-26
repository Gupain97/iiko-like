import { OrderStatus } from "../domain/orderStatus"


export type OrderItemDTO = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    printed: boolean;
    printedAt: Date | null;
}

export type OrderDTO = {
    id: number;
    tableNumber: number | undefined;
    guestsCount: number | undefined;
    status: OrderStatus;
    tableId: number;
    items: OrderItemDTO[];
    total: number;
    createdAt: Date;
    precheckAt: Date | null;
    closedAt: Date | null;
    
}


//////////
export type OrderWithNameDTO = {
    id: number;
    tableNumber: number | undefined;
    guestsCount: number | undefined;
    waiterName : string;
    waiterSurname: string;
    status: OrderStatus;
    tableId: number;
    items: OrderItemDTO[];
    total: number;
    createdAt: Date;
    precheckAt: Date | null;
    closedAt: Date | null;
    
}