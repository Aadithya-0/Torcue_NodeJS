import * as authService from '../services/authService.js';

export function verifyAuth(req: any, res: any, next: any) {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = authService.verifyToken(token);
        req.userId = (decoded as any).userId;
        req.username = (decoded as any).username;
        next();
    } catch (error) {
        res.status(401).json({ message: String(error) });
    }
}