import { Schema, model, Document, Types } from 'mongoose';

export interface IReaction {
    _id?: Types.ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date;
}

export interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: IReaction[];
    reactionCount: number;
}

const reactionSchema = new Schema(
    {
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
            get: (timestamp: number) => new Date(timestamp).toLocaleString(), // Getter for formatting
        },
    },
    {
        toJSON: {
            getters: true, // Enable getter transformation for JSON responses
        },
        id: false, // Disable virtual `id`
    }
);

const thoughtSchema = new Schema(
    {
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
            get: (timestamp: number) => new Date(timestamp).toLocaleString(),
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);


thoughtSchema.virtual('reactionCount').get(function (this: IThought) {
    return this.reactions.length;
});

export const Thought = model<IThought>('Thought', thoughtSchema);