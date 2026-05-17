import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: 'Admin' | 'Sales';
    };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, secret) as { id: string; role: 'Admin' | 'Sales' };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized, token validation failed' });
    }
};

export const authorizeRoles = (...allowedRoles: Array<'Admin' | 'Sales'>) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: 'Forbidden: You do not have the required permissions' });
            return;
        }
        next();
    };
};