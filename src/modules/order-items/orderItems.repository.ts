import { pool } from "../../config/db";
import { mapOrderWithItems } from "../orders/order.mapper";
import { OrderItem } from "../orders/order.types";
import { Order } from "../orders/order.types";


export async function getItemsByOrderIdRepo(orderId: number): Promise<OrderItem[]>{

    const result = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [orderId]
    );
    return result.rows;
    
}

export async function addItemRepo(item: OrderItem): Promise<OrderItem> {
    const result = await pool.query(
        `INSERT INTO order_items
        (order_id, name, price, quantity, printed, printed_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            item.orderId,
            item.name,
            item.price,
            item.quantity,
            item.printed,
            item.printedAt
        ]
    );


    return result.rows[0];
}


export async function markItemsPrintedRepo(orderId: number): Promise<any[]> {
    await pool.query(
        `UPDATE order_items SET printed = true,
        printed_at = NOW()
        WHERE printed = false 
        AND order_id = $1`,
        [orderId]

    );
    
    const upOrders = await pool.query(`UPDATE orders SET status = $1 WHERE status = 'OPEN' AND id = $2 RETURNING *`,["PRINTED", orderId]);

    const result = await pool.query(
        `
        SELECT 
        o.id AS order_id,
        o.status,
        o.table_number,
        o.guests_count,
        o.table_id,
        o.created_at,
        o.prechecked_at,
        o.closed_at,


        oi.id AS item_id,
        oi.order_id AS order_item_order_id,
        oi.name AS item_name,
        oi.quantity,
        oi.printed_at,
        oi.printed,
        oi.price

        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id 
        WHERE o.id = $1
        AND o.status IN ('OPEN', 'PRINTED') 
        `, [orderId]
    );

    console.log('upOrderRepo', upOrders.rows);
    console.log('resRepo', result.rows);

    return result.rows;
    

}

export async function addItemQuantityRepo(item: OrderItem) {
    await pool.query(
        `UPDATE order_items SET quantity += 1 WHERE name = $1 `, [item.name]
    )
    
}







// export class OrderItemsRepository {
//     async addItem(orderId: number, name: string, price: number, quantity: number) {
//         const result = await pool.query(
//             `INSERT INTO order_items (orderId, name, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *`,
//             [orderId, name, price, quantity]
//         )
//         return result.rows[0]; 
//     }

//     async finfByOrderId(orderId: number) {
//         const result = await pool.query(
//             `SELECT * FROM order_items WHERE order_id = $1`, [orderId]
//         );
//         return result.rows[0];
//     }
// }