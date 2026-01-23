import express from "express";
import { ENV } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import { protectedRoute } from "./middleware/protectedRoute.js";
import cors from "cors";
import { serve } from "inngest/express";
import chatRouter from "./routes/chatRoutes.js";
import sessionRouter from "./routes/sessionRoute.js";

const app = express();
app.use(express.json());
app.use(clerkMiddleware());

app.use(
  cors({
    origin: "",
    Credential: true,
  })
);
app.use("/api/inngest", serve({ client: inngest, functions }));
// const __dirname =path.resolve()

app.get("/video-calls", protectedRoute,(req, res) => {
  res.send("video call endpoint");
});
app.use("/api/chat", chatRouter);
app.use("/api/sessions", sessionRouter);







const Port = 4000;
app.listen(Port, () => {
  connectDb();
  console.log(`Server is running on ${Port}`);
});
