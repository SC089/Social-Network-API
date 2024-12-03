import { Schema, model, Document, Types, SchemaTypeOptions } from 'mongoose';

export interface IReaction {
    reactionId: Types.ObjectId;
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

const reactionSchema = new Schema<IReaction>(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
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
            get: function (timestamp: Date | number | undefined): string {
                if (!timestamp) return '';
                const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
                return date.toLocaleString();
            },
        } as unknown as SchemaTypeOptions<Date>,
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function (timestamp: Date | number | undefined): string {
                if (!timestamp) return '';
                const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
                return date.toLocaleString();
            },
        } as unknown as SchemaTypeOptions<Date>,
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

thoughtSchema.virtual('reactionCount').get(function (this: IThought) {
    return this.reactions.length;
});

export const Thought = model<IThought>('Thought', thoughtSchema);