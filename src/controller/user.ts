import { Request, Response } from 'express';
import User from '../models/User';

const getUser = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

export default { getUser }
