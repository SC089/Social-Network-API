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
exports.userController = void 0;
const User_1 = require("../models/User");
const Thought_1 = require("../models/Thought");
exports.userController = {
    // Gets all users
    getUsers(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.User.find().populate('thoughts').populate('friends');
                res.json(users);
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    },
    // Get one user from ID
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findById(req.params.id).populate('thoughts').populate('friends');
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.json(user);
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    },
    // Create new user
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.create(req.body);
                res.status(201).json(user);
            }
            catch (err) {
                res.status(500).json({ message: 'Error creating user', error: err });
            }
        });
    },
    // Update a user
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!user) {
                    res.status(404).json({ message: 'No user found with that ID' });
                    return;
                }
                res.json(user);
            }
            catch (err) {
                res.status(500).json({ message: 'Error updating user', error: err });
            }
        });
    },
    // Delete a user and their thoughts
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findByIdAndDelete(req.params.id);
                if (!user) {
                    res.status(404).json({ message: 'No user found with that ID' });
                    return;
                }
                // Remove associated thoughts
                yield Thought_1.Thought.deleteMany({ _id: { $in: user.thoughts } });
                res.json({ message: 'User and associated thoughts deleted successfully' });
            }
            catch (err) {
                res.status(500).json({ message: 'Error deleting user', error: err });
            }
        });
    },
    // Add a friend
    addFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, // $addToSet avoids duplicates
                { new: true }).populate('friends');
                if (!user) {
                    res.status(404).json({ message: 'No user found with that ID' });
                    return;
                }
                res.json(user);
            }
            catch (err) {
                res.status(500).json({ message: 'Error adding friend', error: err });
            }
        });
    },
    // Remove a friend
    removeFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, // $pull removes the friendId
                { new: true }).populate('friends');
                if (!user) {
                    res.status(404).json({ message: 'No user found with that ID' });
                    return;
                }
                res.json(user);
            }
            catch (err) {
                res.status(500).json({ message: 'Error removing friend', error: err });
            }
        });
    },
};
