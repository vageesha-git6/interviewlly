import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Stream API key and secret is missing");
}

export const streamClient = new StreamClient(apiKey, apiSecret); //for video calls
export const chatClient = StreamChat.getInstance(apiKey, apiSecret); //for chatMessaging

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers(userData);
    console.log(`Stream user ${userData.id} upserted successfully`);
    return userData;
  } catch (error) {
    console.log("error upserting stream user:", error);
    throw error;
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId, { markMessagesDeleted: true });
    console.log(`Stream user ${userId} deleted successfully`);
    return true;
  } catch (error) {
    console.log("error deleting stream user:", error);
    throw error;
  }
};
