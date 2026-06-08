export interface MenuItem {
    id : number,
    name : string,
    isActive : boolean,
    price: number,
    categoryId: number

}

export interface MenuItemRow {
    id: number;
    name: string;
    is_active: boolean;
    price: number;
    category_id: number;
}

export type NewMenuItem =  Omit<MenuItem, 'id'> ;


export interface AllMenuDTO {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    isActive: boolean;
    remainder: number | null;
    isStopped: boolean;
    
}

export interface AllMenuRow {
    id: number;
    name: string;
    price: number;
    category_id: number;
    is_active: boolean;
    remainder: number | null;
    is_stopped: boolean;

    
}

export interface Categories {
    id: number;
    name: string;
}