

export type StopListDto = {
    id: number;
    name: string;
    categoryId: number;
};


export type getAllMenuDto = {
    id: number;
    name: string;
    price: number;
    category: number;
    idActive: boolean;
    remainder: number;
};


export interface MenuItemWithRecipeDTO {
    dishId: number;
    name: string;
    price: number;
    categoryId: number;
    categoryName: string;
    isActive: boolean;
    ingredients: IngredientsDTO[];
};

export interface IngredientsDTO {
    ingredientId: number,
    ingredientName: string;
    unit: string;
    quantity: number;
};