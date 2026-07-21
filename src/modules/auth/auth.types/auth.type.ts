import { StationDTO } from "../../station/station.types";
import { User } from "../../users/users.types";

export type LoginResponse = ( User | StationDTO );


// // export type UserLoginResponse = Omit<User, 'pin'> 

// // export type StationLoginResponse = Omit<StationDTO, 'pin'>