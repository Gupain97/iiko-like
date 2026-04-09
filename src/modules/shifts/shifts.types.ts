import { UserShiftStatus } from "../../domain/userStatus";

export interface Shift {
    id: number,
    userId: number,
    status: UserShiftStatus, 
    startedAt: Date|null,
    endedAt: Date|null,
}