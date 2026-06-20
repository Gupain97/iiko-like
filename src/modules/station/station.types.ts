export type StationItemsStatus = ('NEW' | 'READY' | 'GIVEN');
export type StationTicketStatus = ('NEW'| 'READY');


export interface Station {
    id: number;
    name: string;
    pin : number;
}


export interface StationRow {
    id: number;
    ticket_status: StationTicketStatus;
    item_id: number;
    item_status: StationItemsStatus;
    created_at: Date;
    name: string;
    quantity: number;
    category_id: number;
    table_number: number;
    surname: string;
}


export interface StationItemsDTO {
    id: number;
    status: StationItemsStatus;
    createdAt: Date;
    name: string;
    quantity: number;
    categoryId: number;
}

export interface StationTicketDTO {
    id: number;
    tableNumber: number;
    surname: string;
    status: StationTicketStatus;
    createdAt: Date; 
    items: StationItemsDTO[];
}