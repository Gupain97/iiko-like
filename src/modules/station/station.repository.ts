import { pool } from "../../config/db";
import { TicketRaw, StationsRaw, StationItemsStatus } from "./station.types";

export class StationRepository {
    async getStations() : Promise<StationsRaw[]> {
        const res = await pool.query(`SELECT id, name, sound_enable, visiable_statuses FROM station`);
        return res.rows;
    };

    async getStation(pin: number): Promise<StationsRaw> {
        const res = await pool.query(`SELECT * FROM station WHERE pin = $1`, [pin]);
        return res.rows[0];
        
    }


    async addOrder(orderId: number) : Promise<number> { // Возвращает ид тикета
        const res = await pool.query(`
            INSERT INTO station_tickets (order_id) VALUES ($1)RETURNING id`,[orderId] );
        return res.rows[0].id;
    };

    async addItem(ticketId: number, orderItemId: number) {
        await pool.query(`
            INSERT INTO station_ticket_items (ticket_id, order_item_id) VALUES ($1, $2 )`, [ticketId, orderItemId]);
    };


    async getTickets(stationId: number) : Promise<TicketRaw[]> {
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
            
            u.surname,

            s.visiable_statuses


            

            FROM station_tickets st
            LEFT JOIN station s
                ON s.id = $2
            LEFT JOIN station_ticket_items ti 
                ON ti.ticket_id = st.id
                AND ti.status::TEXT = ANY(s.visiable_statuses)
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
            
            `, ['NEW',  stationId]);

            return res.rows



    };

    async updateDishStatus(dishId: number, status: string) : Promise<Date> {
        const res = await pool.query(`UPDATE station_ticket_items SET status = $1 WHERE id = $2 RETURNING ready_at`, [status, dishId]);
        return res.rows[0].ready_at;
    };

    async doneDish(dishId: number) {
        await pool.query(`UPDATE station_ticket_items SET ready_at = NOW() WHERE id = $1`, [dishId]);
    }

    async getStatusFilter(stationId: number): Promise<StationItemsStatus[]> {
        const res = await pool.query(`SELECT visiable_statuses FROM station WHERE id = $1`, [stationId]);
        return res.rows[0].visiable_statuses;
    }


    async changeStatusFilter(stationId: number, status: string[]) : Promise<StationItemsStatus[]> {
        const res = await pool.query(`UPDATE station SET visiable_statuses = $2 WHERE id = $1 RETURNING visiable_statuses`, [stationId, status]);
        return res.rows[0].visiable_statuses;
    }
}