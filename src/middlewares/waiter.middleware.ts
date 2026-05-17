import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth-request";


export const checkWaiter = (
        req: AuthRequest,
        res: Response, 
        next: NextFunction) => {
        const waiterId = Number(req.body.waiterId);
        if (!req.user) {
            return res.status(401).json({message: "Пользователь не зарегистрирован"});
        };
        if (req.user.id !== waiterId && req.user.role !== "MANAGER"  ) {
            return res.status(401).json({message: "Отказано в доступе"});
        };

        next();
        
        
    
}