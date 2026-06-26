import { pool } from "../../config/db";
import { TicketRaw, StationsRaw } from "./station.types";

export class StationRepository {
    async getStations() : Promise<StationsRaw[]> {
        const res = await pool.query(`SELECT id, name, sound_enable, visiable_statuses FROM station`);
        console.log(res.rows);
        return res.rows;
    };

    async getStation(pin: number): Promise<StationsRaw> {
        const res = await pool.query(`SELECT * FROM station WHERE pin = $1`, [pin]);
        return res.rows[0];
        
    }


    async addOrder(orderId: number) { // Возвращает ид тикета
        const res = await pool.query(`
            INSERT INTO station_tickets (order_id) VALUES ($1)RETURNING id`,[orderId] );
        return res.rows[0].id;
    };

    async addItem(ticketId: number, orderItemId: number) {
        await pool.query(`
            INSERT INTO station_ticket_items (ticket_id, order_item_id) VALUES ($1, $2 )`, [ticketId, orderItemId]);
    };


    async getTickets(stationId: number) : Promise<TicketRaw[]> { // поменяем на тикет
        const res = await pool.query(`
            SELECT
            st.id,
            st.status AS ticket_status,
            
            ti.id AS item_id,

            ti.status AS item_status,
            ti.created_at,
            
            oi.name,
            oi.quantity,

            mi.category_id,

            o.table_number,
            
            u.surname

            

            FROM station_tickets st
            LEFT JOIN station_ticket_items ti 
                ON ti.ticket_id = st.id
            LEFT JOIN order_items oi 
                ON oi.id = ti.order_item_id
            LEFT JOIN menu_items mi 
                ON oi.menu_item_id = mi.id 
            LEFT JOIN orders o 
                ON oi.order_id = o.id
            LEFT JOIN users u 
                ON u.id = o.created_by

            JOIN station_categories sc
                ON sc.station_id = $2
                AND sc.category_id = mi.category_id
            WHERE st.status = $1
            
            `, ['NEW', stationId]);

            return res.rows
    }
}