import express from "express";
import { getStreamToken } from "../controllers/chatControllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const chatRouter = express.Router();

chatRouter.get("/token", protectedRoute, getStreamToken);

export default chatRouter;