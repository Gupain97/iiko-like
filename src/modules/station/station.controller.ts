import { Request, Response  } from "express";
import { stationService, StationService } from "./station.services";
import { getStationForSessionId } from "../auth/auth.service";
import { AuthRequest } from "../auth/auth.types/auth-request";

const service = new StationService();


export const getTicketsController = async (req: AuthRequest, res: Response) => {
   if (!req.station) return res.status(400).json({message: 'station not found'});
   const stationId = req.station.id;
    const result = await service.getTickets(stationId);
    res.json(result);
    
}

export const updateDishStatusController = async (req: Request, res: Response) => {
   console.log('status controller:', req.body);
   const {status, dishId} = req.body;
   await service.updateStatus(dishId, status);
   res.json('ok');
};

export const changeStatusFilterController = async (req: AuthRequest , res: Response) => {
   const {enabled, status } = req.body;
   if (!req.station) return res.status(400).json({message:'station not found'});
   const stationId = req.station.id;
   
   const result = await stationService.changeStatusFilter(stationId, enabled, status);
   res.json(result);
   
}


export const getStatusFilterController = async (req: AuthRequest, res: Response)  => {
   if (!req.station) return res.status(400).json({message: "station not found"});
   const result = await stationService.getStatusFilter(req.station.id)
   res.json(result);
}