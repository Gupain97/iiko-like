import { mapTicketDTO } from "./station.mapper";
import { StationRepository } from "./station.repository";
import { StationTicketDTO } from "./station.types";


export class StationService {
    private readonly stationRepo = new StationRepository;

    async getData() {
        const data = new StationRepository();
        const res = data.getData();
    };
    
    async addOrder(orderId: number) {
        const res  = await this.stationRepo.addOrder(orderId);
        return res;
    };

    async addItem(items: any[], ticketId: number ) {  

        for (const i of items ) {
            await this.stationRepo.addItem(ticketId, i.id);
        }

    }


    async getItem() {
        const res = await this.stationRepo.getItem();
        // console.log(res);
        
    }
    
    
    async getTickets() : Promise<StationTicketDTO[]> {
        const res = await this.stationRepo.getTickets();
        return mapTicketDTO(res);;
    }
}


export const stationService = new StationService();