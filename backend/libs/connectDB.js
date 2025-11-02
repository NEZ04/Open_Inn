import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, 
    });

    console.log("✅ Connected to Database via Mongoose");
  } catch (error) {
    console.error("❌ Error connecting to Database:", error);
    process.exit(1);
  }
};
