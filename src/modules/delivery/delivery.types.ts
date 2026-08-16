import { OrderItem } from "../orders/order.types";



export interface DeliveryOrder {
    service : string;
    id: number;
    items: OrderItem[];
    customerName: string;
    phoneNumber: string;
    address?: string;
    comments: string;
    createdAt: string;
}