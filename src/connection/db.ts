import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel";
import Chat from "../models/chatModel";
import Message from "../models/messageModel";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export { User, Chat, Message, connectDB };
