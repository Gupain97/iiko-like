import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/AppErrors";


export const validateOpenTable = (req: Request, res: Response, next: NextFunction) => {
    const { userId , tableId } = req.body;
    if (!userId || !tableId) {
        return next(new ValidationError("userId and tableId is mandatory"))
    }

    next();
    
}