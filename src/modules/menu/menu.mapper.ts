import { OrderItem } from "../orders/order.types";
import { IngredientsDTO, MenuItemWithRecipeDTO, StopListDto } from "./menu.dto";
import { MenuItem , AllMenuRow, AllMenuDTO, MenuItemRow, MenuItemWithRecipRaw} from "./menu.types";



export function mapMenuItemDTO(row: any) : MenuItem | undefined  {
    return {
        id: row.id,
        name: row.name,
        price: row.price / 100 ,
        categoryId: row.category_id,
        isActive: row.is_active
    }
}

export function mapMenuDTO(rows: AllMenuRow[]) : AllMenuDTO[] {
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price / 100,
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



export function mapMenuItemWithRecDTO(row:MenuItemWithRecipRaw): MenuItemWithRecipeDTO {
    return {
        dishId: row.dish_id,
        name: row.name,
        price: row.price,
        categoryName: row.category_name,
        categoryId: row.category_id,
        isActive: row.is_active,
        ingredients: (row.ingredients || []).map(rec => ({
            ingredientId: rec.ingredient_id,
            ingredientName: rec.ingredient_name,
            unit: rec.unit,
            quantity: rec.quantity,
        }) satisfies IngredientsDTO )

    } satisfies MenuItemWithRecipeDTO;
}