import mongoose from "mongoose";

const connectDB = async() : Promise<void> => {
    try {
        const mongoString = process.env.MONGO_URL || process.env.MONGO_URI;
        if (!mongoString) {
            console.log("MongoDB failed: Missing MONGO_URL / MONGO_URI environment variable.");
            process.exit(1);
        }
        const conn = await mongoose.connect(mongoString);

        console.log(`Mongo DB connected : ${conn.connection.host}`);
    } catch (error: any) {
        console.log("MongoDB failed:", error?.message || error);
        process.exit(1);
    }
}

export default connectDB