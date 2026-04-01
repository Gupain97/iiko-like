export interface MenuItem {
    id : number,
    name : string,
    isActive : boolean,
    price: number,
    categoryId: number

}

export type NewMenuItem =  Omit<MenuItem, 'id'> ;