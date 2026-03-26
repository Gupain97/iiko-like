import { Table } from "./tables.types";
import { tables } from "./tables.storage"; 
import { pool } from "../config/db";
import { TableRow } from "./tables.db.types";
import { mapTableToService } from "./tables.mapper";


export async function getTablesRepo(): Promise<Table[] | undefined> {
    const result = await pool.query(
        `SELECT * FROM tables`
    );
    return result.rows.map(row => ({
        id: row.id,
        guestsCount: row.guests_count,
        openedAt: row.opened_at,
        isOpen: row.is_open,
        cashierId: 2
        // Потом решить вопрос с кашир ид
    }))
}


export async function findTableByTableIdRepo( tableId: number ): Promise<Table | undefined> {
    const result = await pool.query<TableRow>(
        `SELECT * FROM tables WHERE id = $1`,
        [tableId]
    );
 
    if (result) {
        const mapResult = mapTableToService(result.rows[0]);
        return mapResult;
    }
    return ;
// сделать чище работу репозитоиря 
  //  return tables.find(t => t.id === tableId && t.isOpen);
}

export async function saveTableRepo(table: Table) {
    console.log('saveTableRepo')
    await pool.query(
        `INSERT INTO tables (id, is_open, guests_count, opened_at, user_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
            table.id,
            table.isOpen,
            table.guestsCount,
            table.openedAt,
            table.cashierId
        ]
    )
}

export async function updateTableRepo(tableId: number, table:Table) : Promise<Table | undefined> {
    console.log('updateTableRepo');
    const result = await pool.query(
        `UPDATE tables SET is_open = $1, guests_count = $2, opened_at = $3, user_id = $4 WHERE id = $5 RETURNING *`,
        [table.isOpen, table.guestsCount, table.openedAt, table.cashierId, tableId]
    );
    
    if (!result) return
    
    return mapTableToService(result)
    
}

export async function closeTableRepo(tableId: number) {
    await pool.query(
        `UPDATE tables SET is_open = false WHERE id = $1 RETURNING * `, [tableId]
    )
    // await pool.query(
    //     `DELETE FROM tables WHERE id = $1 RETURNING *`, [tableId]

    // )
}