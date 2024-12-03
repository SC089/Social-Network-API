import mongoose, { connection } from "mongoose";

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialnetwork';

const connectDB = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error', err);
        process.exit(1);
    }
};

export default connectDB;