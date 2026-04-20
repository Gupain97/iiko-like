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

export async function addItemRepo(item: any ): Promise<OrderItem> {
    console.log(item);
    const result = await pool.query(
        `INSERT INTO order_items
        (order_id, name, price, quantity, printed, printed_at, menu_item_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            item.orderId,
            item.name,
            item.price,
            item.quantity,
            item.printed,
            item.printedAt,
            item.menuItemId
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

 

    return result.rows;
    

}

export async function getItemByItemIdRepo(itemId: number) {
    const result = await pool.query(
        `SELECT 
        oi.id AS order_item_id,
        oi.order_id,
        oi.printed,
        oi.order_id,
        oi.name,
        
        mi.id AS menu_item_id,
        mi.name AS menu_item_name

        FROM order_items oi
        LEFT JOIN menu_items mi ON oi.name = mi.name
        WHERE oi.id = $1`, [itemId]);

    return result.rows[0];
}

export async function addItemQuantityRepo(itemId: number) {
    await pool.query(
        `UPDATE order_items SET quantity = quantity + 1 WHERE id = $1 `, [itemId]
    )
    
}


export async function getAddedItemOrUndefinedRepo(menuItemId: number, orderId: number) {
    const result = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1 AND menu_item_id = $2 AND printed = $3`,[orderId, menuItemId, false]
    );
    return result.rows[0];
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