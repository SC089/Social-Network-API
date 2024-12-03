"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thought = void 0;
const mongoose_1 = require("mongoose");
const reactionSchema = new mongoose_1.Schema({
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => new Date(timestamp).toLocaleString(), // Getter for formatting
    },
}, {
    toJSON: {
        getters: true, // Enable getter transformation for JSON responses
    },
    id: false, // Disable virtual `id`
});
const thoughtSchema = new mongoose_1.Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    reactions: [reactionSchema],
}, {
    toJSON: {
        getters: true,
    },
    id: false,
});
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});
exports.Thought = (0, mongoose_1.model)('Thought', thoughtSchema);
