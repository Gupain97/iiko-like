import { OrderItem } from "../orders/order.types";
import { StopListDto } from "./menu.dto";
import { MenuItem , AllMenuRow, AllMenuDTO, MenuItemRow} from "./menu.types";



export function mapMenuItemDTO(row: any) : MenuItem | undefined  {
    return {
        id: row.id,
        name: row.name,
        price: row.price,
        categoryId: row.category_id,
        isActive: row.is_active
    }
}

export function mapMenuDTO(rows: AllMenuRow[]) : AllMenuDTO[] {
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price,
        categoryId: row.category_id,
        isActive: row.is_active,
        remainder: row.remainder,
        isStopped: row.is_stopped
    }) satisfies AllMenuDTO );
}

export function mapMenuItems(rows: MenuItemRow[]): MenuItem[] {
    return rows.map( row => ({
        id: row.id,
        name: row.name,
        price: row.price / 100,
        isActive: row.is_active,
        categoryId: row.category_id
    }) satisfies MenuItem );
}

// export function mapStopListItemsToService(row: any) : StopListDto[] {
//     const stopList = [];
    
//     for (const rows of row ) {
//         stopList.push({
//             id: rows.id,
//             name: rows.name,
//             categoryId: rows.category_id

//         })
//     }
//     return  stopList
// }
