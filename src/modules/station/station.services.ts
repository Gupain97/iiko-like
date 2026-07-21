import { mapStationDTO, mapStationsDTO, mapTicketDTO } from "./station.mapper";
import { StationRepository } from "./station.repository";
import { StationDTO, StationItemsStatus, StationTicketDTO } from "./station.types";


export class StationService {
    private readonly stationRepo = new StationRepository;

    
    async addOrder(orderId: number) : Promise<number> {
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

    async getStations() : Promise<StationDTO[]> {
        const res = await this.stationRepo.getStations();
        return mapStationsDTO(res);
    };

    async getStation(pin:number): Promise<StationDTO| null>  {
        const res = await this.stationRepo.getStation(pin);
        console.log("res:", res);
        
        if (!res) return null;
        return mapStationDTO(res);
    };

    async updateStatus(dishId: number, status: string) {
        const ready  = await this.stationRepo.updateDishStatus(dishId, status);
        if (!ready){
            await this.stationRepo.doneDish(dishId);
        }
    };


    async getStatusFilter(stationId: number) : Promise<StationItemsStatus[]> {
        const res = await this.stationRepo.getStatusFilter(stationId);
        console.log('statusFilter in service:', res);
        return res;
    }


    async changeStatusFilter(stationId: number, enabled: boolean, status: StationItemsStatus) {
        const statuses = await this.stationRepo.getStatusFilter(stationId);
        if ( statuses.includes(status)) {
            console.log('status in statuses');
            if (enabled) {
                return 
            } else {
                const updateStatuses = statuses.filter((stat:string)  => stat !== status);
                const res = await this.stationRepo.changeStatusFilter(stationId, updateStatuses);
                return res;
    
            }
        } else {
            if (!enabled) {
                console.log('статуса не было и не добавили');
            } else {
                const updateStatuses = [...statuses];
                updateStatuses.push(status);
                const res = await this.stationRepo.changeStatusFilter(stationId, updateStatuses);
                console.log(res);
                return res;
            }
        }

        
    }
}


export const stationService = new StationService();