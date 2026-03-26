import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppErrors";


export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    if ( err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            details: err.details || null,
        });
    }

    res.status(500).json({message: 'Internal Server Error',});
};