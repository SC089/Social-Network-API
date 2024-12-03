import { Request, Response } from 'express';
import{ Thought } from '../models/Thought';
import { User } from '../models/User';

export const thoughtCOntroller = {
    // Get all thoughts
    async getThoughts(_: Request, res: Response): Promise<void> {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get a single thought
    async getThoughtsById(req: Request, res: Response): Promise<void> {
        try {
            const thought = await Thought.findById(req.params.id);
            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create new thought
    async createThought(req: Request, res: Response): Promise<void> {
        try {
            const { thoughtText, username, userId} = req.body;

            const thought = await Thought.create({ thoughtText, username });
            await User.findByIdAndUpdate(
                userId,
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            res.status(201).json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update a thought
    async updateThought(req: Request, res: Response): Promise<void> {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thouht found with that ID' });
                return;
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Delete a thought
    async deleteThought(req: Request, res: Response): Promise<void> {
        try {
            const thought = await Thought.findByIdAndDelete(req.params.id);

            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
            // Remove thought from user's array
            await User.findOneAndUpdate(
                { thoughts: req.params.id },
                { $pull: { thoughts: req.params.id } }
            );
            res.json({ message: 'Thought deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Add a reaction to a thought
    async addReaction(req: Request, res: Response): Promise<void> {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $push: { reactions: req.body } },
                { new: true, runValidators: true}
            );
            
            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Remove a reaction
    async removeReaction(req: Request, res: Response): Promise<void> {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $pull: { reactions: { reactionId: req.params.reactionID } } },
                { new: true }
            );
            
            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};