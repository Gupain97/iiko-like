import { PoolClient } from "pg";
import { pool } from "../../config/db";
import { mapOrderWithItems } from "../orders/order.mapper";;
import { Order } from "../orders/order.types";
import { OrderItem, OrderItemRaw, OrderItemSale } from "./orderItems.types";


export async function getItemsByOrderIdRepo(orderId: number): Promise<OrderItemRaw[]>{

    const result = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [orderId]
    );
    return result.rows;
    
}

export async function addItemRepo(item: any ): Promise<OrderItem> {
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


export async function markItemsPrintedRepo(client: PoolClient, orderId: number): Promise<any[]> {
    const res = await client.query(
        `UPDATE order_items SET printed = true,
        printed_at = NOW()
        WHERE printed = false 
        AND order_id = $1
        RETURNING *`,
        [orderId]
        
    );
    
    await client.query(`UPDATE orders SET status = $1 WHERE status = 'OPEN' AND id = $2 RETURNING *`,["PRINTED", orderId]);
    
    return res.rows;
}

export async function getItemByItemIdRepo(itemId: number): Promise<OrderItemRaw> {
    const result = await pool.query(
        `SELECT 
        oi.id AS order_item_id,
        oi.order_id,
        oi.printed,
        oi.order_id,
        oi.name,
        oi.quantity,
        
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


export async function decrementItemQantityRepo(itemId: number) {
    await pool.query(`UPDATE order_items SET quantity = quantity - 1 WHERE id =$1`, [itemId]);
    
}

export async function deleteItemRepo(itemId: number) { 
    await pool.query(`DELETE FROM order_items WHERE id = $1`, [itemId]);
}

export async function getPrintedCashForWaiterRepo(userId: number) {
    const res = await pool.query(`
        SELECT SUM(oi.price * oi.quantity)
        
        
        FROM order_items oi
        LEFT JOIN orders o ON oi.order_id = o.id

        WHERE created_by = $1
        AND o.status in ('OPEN', 'PRECHECK', 'PRINTED')
         `, [userId]);

    return res.rows[0].sum;

};

export async function getMarkItemsRepo(orderId: number) {
    const res = await pool.query(`
        SELECT name
        FROM order_items oi
        JOIN stop_list sl on sl.dish_id = oi.menu_item_id
        
        WHERE oi.order_id = $1
        AND sl.remainder < 1 
        AND sl.removed_at IS NULL
        AND oi.printed = false
        `, [orderId]);

    return res.rows 
};


export async function addItemsToSaleRepo(client:PoolClient, items: OrderItemSale[]) {
    if (items.length === 0  ) return;
    const saleId = items[0].saleId; // Костыль

    const values : (string | number)[] = items.flatMap(
        (item) : (string | number)[] => [
            item.saleId,
            item.menuItemId,
            item.name,
            item.quantity,
            item.price,
            item.lineTotal
    ]
    );

    const placeholder = items.map((_, index) => {
        const offset = index * 6;

        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`
    });

    const sql = `
    INSERT INTO sale_items (sale_id, menu_item_id, dish_name, quantity, price, line_total)
    VALUES ${placeholder.join(', ')}
    RETURNING *
    `
    const res = await client.query(sql, values);

    await client.query(`
        INSERT INTO sale_item_ingredients (name, quantity, unit, sale_item_id, ingredient_id )
        SELECT
            i.name,
            di.quantity * si.quantity,
            i.unit,
            si.id,
            i.id AS ingredient_id

        FROM sale_items si
        JOIN dish_ingredients di ON si.menu_item_id = di.menu_item_id
        JOIN ingredients i ON i.id = di.ingredient_id
        WHERE si.sale_id = $1
        `, [saleId])
};