import { OrderStatus } from "../../domain/orderStatus";
import { OrderItem  } from "./order.types";


export type OrderWithNameRow = {
    order_id: number;
    user_id: number;

    waiter_name: string;
    waiter_surname: string;

    status: OrderStatus;
    table_id: number;
    table_number: number | undefined;
    guests_count: number | undefined;
    created_at: Date;
    prechecked_at: Date | null;
    closed_at: Date | null;
    total: number; 

    item_id: number;
    item_name: string;
    order_item_order_id: number;
    quantity: number ;
    price: number ;
    printed: boolean;
    printed_at: Date | null;

    

}