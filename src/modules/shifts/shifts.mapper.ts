import { ActiveUsersDTO, ActiveUsersRow } from "./shifts.types";



export function mapUserDTO(rows: ActiveUsersRow[]): ActiveUsersDTO[]{
    return rows.map(row => ({
        userId: row.user_id,
        name: row.name,
        surname: row.surname,
        startedAt: row.started_at,
        shiftUserId: row.shift_user_id,
        status: row.status,
        
    }) satisfies ActiveUsersDTO)
}