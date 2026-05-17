import { getPrintedCashForWaiter } from "../order-items/orderItems.service";
import { openShiftRepo, closeShiftUserRepo, getActiveUsersRepo, getUserStatusRepo} from "./shifts.repository";


export async function openShift(userId: number) {
    const userStatus = await getUserStatusRepo(userId);
    if ( !userStatus || userStatus != "OPEN" ) await openShiftRepo(userId);
}

export async function getActiveUsers() {
    const res = await getActiveUsersRepo();
    return res;
}

export async function closeShiftUser(userId: number) {
    const cashstring = await getPrintedCashForWaiter(userId);
    const cash = Number(cashstring) / 100 ;// исправить
    if (cash > 0 ) return cash
    await closeShiftUserRepo(userId);
    return 0;
}