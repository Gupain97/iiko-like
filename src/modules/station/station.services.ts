import { mapTicketDTO } from "./station.mapper";
import { StationRepository } from "./station.repository";
import { StationTicketDTO } from "./station.types";


export class StationService {
    private readonly stationRepo = new StationRepository;

    
    async addOrder(orderId: number) {
        const res  = await this.stationRepo.addOrder(orderId);
        return res;
    };

    async addItem(items: any[], ticketId: number ) {  

        for (const i of items ) {
            await this.stationRepo.addItem(ticketId, i.id);
        };

    };
    
    
    async getTickets(stationId: number) : Promise<StationTicketDTO[]> {

        const res = await this.stationRepo.getTickets(stationId);
        return mapTicketDTO(res);;
    };

    async getStations() {
        const res = await this.stationRepo.getStations();
        return res;
    };

    async getStation(pin:number) {
        const res = await this.stationRepo.getStation(pin);
        return res;
    };
}


export const stationService = new StationService();