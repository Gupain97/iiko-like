export interface NewUser {
    name: string,
    surname: string,
    pin: number,
    role: string,

}

export type Role = ("MANAGER" | "WAITER" | "DIRECTOR" | "STATION");


export interface UserRaw {
    id : number,
    name : string,
    surname: string,
    role: Role
    
}