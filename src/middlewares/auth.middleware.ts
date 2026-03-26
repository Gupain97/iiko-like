import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
        return res.status(401).json({message: 'Not authenticated'}); 

    }

    req.user = {
        id: Number(userId),
        role: userRole as 'manager' | 'cashier',
    };

    next();
};