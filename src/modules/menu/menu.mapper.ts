import { OrderItem } from "../orders/order.types";
import { StopListDto } from "./menu.dto";
import { MenuItem } from "./menu.types";



export function mapMenuItemToService(row: any) : MenuItem | undefined  {
    return {
        id: row.id,
        name: row.name,
        price: row.price,
        categoryId: row.category_id,
        isActive: row.is_active
    }
}

export function mapStopListItemsToService(row: any) : StopListDto[] {
    const stopList = [];
    
    for (const rows of row ) {
        stopList.push({
            id: rows.id,
            name: rows.name,
            categoryId: rows.category_id

        })
    }
    return  stopList
}
