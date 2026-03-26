import { Request, Response, NextFunction } from 'express';

export const requireRole = (role: 'manager' | 'cashier' ) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({message: "Пользователь не зарегистрирован"})
        };

        if (req.user.role !== role ) {
            return res.status(401).json({message: 'Отказано в доступе'})
        };

        next();
    };
};