import { Request, Response, NextFunction } from 'express';

export const validateYear = (req: Request, res: Response, next: NextFunction): void => {
    const { year } = req.query;

    if (year) {
        const currentYear = new Date().getFullYear();

        if (!/^\d{4}$/.test(year as string) || Number(year) > currentYear) {
            res.status(400).json({
                error: `Invalid 'year' parameter. It must be a 4-digit number not exceeding ${currentYear}.`
            });
            return; // Ensure it stops further execution
        }
    }

    next();
};
