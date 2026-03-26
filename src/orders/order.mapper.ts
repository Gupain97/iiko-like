import { Order, OrderItem, OrderView } from "./order.types";
import { OrderDTO, OrderItemDTO, OrderWithNameDTO } from "./order.dto";
import { OrderRow } from "./order.db.types";


export function mapOrderToDTO(order: Order): OrderDTO{
    const items = order.items ?? [];

    return {
        id: order.id,
        tableNumber: order.tableNumber,
        guestsCount: order.guestsCount,
        status: order.status,
        tableId: order.tableId,
        items: items.map(mapOrderItemToDTO),
        total: items.reduce(
            (sum, i) => sum + i.price * i.quantity, 0
        ),
        createdAt: order.createdAt,
        precheckAt: order.precheckAt,
        closedAt: order.closedAt,
    }
}

////////////////////////////////////////////////

export function mapOrderWithNameToDTO(order: OrderView): OrderWithNameDTO | undefined {
    const items = order.items ?? [];

    return {
        id: order.id,
        tableNumber: order.tableNumber,
        waiterName: order.waiterName,
        waiterSurname: order.waiterSurName,
        guestsCount: order.guestsCount,
        status: order.status,
        tableId: order.tableId,
        items: items.map(mapOrderItemToDTO),
        total: items.reduce(
            (sum, i) => sum + i.price * i.quantity, 0
        ),
        createdAt: order.createdAt,
        precheckAt: order.precheckAt,
        closedAt: order.closedAt,
    }
}

///////////////////////////////////////////////


export function mapOrderItemToDTO(item: OrderItem): OrderItemDTO {
    return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        printed: item.printed,
        printedAt: item.printedAt,

    };
}

export function mapRowOrder(row: OrderRow): Order {
 
    return {
        id: row.id,
        userId: row.user_id,
        status: row.status,
        guestsCount: row.guests_count,
        tableId: row.table_id,
        tableNumber: row.table_number,
        createdAt: row.created_at,
        precheckAt: row.prechecked_at,
        closedAt: row.closed_at,
        items: row.items
    }
}

export function mapOrderWithItems(rows: any[]) : Order | undefined {

    if (rows.length === 0) return undefined; 

    const first = rows[0];

    const order : Order = {
        id: first.order_id,
        status: first.status,
        tableId: first.table_id,
        userId: first.user_id,
        tableNumber: first.table_number,
        guestsCount: first.guests_count,
        createdAt: first.created_at,
        precheckAt: first.prechecked_at,
        closedAt: first.closed_at,
        

        items: []
    };

    for (const row of rows) {
         if (row.item_id) {
            order.items.push({
                 
                 id: row.item_id,
                 orderId: row.order_item_order_id,
                 name: row.item_name,
                 quantity: row.quantity,
                 price: row.price,
                 printed: row.printed,
                 printedAt: row.printed_at


                });
            }
    }
 

    return order;
}



//////////////////////////////////////////////

export function mapOrderWithItemsAndName(rows: any[]) : OrderView | undefined {

    if (rows.length === 0) return undefined; 

    const first = rows[0];

    const order : OrderView = {
        id: first.order_id,
        status: first.status,
        tableId: first.table_id,
        userId: first.user_id,
        waiterName: first.user_name,
        waiterSurName: first.user_surname,
        tableNumber: first.table_number,
        guestsCount: first.guests_count,
        createdAt: first.created_at,
        precheckAt: first.prechecked_at,
        closedAt: first.closed_at,
        

        items: []
    };

    for (const row of rows) {
         if (row.item_id) {
            order.items.push({
                 
                 id: row.item_id,
                 orderId: row.order_item_order_id,
                 name: row.item_name,
                 quantity: row.quantity,
                 price: row.price,
                 printed: row.printed,
                 printedAt: row.printed_at


                });
            }
    }
 

    return order;
}
////////////////////////////////////////////
// export function mapOrderToDTO(order: Order): OrderDTO {
//     return {
//         id: order.id,
//         status: order.status,
//         tableId: order.tableId,
//         items: order.items.map(mapOrderItemToDTO),
//         total: order.items.reduce(
//             (sum, i) => sum + i.price * i.quantity, 0
//         ),
//         createdAt: order.createdAt,
//         precheckAt: order.precheckAt,
//         closedAt: order.closedAt,

//     }
// }