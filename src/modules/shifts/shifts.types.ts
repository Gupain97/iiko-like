import { UserShiftStatus } from "../../domain/userStatus";


// export type Status = {
    
// }

export interface Shift {
    id: number,
    userId: number,
    status: UserShiftStatus, 
    startedAt: Date|null,
    endedAt: Date|null,
}


export interface ActiveUsersRow {
    user_id: number;
    name: string;
    surname: string;
    started_at: Date;
    shift_user_id: number;
    status: string;
    
}

export interface ActiveUsersDTO {
    userId: number;
    name: string;
    surname: string;
    startedAt: Date;
    shiftUserId: number;
    status: string;
}