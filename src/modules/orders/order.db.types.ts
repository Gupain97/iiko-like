import { OrderStatus } from "../../domain/orderStatus";

export interface OrderRow {
    id: number;
    user_id: number,
    status: OrderStatus;
    guests_count: number;
    table_id: number;
    table_number: number;
    created_at: Date;
    prechecked_at: Date | null;
    closed_at: Date | null;
    items: [];

}