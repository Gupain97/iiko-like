import { pool } from "../../config/db";
import { openShift } from "../shifts/shifts.services";
import { Role, UserRaw } from "../users/users.types";
import { stationService } from "../station/station.services";
import { v4 as uuidv4} from 'uuid';
import { deleteSessionRepo, getUserForSessionIdRepo, openSessionRepository } from "./auth.repository";

type UserRole = Role; 

type WorkSpace = ("POS" | "KDS");


interface User {
    id: number ;
    pin: string;
    role: UserRole;
    name: string;
    surname: string;
}

export async function getUsers(): Promise<User[]> {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows
}






export const loginByPin = async (pin : string): Promise<{user: Omit< User, 'pin'>, workSpace: string, sessionId: string}> => {
    const userFromDb = await getUsers();
    const stations = await stationService.getStations();
    let data = null;
    let stationId = null;
    let entityType = "USER"; // ВРЕМЕННО ЗНАЧЕНИЕ ПО УМОЛЧАНИЮ
    let workSpace = '';
    
    // Временно "база данных"

    const user = userFromDb.find(u => u.pin.toString().trim() === pin.trim());// исправить
    const station = stations.find(u => u.pin.toString().trim() === pin.trim());

    
    if (user) {
        data = user;
        entityType = "USER";
        workSpace = "POS";
        await openShift(data.id);
        
    } else if (station) {
        data = station;
        stationId = station.id;
        workSpace = "KDS";
        entityType = "STATION";
    } else if (!station && !user ) {
    throw new Error('INVALID_PIN'); 
    }
    const sessionId = uuidv4();

    const session = await openSessionRepository(sessionId, entityType, data.id);
    console.log("session:", session);
    
  // pin наружу не отдаём
    const { pin: _, ...safeUser } = data;
    // let workSpace = '';
    // console.log(safeUser);
    // if (data.role) {
    //     workSpace = "POS";
    // } else {
    //     workSpace = "KDS";
    // }
  
    return { user: safeUser, workSpace, sessionId}
};

export async function getUserForSessionId(sessionId: string): Promise<UserRaw> {
    const res = await getUserForSessionIdRepo(sessionId);
    return res;
    
}


export async function deleteSession(sessionId: string) {
    const res = await deleteSessionRepo(sessionId);
    return res ;
}