import { requireAuth } from "@clerk/express";
import userModel from "../models/userModel.js";

export const protectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      const user = await userModel.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectedRoute middleware:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
