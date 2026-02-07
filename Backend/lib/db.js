import mongoose from "mongoose";
import dns from "dns";
import { ENV } from "./env.js";

export const connectDb = async () => {
  const maxRetries = 5;
  let attempt = 0;

  mongoose.set("strictQuery", false);

  const tryConnect = async () => {
    try {
      // Prefer IPv4 DNS results on environments where IPv6 networking fails
      try {
        if (typeof dns.setDefaultResultOrder === "function") {
          dns.setDefaultResultOrder("ipv4first");
        }
      } catch (e) {
        // non-fatal; continue with default DNS behavior
        console.warn("Could not set DNS result order:", e && e.message ? e.message : e);
      }

      await mongoose.connect(ENV.DB_URL, {
        // fail fast on each attempt
        serverSelectionTimeoutMS: 10000,
        // prefer IPv4 family where supported
        family: 4,
      });
      console.log("MongoDB Connected Successfully ✅");
      return;
    } catch (error) {
      attempt++;
      console.error(`MongoDB connection attempt ${attempt} failed:`, error.message || error);
      if (error && error.reason && error.reason.type) {
        console.error("Topology reason:", error.reason.type);
      }

      if (attempt < maxRetries) {
        const delay = Math.min(30000, 1000 * 2 ** attempt);
        console.log(`Retrying MongoDB connection in ${delay / 1000}s... (${attempt}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, delay));
        return tryConnect();
      }

      console.error("Could not connect to MongoDB after multiple attempts.");
      console.error("Common causes: Atlas cluster paused, network/IP whitelist, incorrect credentials or connection string.");
      // Don't print credentials in logs; mask them if present
      if (ENV.DB_URL) {
        const masked = ENV.DB_URL.replace(/:\/\/(.*?):(.*?)@/, '://***:***@');
        console.error("DB_URL preview:", masked);
      }
      process.exit(1);
    }
  };

  await tryConnect();
};
