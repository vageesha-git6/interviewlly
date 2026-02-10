import mongoose from "mongoose";
import Session from "../models/session.js";
import { streamClient, chatClient } from "../lib/stream.js";

export async function createSession(req, res) {
  // Implementation for creating a session
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      clerkId,
      callId,
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();
    res.status(201).json({ session: session });
  } catch (error) {
    console.log("Error in createSession", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSession(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSession", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSession(req, res) {
  // Implementation for creating a session
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSession", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  // Implementation for creating a session
  try {
    const id = req.params?.id || req.body?.id || req.query?.id;
    if (!id) return res.status(400).json({ message: "Session id is required" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid session id" });

    const session = await Session.findById(id)
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId");
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function joinSession(req, res) {
  // Implementation for creating a session
  try {
    const id = req.params?.id || req.body?.id || req.query?.id;
    if (!id) return res.status(400).json({ message: "Session id is required" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid session id" });
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if(session.status !== "active"){
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if(session.host.toString() === userId.toString()){
      return res.status(400).json({ message: "Host cannot join as participant" });
    }

    if (session.participant) {
      return res
        .status(409)
        .json({ message: "Session already has a participant" });
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  // Implementation for creating a session
  try {
    const id = req.params?.id || req.body?.id || req.query?.id;
    if (!id) return res.status(400).json({ message: "Session id is required" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid session id" });
    const userId = req.user._id;
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only host can end the session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    session.status = "completed";
    await session.save();

    // delete stream
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    //delete chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    res.status(200).json({ message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
