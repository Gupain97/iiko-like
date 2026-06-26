import { Request, Response, NextFunction } from "express";
import { Role } from "../modules/users/users.types";
import { AuthRequest } from "../modules/auth/auth.types/auth-request";
import { getSession, getStationForSessionId, getUserForSessionId } from "../modules/auth/auth.service";

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const sessIonId = req.cookies.sessionId;
    const session = await getSession(sessIonId);
    if (session.entityType === "STATION") {
        const station = await getStationForSessionId(sessIonId);
        const stationId = station.id;
        const stationName = station.name;
        if (!stationId || !stationName) {
            return res.status(401).json({message: 'Not authenticated'}); 
        };
        req.station = {
            id: Number(stationId),
            name: stationName,

        }
    } else if ( session.entityType === "USER")   {


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
    }
    

    next();
};