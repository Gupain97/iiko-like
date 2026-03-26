import { pool } from "../config/db";

import { Order, OrderItem, NewOrder, OrderView} from "./order.types";
import { orders } from "./order.storage"; 
import { getActiveOrders } from "./order.services";
import { getItemsByOrderIdRepo } from "../order-items/orderItems.repository";
import { mapOrderWithItems, mapOrderWithItemsAndName, mapRowOrder } from "./order.mapper";


export let orderIdSeq = 1;
export let orderItemsIdSeq = 1;

export function getNextOrderIdSeq(): number {
    return orderIdSeq++;
}

export function getNextOrderItemsIdSeq(): number {
    return orderItemsIdSeq++;
}

export async function findOrderByOrderIdRepo(orderId: number) : Promise<Order | undefined> {



    const result = await pool.query(
        `
        SELECT
            o.id AS order_id,
            o.status,
            o.table_id,
            o.created_at,
            o.prechecked_at,
            o.closed_at,
            o.table_number,
            o.guests_count,
            o.created_by,
            
            oi.id AS item_id,
            oi.order_id AS order_item_order_id,
            oi.name AS item_name,
            oi.quantity,
            oi.price,
            oi.printed,
            oi.printed_at,

            ou.name AS waiter_name,
            ou.surname AS waiter_surname
            
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN users ou ON ou.id = o.created_by
            WHERE o.id = $1
            AND o.status IN ('OPEN', 'PRECHECK')`,
            [orderId]
    );
 

    return mapOrderWithItemsAndName(result.rows);

}

export async function getAllOrdersRepo() : Promise<Order[]> {
    const result = await pool.query(
        `SELECT * FROM orders`
    )
    // return result.rows.map(row => ({
    //     id: row.id,
    //     tableNumber: row.table_number,
    //     guestsCount: row.guests_count,
    //     tableId: row.table_id,
    //     status: row.status,
    //     createdAt: row.created_at,
    //     precheckAt: row.prechecked_at,
    //     closedAt: row.closed_at,
    //     items: []
    // }));
    return result.rows.map(mapRowOrder);
}
export async function findOrderByTableRepo(tableid: number ) : Promise<OrderView | undefined> {

    const result = await pool.query(
        `SELECT
            o.id AS order_id,
            o.status,
            o.table_number,
            o.guests_count,
            o.table_id,
            o.created_at,
            o.prechecked_at,
            o.closed_at,
            o.created_by,

            oi.id AS item_id,
            oi.name AS item_name,
            oi.order_id AS order_item_order_id,
            oi.quantity,
            oi.price,
            oi.printed,
            oi.printed_at,

            ou.name AS user_name,
            ou.surname
            
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN users ou ON ou.id = o.created_by

            WHERE o.table_id = $1
            AND o.status IN ('OPEN', 'PRECHECK')
            `, [tableid]

    );
    console.log(result.rows);

    return mapOrderWithItemsAndName(result.rows);
}



export async function saveOrderRepo(order: NewOrder) {
    const result = await pool.query(
        `INSERT INTO orders
        (table_id, status, created_at, prechecked_at, closed_at, created_by, guests_count, table_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            order.tableId,
            order.status,
            order.createdAt,
            order.precheckAt,
            order.closedAt,
            order.userId,
            order.guestsCount,
            order.tableNumber
        ]
    );
    return result.rows[0];
}

export async function updateStatusOrderRepo(orderId: number, status: ('PRECHECK' | 'OPEN' | 'CLOSED')) {
    const result = await pool.query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,[status, orderId]
    );
    return result.rows[0];
}

export async function precheckOrderRepo(orderId: number) {
    const result = await pool.query(
        `UPDATE orders SET status = $1, prechecked_at = NOW() WHERE id = $2 RETURNING *`, ["PRECHECK", orderId]
    );
 
    if (!result.rows[0]) return;
    
    
    
    return findOrderByOrderIdRepo(orderId);

}

export async function closeOrderRepo(orderId: number, userId: number, tableId: number) {
    const row = await pool.query(
        `UPDATE orders SET 
        closed_at = NOW(),
        table_id = null, 
        status = $1, 
        closed_by = $3 
        WHERE id = $2 RETURNING *`, ["CLOSED", orderId, userId]
    );
    await pool.query(`UPDATE tables SET is_open = false, guests_count = null, user_id = null, opened_at = null WHERE id = $1`,[tableId]);

}