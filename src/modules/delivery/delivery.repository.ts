import { pool } from "../../config/db";
import { DeliveryOrder, DeliveryStatus } from "./delivery.types";


export async function createCustomerDataRepo(data: any) {
    const res = await pool.query(`
        INSERT INTO customer_data 
        (order_id, customer_name, phone_number, address, e_mail) 
        VALUES 
        ($1, $2, $3, $4, $5)
        RETURNING *`, [data.orderId, data.customerName, data.phoneNumber, data.address, data.eMail]);

    return res 

}

export async function createDeliveryOrderRepo(devOrder: DeliveryOrder) {
    const res = await pool.query(`
        INSERT INTO orders
        (status, created_at, prechecked_at, closed_at, created_by, guests_count, source, comments)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *, id
        `, [devOrder.status, 
            devOrder.createdAt, 
            devOrder.precheckAt,
            devOrder.closedAt, 
            devOrder.createdBy, 
            devOrder.guestsCount, 
            devOrder.source, 
            devOrder.comments])

    return res.rows
}


export async function getDeliveryOrdersRepo() {
    const result = await pool.query(`
        SELECT
        o.id,
        o.created_at,
        o.guests_count,
        o.comments,

        oi.id AS item_id, 
        oi.order_id AS item_order_id, 
        oi.name,
        oi.price,
        oi.quantity,
        oi.printed,
        oi.printed_at,
        
        oc.customer_name,
        oc.phone_number,
        oc.address,
        oc.e_mail,

        d.status AS delivery_status

        FROM orders o

        LEFT JOIN order_items oi ON oi.order_id = o.id
        LEFT JOIN customer_data oc ON oc.order_id = o.id
        LEFT JOIN deliveries d ON d.order_id = o.id

        WHERE o.status = $1
        AND source = $2
        `, ['PRECHECK', "CALL-CENTER"]);


    return result.rows;
};


export async function createDeliveryRepo(orderId: number) {
    console.log("Ну как бы начали делать заказ", orderId);
    const res = await pool.query(`INSERT INTO deliveries (order_id, courier_id, updated_at) VALUES ($1, $2, NOW()) RETURNING *`, [orderId, 1]);
    return res.rows
};

export async function getDeliveryFromOrderIdRepo(orderId: number) {
    const res = await pool.query(`SELECT * FROM deliveries WHERE order_id = $1`, [orderId]);
    return res.rows
};

export async function getDeliveryFromDeliveryIdRepo(deliveryId: number) {
    const res = await pool.query(`SELECT * FROM deliveries WHERE id = $1`, [deliveryId]);
    console.log("repo res delivery:", res.rows[0]);
    return res.rows[0];
    
}


export async function updateStatusDeliverRepo(deliveryId: number, status: DeliveryStatus, userId: number) {
    await pool.query(`INSERT INTO deliveries_history (delivery_id, status, created_by) VALUES ($1, $2, $3)`, [deliveryId, status, userId]);
    await pool.query(`UPDATE deliveries SET status = $1, updated_at = NOW() WHERE id = $2`, [status, deliveryId]);
}