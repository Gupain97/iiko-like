import { OrderStatus } from "../../domain/orderStatus";
import { Sources } from "../../domain/sources";

export interface OrderRow {
    id: number;
    user_id: number,
    source: Sources,
    status: OrderStatus;
    guests_count: number;
    table_id: number;
    table_number: number;
    created_at: Date;
    prechecked_at: Date | null;
    closed_at: Date | null;
    items: [];

}


export interface OrderSlotRow {
    id: number;
    table_id: number;
    table_number: number;
    status: string;
}