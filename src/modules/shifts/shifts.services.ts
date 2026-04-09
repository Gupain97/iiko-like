import { openShiftRepo, closeShiftUserRepo, getActiveUsersRepo, getUserStatusRepo} from "./shifts.repository";


export async function openShift(userId: number) {
    const userStatus = await getUserStatusRepo(userId);
    if (userStatus != "OPEN" ) await openShiftRepo(userId);
}

export async function getActiveUsers() {
    const res = await getActiveUsersRepo();
    return res;
}

export async function closeShiftUser(userId: number) {
    await closeShiftUserRepo(userId);
}