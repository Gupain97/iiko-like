import { InvalidCredentials } from "../errors/AppErrors";
import { generateAccessToken } from "../utils/jwt";
import { getAdminUserRepo } from "./admin.repository";
import { AdminUser } from "./admin.types";

export async function getAdminUser(login: string, password: string): Promise<AdminUser> {
    const res = await getAdminUserRepo(login, password);
    if (!res) throw new InvalidCredentials();
    return res 
}


export async function loginAdmin(login: string, password: string) {
    const user = await getAdminUser(login, password);
    const userId = String(user.id)
    const token = generateAccessToken(userId);
    return token;
}