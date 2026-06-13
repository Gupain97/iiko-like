import { Request, Response  } from "express";
import { StationService } from "./station.services";

const service = new StationService();


export const getItemsController = async (req: Request, res: Response) => {
    const result = await service.getTickets();
    res.json(result);
    
}