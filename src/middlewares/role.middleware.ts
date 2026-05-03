import { Request, Response, NextFunction } from 'express';
import { Role } from '../modules/users/users.types';
import { AuthRequest } from '../types/auth-request';

export type User = {
    id: number,
    role: Role,
};


export const requireRole = (role: Role ) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({message: "Пользователь не зарегистрирован"})
        };
        console.log(req.user);

        if (req.user.role !== role ) {
            console.log('отработало отказ в доступе');
            return res.status(401).json({message: 'Отказано в доступе'})
        };

        next();
    };
};