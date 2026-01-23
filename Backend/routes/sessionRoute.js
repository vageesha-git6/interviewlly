import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { createSession, endSession, getActiveSession, getMyRecentSession, getSessionById, joinSession } from "../controllers/sessionController.js";

const sessionRouter = express.Router();

sessionRouter.post("/", protectedRoute, createSession);
sessionRouter.get("/active", protectedRoute, protectedRoute, getActiveSession);
sessionRouter.get("/my-recent", protectedRoute, getMyRecentSession);

sessionRouter.get("/:id", protectedRoute, getSessionById);
sessionRouter.post("/:id/join", protectedRoute, joinSession);
sessionRouter.post("/:id/end", protectedRoute, endSession);

export default sessionRouter;
