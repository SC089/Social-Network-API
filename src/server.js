"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("./config/connection"));
const userRoutes_1 = __importDefault(require("./routes/api/userRoutes"));
const thoughtRoutes_1 = __importDefault(require("./routes/api/thoughtRoutes"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Connect to MongoDB
(0, connection_1.default)();
// API Routes
app.use('/api/users', userRoutes_1.default); // user routes
app.use('/api/thoughts', thoughtRoutes_1.default); // thought routes (if applicable)
// Start the server
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
