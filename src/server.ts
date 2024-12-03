import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connection';
import userRoutes from './routes/api/userRoutes';
import thoughtRoutes from './routes/api/thoughtRoutes';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/users', userRoutes);   // user routes
app.use('/api/thoughts', thoughtRoutes); // thought routes (if applicable)

// Start the server
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
