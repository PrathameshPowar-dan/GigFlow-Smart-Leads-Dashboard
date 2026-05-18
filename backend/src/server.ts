import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';
import UserRoutes from './routes/user.routes.js';
import LeadRoutes from './routes/lead.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', UserRoutes);
app.use('/api/leads', LeadRoutes);
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is healthy' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB().then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
        .catch((err) => {
            console.log("Server Error: ", err)
        });
};

startServer();