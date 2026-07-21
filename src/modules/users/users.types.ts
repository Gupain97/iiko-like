export interface NewUser {
    name: string,
    surname: string,
    pin: number,
    role: string,

}

type UserRole = Role; 


export interface User {
    id: number ;
    role: UserRole;
    name: string;
    surname: string;
}


export type Role = ("MANAGER" | "WAITER" | "DIRECTOR" | "STATION");


export interface UserRaw {
    id : number,
    name : string,
    surname: string,
    role: Role
    
}