

export class AppError extends Error {
    public statusCode : number; 
    public details?: any;


    constructor(message: string, statusCode = 400, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details; 
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Ressource not found'){
        super(message, 404);
    }
}

export class ValidationError extends AppError{
    constructor(message = 'Validatin failed', details?: any ){
        super(message, 422, message);
    }
}

export class OrderStatusError extends AppError{
    constructor(message = 'Order status invalid for this action') {
        super(message, 400);
    }
}