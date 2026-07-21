import { Request, Response } from "express";
import { closeShiftUser, getActiveUsers } from "./shifts.services";
import { AuthRequest } from "../auth/auth.types/auth-request";


// export const openShiftController = async (req: Request, res: Response) => {
    
// }

export const getActiveUsersController = async (req:Request, res: Response) => {
    const result = await getActiveUsers();
    res.json(result);
}


export const closeShiftUserController = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(400).json({message:'user not found'});
    const userId = req.user.id
    const result = await closeShiftUser(userId);
    if (result > 0) {
        res.json(result)
    } else { res.json("Смена закрыта!")};
    
}