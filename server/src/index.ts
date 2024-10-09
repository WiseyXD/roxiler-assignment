import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import transactionRoutes from './routes/index';

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
