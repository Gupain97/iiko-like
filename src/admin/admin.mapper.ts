import { IngredientUsageDTO, IngredientUsageRaw } from "./admin.types";

export function mapIngredientsUsageDTO(ingredients: IngredientUsageRaw[]): IngredientUsageDTO[] {
    const result : IngredientUsageDTO[] = [];
    ingredients.forEach((ingredient) => {
        const existing  = result.find(i => i.ingredientId === ingredient.ingredient_id)
        if (existing) {
            existing.quantity += ingredient.quantity
        } else {
            result.push({
                id: ingredient.id,
                name :ingredient.name,
                unit: ingredient.unit,
                quantity: ingredient.quantity,
                ingredientId: ingredient.ingredient_id,
            });
        }
    });

    return result;
    
}