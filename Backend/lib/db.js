import mongoose, { mongo } from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async (req, res) => {
  try {
    mongoose.connect(ENV.DB_URL);
    console.log("Mongodb Connected Successfully✅");
  } catch (error) {
    console.error(error + "❌");
    process.exit(1)
  }
};
