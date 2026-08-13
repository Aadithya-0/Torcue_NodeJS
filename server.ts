import express from 'express';
import taskRoutes from './routes/router.js';
import authRoutes from './routes/authRoutes.js';
import { verifyAuth } from './middleware/authMiddleware.js';

const app = express();
const PORT = 4000;

app.use(express.json());

// Public routes (no auth needed)
app.use('/auth', authRoutes);

// Protected routes (auth needed)
app.use(verifyAuth);
app.use(taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});