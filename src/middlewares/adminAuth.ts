import { Request, Response, NextFunction } from "express";
import { getAdminUser } from "../admin/admin.auth";
import { verifyAccessToken } from "../utils/jwt";


export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const  userId  = verifyAccessToken(token);
    console.log('мы в мидлваре');
    if (!userId) {
        throw new Error('Токен пользователя не найден или просрочен');
    }

    next();
    
    
}