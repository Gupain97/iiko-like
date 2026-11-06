
export interface Dishes {
    
};


export interface OrderItemRaw {
    id: number,
    order_id: number,
    name: string,
    quantity: number,
    price: number,
    printed: boolean,
    printed_at: Date,
    menu_item_id: number,
    comments: string
}

export interface OrderItem {
    id: number, 
    orderId: number,
    price: number, 
    name: string,
    quantity: number,
    menuItemId: number,
    printed : boolean,
    printedAt : Date | null,
    comments: string | null
}


export interface OrderItemSale {
    id: number,
    saleId: number,
    menuItemId: number,
    name: string,
    quantity: number,
    price: number,
    lineTotal: number
}
