import { pool } from "../../config/db";
import { StationRow } from "./station.types";

export class StationRepository {


    async getStations() {
        const res = await pool.query(`SELECT * FROM station`);
        return res.rows;
    }
    
    async getData() { 
        return "getingData Fropm repository";
        
    };


    async addOrder(orderId: number) {
        const res = await pool.query(`
            INSERT INTO station_tickets (order_id) VALUES ($1)RETURNING id`,[orderId] );
        return res.rows[0].id;
    };

    async addItem(ticketId: number, orderItemId: number) {
        // console.log('ticketId:', ticketId, orderItemId);
        const res = await pool.query(`
            INSERT INTO station_ticket_items (ticket_id, order_item_id) VALUES ($1, $2 )`, [ticketId, orderItemId]);
    };

    async getItem() {
        const res = await pool.query(`
            SELECT
            ti.ticket_id,
            ti.status,
            ti.created_at,
            ti.ready_at,

            oi.name,
            oi.quantity,

            mi.category_id

            FROM station_ticket_items ti
            LEFT JOIN order_items oi ON oi.id = ti.order_item_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE status = $1

            `, ['NEW']);

        // console.log('statRepo', res.rows);

        return res.rows;
    }


    async getTickets() : Promise<StationRow[]> {
        const res = await pool.query(`
            SELECT
            t.id,
            t.status AS ticket_status,
            
            ti.id AS item_id,

            ti.status AS item_status,
            ti.created_at,
            
            oi.name,
            oi.quantity,

            mi.category_id,

            o.table_number,
            
            u.surname

            

            FROM station_tickets t
            LEFT JOIN station_ticket_items ti ON ti.ticket_id = t.id
            LEFT JOIN order_items oi ON oi.id = ti.order_item_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id 
            LEFT JOIN orders o ON oi.order_id = o.id
            LEFT JOIN users u ON u.id = o.created_by
            WHERE t.status = $1
            
            `, ['NEW']);

            return res.rows
    }
}