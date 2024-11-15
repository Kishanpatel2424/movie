
import { Response } from 'express';

export function sendResponse<T>(res: Response, statusCode: number, data: any[]): void {
    res.status(statusCode).json(data);
}

export function sendError(res: Response, statusCode: number, message: string): void {
    res.status(statusCode).json({
        success: false,
        error: message,
    });
}
