import mongoose from 'mongoose';
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }

        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        console.error(`Database connection error: ${(error as Error).message}`);
        process.exit(1);
    }
};