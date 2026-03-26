import { TableRow } from "./tables.db.types";
import { Table } from "./tables.types";


export function mapTableToService(row: any ): Table | undefined {
    // сделать чище работу мапера
    if (!row) return
    return {
        id: row.id,
        isOpen: row.is_open,
        cashierId: row.user_id,
        guestsCount: row.guests_count,
        openedAt: row.opened_at
    }
    

}