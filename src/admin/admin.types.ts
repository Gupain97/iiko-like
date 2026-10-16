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

}