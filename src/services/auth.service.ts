import { pool } from "../config/db";
import { openShift } from "../modules/shifts/shifts.services";
import { Role } from "../modules/users/users.types";

type UserRole = Role; 


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




export const loginByPin = async (pin : string): Promise<Omit<User, 'pin'>> => {
    const userFromDb = await getUsers();
    
    // Временно "база данных"

    const user = userFromDb.find(u => u.pin.toString().trim() === pin.trim());// исправить



    if (!user) {
        throw new Error('INVALID_PIN');
  }

  // pin наружу не отдаём
    const { pin: _, ...safeUser } = user;
    await openShift(user.id);
  
    return safeUser;
};
