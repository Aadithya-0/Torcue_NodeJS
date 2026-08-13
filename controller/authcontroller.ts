import * as authService from '../services/authService.js';

export async function register(req: any, res: any) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        await authService.registerUser(username, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: String(error) });
    }
}
export async function login(req: any, res: any) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        const result = await authService.loginUser(username, password);
        res.json({ token: result.token, userId: result.userId, username: result.username });
    } catch (error) {
        res.status(401).json({ message: String(error) });
    }
}