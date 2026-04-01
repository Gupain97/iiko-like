import { OrderItem } from "../orders/order.types";
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
