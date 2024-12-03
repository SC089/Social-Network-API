"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.thoughtController = void 0;
const Thought_1 = require("../models/Thought");
const User_1 = require("../models/User");
exports.thoughtController = {
    // Get all thoughts
    getThoughts(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const thoughts = yield Thought_1.Thought.find();
                res.json(thoughts);
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    },
    // Get a single thought
    getThoughtById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const thought = yield Thought_1.Thought.findById(req.params.id);
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with that ID' });
                    return;
                }
                res.json(thought);
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    },
    // Create new thought
    createThought(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { thoughtText, username, userId } = req.body;
                const thought = yield Thought_1.Thought.create({ thoughtText, username });
                yield User_1.User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } }, { new: true });
                console.log('This is your thought ID:', thought._id);
                res.status(201).json(thought);
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
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
    updateThought(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Extract the thought ID from the request URL
                const { thoughtText, username } = req.body; // Extract the fields to update from the request body
                // Validate required fields
                if (!thoughtText || !username) {
                    res.status(400).json({ message: 'Both thoughtText and username are required' });
                    return;
                }
                // Update the thought
                const updatedThought = yield Thought_1.Thought.findByIdAndUpdate(id, { thoughtText, username }, { new: true, runValidators: true } // Ensure validators run during update
                );
                // Check if the thought was found and updated
                if (!updatedThought) {
                    res.status(404).json({ message: 'No thought found with that ID' });
                    return;
                }
                res.json(updatedThought);
            }
            catch (err) {
                console.error('Error updating thought:', err);
                res.status(500).json({ message: 'Error updating thought', error: err });
            }
        });
    },
    // Delete a thought
    deleteThought(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const thought = yield Thought_1.Thought.findByIdAndDelete(req.params.id);
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with that ID' });
                    return;
                }
                // Remove thought from user's array
                yield User_1.User.findOneAndUpdate({ thoughts: req.params.id }, { $pull: { thoughts: req.params.id } });
                res.json({ message: 'Thought deleted successfully' });
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    },
    // Add a reaction to a thought
    addReaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { thoughtId } = req.params;
                const { reactionBody, username } = req.body;
                // Validate required fields
                if (!reactionBody || !username) {
                    res.status(400).json({ message: 'Reaction body and username are required' });
                    return;
                }
                // Add the reaction to the thought
                const updatedThought = yield Thought_1.Thought.findByIdAndUpdate(thoughtId, { $push: { reactions: { reactionBody, username } } }, // Push a new reaction
                { new: true, runValidators: true });
                if (!updatedThought) {
                    res.status(404).json({ message: 'No thought found with that ID' });
                    return;
                }
                // Find the newly created reaction by checking the last reaction in the array
                const newReaction = updatedThought.reactions[updatedThought.reactions.length - 1];
                if (newReaction) {
                    console.log('New Reaction ID:', newReaction._id); // Log the reaction ID
                }
                else {
                    console.log('Reaction could not be logged.');
                }
                res.status(201).json(updatedThought);
            }
            catch (err) {
                console.error('Error adding reaction:', err);
                res.status(500).json(err);
            }
        });
    },
    // Remove a reaction
    removeReaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { thoughtId, reactionId } = req.params;
                // Ensure both IDs are present
                if (!thoughtId || !reactionId) {
                    res.status(400).json({ message: 'Thought ID and Reaction ID are required' });
                    return;
                }
                // Pull the reaction from the thought's reactions array
                const updatedThought = yield Thought_1.Thought.findByIdAndUpdate(thoughtId, { $pull: { reactions: { _id: reactionId } } }, // Match `_id` of the reaction
                { new: true });
                if (!updatedThought) {
                    res.status(404).json({ message: 'No thought found with that ID' });
                    return;
                }
                res.json({ message: 'Reaction deleted successfully', updatedThought });
            }
            catch (err) {
                console.error('Error deleting reaction:', err);
                res.status(500).json({ message: 'Error deleting reaction', error: err });
            }
        });
    }
};
