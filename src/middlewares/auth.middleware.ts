import { Request, Response, NextFunction } from "express";
import { Role } from "../modules/users/users.types";
import { AuthRequest } from "../types/auth-request";

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    console.log('мидлвар где-то работает',);

    if (!userId || !userRole) {
        return res.status(401).json({message: 'Not authenticated'}); 

    }

    req.user = {
        id: Number(userId),
        role: userRole as Role,
    };

    next();
};