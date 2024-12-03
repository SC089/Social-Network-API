import { Request, Response } from 'express';
import { User } from '../models/User';
import { Thought } from '../models/Thought';

export const userController = {
    async getUsers(req: Request, res: Response) {
        try {
            const users = await User.find().populate('thoughts').populate('friends');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getUserById(req: Request, res: Response) {
        try {
            const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};