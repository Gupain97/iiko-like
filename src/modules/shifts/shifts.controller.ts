import { Request, Response } from "express";
import { closeShiftUser, getActiveUsers } from "./shifts.services";


export const openShiftController = async (req: Request, res: Response) => {
    
}

export const getActiveUsersController = async (req:Request, res: Response) => {
    const result = await getActiveUsers();
    res.json(result);
}


export const closeShiftUserController = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    await closeShiftUser(userId);
}