import { Request } from "express";
import { Role } from "../modules/users/users.types";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: Role;
    };
}