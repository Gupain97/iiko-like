import { getPrintedCashForWaiter } from "../order-items/orderItems.service";
import { openShiftRepo, closeShiftUserRepo, getActiveUsersRepo, getUserStatusRepo} from "./shifts.repository";
import { ActiveUsersDTO } from "./shifts.types";
import { mapUserDTO } from "./shifts.mapper";
import { UserShiftStatus } from "../../domain/userStatus";


export async function openShift(userId: number): Promise<UserShiftStatus> {
    const userStatus = await getUserStatusRepo(userId);
    if ( !userStatus || userStatus != "OPEN" ) await openShiftRepo(userId);
    return "OPEN";
}

export async function getActiveUsers(): Promise<ActiveUsersDTO[]> {
    const res = await getActiveUsersRepo();
    return mapUserDTO(res);
}

export async function closeShiftUser(userId: number): Promise<number> {
    const cashstring = await getPrintedCashForWaiter(userId);
    const cash = Number(cashstring) / 100 ;// исправить
    if (cash > 0 ) return cash
    await closeShiftUserRepo(userId);
    return 0;
}