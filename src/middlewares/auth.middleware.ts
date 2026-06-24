import { Request, Response, NextFunction } from "express";
import { Role } from "../modules/users/users.types";
import { AuthRequest } from "../modules/auth/auth.types/auth-request";
import { getUserForSessionId } from "../modules/auth/auth.service";

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const sessIonId = req.cookies.sessionId;
    const user = await getUserForSessionId(sessIonId);
    const userId = user.id;
    const userRole = user.role;
    if (!userId || !userRole) {
        return res.status(401).json({message: 'Not authenticated'}); 

    }

    req.user = {
        id: Number(userId),
        role: userRole as Role,
    };

    next();
};