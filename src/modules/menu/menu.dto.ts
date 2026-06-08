

export type StopListDto = {
    id: number;
    name: string;
    categoryId: number;
}


export type getAllMenuDto = {
    id: number;
    name: string;
    price: number;
    category: number;
    idActive: boolean;
    remainder: number;
}