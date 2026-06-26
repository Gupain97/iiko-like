import { Request, Response  } from "express";
import { StationService } from "./station.services";
import { getStationForSessionId } from "../auth/auth.service";

const service = new StationService();


export const getTicketsController = async (req: Request, res: Response) => { // исправим на тикет 
   // const stationId = Number(req.params.stationId);
//    const stationId =  req.cookies.stationId;
   const station = await getStationForSessionId(req.cookies.sessionId);
   const stationId = station.id;
   console.log(req.cookies);
    console.log("stationId controller", stationId)
    const result = await service.getTickets(stationId);
    res.json(result);
    
}