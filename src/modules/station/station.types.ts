export type StationItemsStatus = ('NEW' | 'READY' | 'GIVEN');
export type StationTicketStatus = ('NEW'| 'READY');


export interface Station {
    id: number;
    name: string;
}

export interface StationsRaw {
    id: number;
    name: string;
    sound_enable: boolean;
    visiable_statuses : string[];
};

export interface StationDTO {
    id: number;
    name: string;
    soundEnable: boolean;
    visiableStatuses: string[];
};


export interface TicketRaw {
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