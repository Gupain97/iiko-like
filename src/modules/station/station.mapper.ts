import { StationDTO, StationItemsDTO, TicketRaw, StationTicketDTO, StationsRaw } from "./station.types";


export function mapItemDTO(row: any): StationItemsDTO {

    return {
        id: row.item_id,
        status: row.status,
        createdAt: row.created_at,
        name: row.name,
        quantity: row.quantity,
        categoryId: row.category_id

    }

}

export function mapTicketDTO(rows: TicketRaw[]): StationTicketDTO[] {
    const items = [];
    const tickets = new Map<number, StationTicketDTO>();
    
    // const ticket = {
    //     id: row.id,
    //     tableNumber: row.table_number,
    //     status: row.status,
    //     ticketItems : []
    // };

    for (const row of rows) {
        let ticket = tickets.get(row.id);
        if (!ticket) {
            ticket = {
                id: row.id,
                tableNumber: row.table_number,
                surname: row.surname,
                status: row.ticket_status,
                createdAt: row.created_at,
                items: []

            };
        tickets.set(row.id, ticket);
            
        }

    ticket.items.push({
        id: row.item_id,
        status: row.item_status,
        createdAt: row.created_at,
        name: row.name,
        quantity: row.quantity,
        categoryId: row.category_id
    });
    
    }
    return Array.from(tickets.values());
};


export function mapStationDTO(row: StationsRaw): StationDTO {
    const res : StationDTO = {
        id: row.id,
        name: row.name,
        soundEnable: row.sound_enable,
        visiableStatuses: row.visiable_statuses
        
    };
    return res; 
}