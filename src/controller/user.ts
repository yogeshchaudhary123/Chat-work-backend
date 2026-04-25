import { Request, Response } from 'express';
import User from '../models/User';

const getUser = async (req: Request, res: Response) => {
    try {
        const data = await User.find({}, '-password'); // Exclude password
        const users = data.map(user => {
            const { _id, ...rest } = user.toObject();
            return { id: _id, ...rest };
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

export default { getUser }
