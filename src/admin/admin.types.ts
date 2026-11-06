export interface AdminUser {
    id: number,
    name: string,
    role: string
};


export interface Ingredient {
    id: number,
    name: string,
    quantity: number,
    unit: string,
    createdAt: Date
};


export interface NewIngredient { // Хотя не то чтобы нью , просто то , что мы получаем с фронта
    ingredientId : number,
    quantity: number,
    unit: string
};


export interface Revenue {
    id: number,
    name: string,
    surname: string,
    revenue: number
};

export interface SalesReult {
    employes: Revenue[],
    totalRevenue: number
};

export interface IngredientUsageRaw {
    id: number, 
    name: string,
    unit: string,
    quantity: number,
    ingredient_id: number
};

export interface IngredientUsageDTO {
    id: number, 
    name: string,
    unit: string,
    quantity: number,
    ingredientId: number
    
}
