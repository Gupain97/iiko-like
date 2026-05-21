import { Request, Response, NextFunction } from 'express';
import { Role } from '../modules/users/users.types';
import { AuthRequest } from '../types/auth-request';

export type User = {
    id: number,
    role: Role,
};


export const requireRole = (role: Role[] ) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({message: "Пользователь не зарегистрирован"})
        };

        if (!role.includes(req.user.role) ) {
            console.log("role:", role, "req.user.role:", req.user.role)
            return res.status(401).json({message: 'Отказано в доступе'})
        };

        next();
    };
};

// export const requireRoleForDelete = (req: AuthRequest, res: Response, next: NextFunction) => {
    
    
// }