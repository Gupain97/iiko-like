import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../errors/AppErrors";

export const validateOrderItem = (req: Request, res: Response, next: NextFunction) => {
    const {name, price, quantity} = req.body;

    const errors: string[] = [];

    if (!name || typeof name !== 'string') errors.push('Invalid or missing name');
    if (price === null || typeof price !== 'number' || price <= 0) errors.push('Invalid price');
    if (quantity === null || typeof quantity !== 'number' || quantity <= 0) errors.push('Invalid quantity');

    if (errors.length > 0) {
        return next(new ValidationError('Order item validation failed', errors));
    }

    next();
}