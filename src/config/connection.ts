import mongoose from "mongoose";

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialnetwork';

const connectDB = async (): Promise<void> => {
    try {
        // Establish connection to MongoDB
        await mongoose.connect(connectionString);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error', err);
        process.exit(1);
    }
};

export default connectDB;