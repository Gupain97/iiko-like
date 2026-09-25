import { OrderStatus } from "../../domain/orderStatus";
import { Sources } from "../../domain/sources";
import { OrderItem } from "../orders/order.types";


export type DeliveryStatus  = ( "NEW" | "SENT" | "COMPLETE" ) ; 


export interface CallCenterOrder {
    service : Sources;
    crmOrderId: number;
    operatorId: number;
    items: OrderItem[];
    customerName: string;
    phoneNumber: string;
    guestsCount: number;
    address?: string;
    comments: string;
    createdAt: string;
    
}

export interface DeliveryOrder {    
    source: Sources;
    status: OrderStatus;
    guestsCount: number | undefined;
    createdAt: Date;
    createdBy: number;
    precheckAt: Date | null;
    closedAt: Date | null;
    comments: string;
    items: OrderItem[];
      
}

export interface CustomerData {
    orderId: number;
    customerName: string;
    phoneNumber: string;
    address: string | undefined ;
    eMail: string;
}

export interface DeliveryRaw {
    
}

export interface DeliveryOrderDTO {
    orderId: number;
    customerName: string;
    address: string;
    phoneNumber: string;
    guestsCount: number;
    deliveryStatus: string;
    comments: string;
    eMail: string;
    createdAt: Date;
    items: OrderItem[];
    total: number;
    
}