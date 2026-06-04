import { StopListDTO } from "./stop-list.dto"


export function mapStopListDTO(rows: any) : StopListDTO[] {
    const lst = [];
    for (const row of rows ) {
        lst.push({
            id: row.dish_id,
            name: row.name,
            createdAt: row.created_at,
            createdBy: row.created_by,
            remainder: row.remainder
            
        })
    }
    return lst;
    
}