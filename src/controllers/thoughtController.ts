import { Request, Response } from 'express';
import{ Thought } from '../models/Thought';
import { User } from '../models/User';

export const thoughtController = {
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
    async getThoughtById(req: Request, res: Response): Promise<void> {
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
            console.log('This is your thought ID:', thought._id);
            res.status(201).json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update a thought
    // async updateThought(req: Request, res: Response): Promise<void> {
    //     try {
    //         const thought = await Thought.findByIdAndUpdate(
    //             req.params.id,
    //             req.body,
    //             { new: true, runValidators: true }
    //         );

    //         if (!thought) {
    //             res.status(404).json({ message: 'No thouht found with that ID' });
    //             return;
    //         }
    //         res.json(thought);
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },
    async updateThought(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; // Extract the thought ID from the request URL
            const { thoughtText, username } = req.body; // Extract the fields to update from the request body
    
            // Validate required fields
            if (!thoughtText || !username) {
                res.status(400).json({ message: 'Both thoughtText and username are required' });
                return;
            }
    
            // Update the thought
            const updatedThought = await Thought.findByIdAndUpdate(
                id,
                { thoughtText, username },
                { new: true, runValidators: true } // Ensure validators run during update
            );
    
            // Check if the thought was found and updated
            if (!updatedThought) {
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
    
            res.json(updatedThought);
        } catch (err) {
            console.error('Error updating thought:', err);
            res.status(500).json({ message: 'Error updating thought', error: err });
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
            const { thoughtId } = req.params;
            const { reactionBody, username } = req.body;
    
            // Validate required fields
            if (!reactionBody || !username) {
                res.status(400).json({ message: 'Reaction body and username are required' });
                return;
            }
    
            // Add the reaction to the thought
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $push: { reactions: { reactionBody, username } } }, // Push a new reaction
                { new: true, runValidators: true }
            );
    
            if (!updatedThought) {
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
    
            // Find the newly created reaction by checking the last reaction in the array
            const newReaction = updatedThought.reactions[updatedThought.reactions.length - 1];
    
            if (newReaction) {
                console.log('New Reaction ID:', newReaction._id); // Log the reaction ID
            } else {
                console.log('Reaction could not be logged.');
            }
    
            res.status(201).json(updatedThought);
        } catch (err) {
            console.error('Error adding reaction:', err);
            res.status(500).json(err);
        }
    },    
    // Remove a reaction
    async removeReaction(req: Request, res: Response): Promise<void> {
        try {
            const { thoughtId, reactionId } = req.params;
    
            // Ensure both IDs are present
            if (!thoughtId || !reactionId) {
                res.status(400).json({ message: 'Thought ID and Reaction ID are required' });
                return;
            }
    
            // Pull the reaction from the thought's reactions array
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $pull: { reactions: { _id: reactionId } } }, // Match `_id` of the reaction
                { new: true }
            );
    
            if (!updatedThought) {
                res.status(404).json({ message: 'No thought found with that ID' });
                return;
            }
    
            res.json({ message: 'Reaction deleted successfully', updatedThought });
        } catch (err) {
            console.error('Error deleting reaction:', err);
            res.status(500).json({ message: 'Error deleting reaction', error: err });
        }
    }
    
};