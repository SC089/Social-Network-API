import { Request, Response } from 'express';
import { User } from '../models/User';
import { Thought } from '../models/Thought';

export const userController = {
    // Gets all users
    async getUsers(_: Request, res: Response): Promise<void> {
        try {
            const users = await User.find().populate('thoughts').populate('friends');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get one user from ID
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create new user
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Error creating user', error: err });
        }
    },
    // Update a user
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            if (!user) {
                res.status(404).json({ message: 'No user found with that ID' });
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: 'Error updating user', error: err });
        }
    },
    // Delete a user and their thoughts
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'No user found with that ID' });
                return;
            }
            // Remove associated thoughts
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting user', error: err });
        }
    },
    // Add a friend
    async addFriend(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $addToSet: { friends: req.params.friendId } }, // $addToSet avoids duplicates
                { new: true }
            ).populate('friends');
            if (!user) {
                res.status(404).json({ message: 'No user found with that ID' });
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: 'Error adding friend', error: err });
        }
    },
    // Remove a friend
    async removeFriend(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $pull: { friends: req.params.friendId } }, // $pull removes the friendId
                { new: true }
            ).populate('friends');
            if (!user) {
                res.status(404).json({ message: 'No user found with that ID' });
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: 'Error removing friend', error: err });
        }
    },
};