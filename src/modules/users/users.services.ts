import { getActiveUsersRepo } from "./users.repository";

export async function getActiveUsers() {
    const res = await getActiveUsersRepo();

}