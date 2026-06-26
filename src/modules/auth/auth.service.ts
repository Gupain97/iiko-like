import { pool } from "../../config/db";
import { openShift } from "../shifts/shifts.services";
import { Role, User, UserRaw } from "../users/users.types";
import { stationService } from "../station/station.services";
import { v4 as uuidv4} from 'uuid';
import { deleteSessionRepo, getSessionRepo, getStationRepo, getUserForSessionIdRepo, openSessionRepository } from "./auth.repository";
import { getUserForPinRepo, getUsersRepo } from "../users/users.repository";
import { SessionType } from "./auth.types/session.type";
import { mapSessionRaw } from "./auth.mapper";
import { Station } from "../station/station.types";
import { LoginResponse } from "./auth.types/auth.type";
import { mapStationDTO } from "../station/station.mapper";





export const loginByPin = async (pin : string): Promise<{auth: LoginResponse, workSpace: string, sessionId: string}> => {
    const user = await getUserForPinRepo(Number(pin)); // потом сделаем строку
    const station = await stationService.getStation(Number(pin));
    let data = null;
    let stationId = null;
    let entityType = "USER"; // ВРЕМЕННО ЗНАЧЕНИЕ ПО УМОЛЧАНИЮ
    let workSpace = '';
    
    // Временно "база данных"

    //const user = userFromDb.find(u => u.pin.toString().trim() === pin.trim());// исправить
    ///const station = stations.find(u => u.pin.toString().trim() === pin.trim());

    
    if (user) {
        data = user;
        entityType = "USER";
        workSpace = "POS";
        await openShift(data.id);
        
    } else if (station) {
        data = mapStationDTO(station);
        stationId = station.id;
        workSpace = "KDS";
        entityType = "STATION";
    } else if (!station && !user ) {
    throw new Error('INVALID_PIN'); 
    }

    if (!data ) throw new Error('not data');
    const sessionId = uuidv4();
     await openSessionRepository(sessionId, entityType, data.id);

    // const { pin: _, ...safeUser } = data;
    const auth = data;
  
    return { auth , workSpace, sessionId}
};


export async function getSession(sessionId: string): Promise<SessionType> {
    const res = await getSessionRepo(sessionId);
    return mapSessionRaw(res);
}

export async function getUserForSessionId(sessionId: string): Promise<UserRaw> {
    const res = await getUserForSessionIdRepo(sessionId);
    return res;
    
}

export async function getStationForSessionId(sessionId: string): Promise<Station> {
    const res = await getStationRepo(sessionId);
    return res;
}


export async function deleteSession(sessionId: string) {
    const res = await deleteSessionRepo(sessionId);
    return res ;
}