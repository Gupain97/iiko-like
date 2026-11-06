import { pool } from "../../config/db";

import { Order, NewOrder, Sales } from "./order.types";
import { orders } from "./order.storage"; 
//import { getActiveOrders } from "./order.services";
import { getItemsByOrderIdRepo } from "../order-items/orderItems.repository";
import { mapOrderWithItems,  mapRowOrder } from "./order.mapper";
import { OrderWithNameRow } from "./order.raw.types";
import { OrderSlotRow } from "./order.db.types";
import type { PoolClient } from "pg";


export async function findOrderByOrderIdRepo(orderId: number) : Promise<OrderWithNameRow[]> {



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
            ou.surname AS waiter_surname,
            ou.id AS waiter_id
            
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN users ou ON ou.id = o.created_by
            WHERE o.id = $1
            AND o.status IN ('OPEN', 'PRINTED', 'PRECHECK')
            ORDER BY printed DESC, created_at ASC`,
            [orderId]
    );
 

    return result.rows;

}
export async function getWaiterOrdersRepo(waiterId: number) : Promise<OrderSlotRow[]>  {
    const result = await pool.query(
        `SELECT id, table_id, table_number, status, guests_count  FROM orders WHERE status IN ($1, $2, $3) AND created_by = $4`, ["OPEN", "PRINTED", "PRECHECK" , waiterId]
    )
    return result.rows;
}


export async function getAllOrdersRepo()  {
    const result = await pool.query(
        `SELECT * FROM orders WHERE status = $1`, ["OPEN"]
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
    return result.rows;
}
export async function findOrderByTableRepo(tableId: number, userId: number ) : Promise<OrderWithNameRow[] > {

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

            ou.name AS waiter_name,
            ou.surname AS waiter_surname,
            ou.id AS user_id
            
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN users ou ON ou.id = o.created_by

            WHERE o.table_id = $1
            AND o.status IN ('OPEN', 'PRINTED', 'PRECHECK')
            AND o.created_by = $2
            ORDER BY printed DESC, created_at ASC
            `, [tableId, userId]

    );


    return result.rows;
}

export async function getHimOrderByTableRepo(tableId: number, userId: number ) : Promise<OrderWithNameRow[] >  {

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

            ou.name AS waiter_name,
            ou.surname AS waiter_surname
            
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id

            WHERE o.table_id = $1
            AND o.status IN ('OPEN', 'PRINTED', 'PRECHECK')
            AND o.created_by = $2
            ORDER BY printed DESC, created_at ASC
            `, [tableId, userId]

    );


    return result.rows;


    
}



export async function saveOrderRepo(order: NewOrder) {
    const result = await pool.query(
        `INSERT INTO orders
        (table_id, status, created_at, prechecked_at, closed_at, created_by, guests_count, table_number, source)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, *`,
        [
            order.tableId,
            order.status,
            order.createdAt,
            order.precheckAt,
            order.closedAt,
            order.userId,
            order.guestsCount,
            order.tableNumber,
            order.source
        ]
    );
    return result.rows;
}

export async function updateStatusOrderRepo(orderId: number, status: ('PRECHECK' | 'OPEN' | 'PRINTED'| 'CLOSED')) {
    const result = await pool.query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,[status, orderId]
    );
    return result.rows;
}

export async function precheckOrderRepo(orderId: number) {
    const result = await pool.query(
        `UPDATE orders SET status = $1, prechecked_at = NOW() WHERE id = $2 RETURNING *`, ["PRECHECK", orderId]
    );
 
    if (!result.rows[0]) return;
    
    
    
    return findOrderByOrderIdRepo(orderId);

}


export async function closeOrderRepo(client: PoolClient, orderId: number, userId: number, sales: Sales) {
    await client.query(
        `UPDATE orders SET 
        closed_at = NOW(),
        table_id = null, 
        status = $1, 
        closed_by = $3,
        shift_id = ( SELECT id FROM shifts WHERE user_id = $3 AND status = 'OPEN')

        WHERE id = $2 RETURNING *`, ["CLOSED", orderId, userId]
    );

    const res = await pool.query(`
        INSERT INTO sales (order_id, user_id, total_amount) VALUES ($1, $2, $3) RETURNING *
        `, [sales.orderId, sales.userId, sales.totalAmount]);

    return res.rows[0];

}

