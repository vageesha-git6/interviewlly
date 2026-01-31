import { requireAuth } from "@clerk/express";
import userModel from "../models/userModel.js";
import { ENV } from "../lib/env.js";

async function fetchClerkUser(clerkId) {
  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
      headers: {
        Authorization: `Bearer ${ENV.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching Clerk user:", err);
    return null;
  }
}

export const protectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      let user = await userModel.findOne({ clerkId });

      // If user doesn't exist in our DB, try to fetch from Clerk and create it locally
      if (!user) {
        const clerkUser = await fetchClerkUser(clerkId);
        if (clerkUser) {
          let email =
            clerkUser.email_addresses?.[0]?.email?.address ||
            clerkUser.email ||
            "";
          // If Clerk didn't provide an email, use a deterministic fallback
          if (!email) {
            email = `${clerkId}@clerk.local`;
          }
          const name = `${clerkUser.first_name || ""} ${
            clerkUser.last_name || ""
          }`.trim();
          const profileImage = clerkUser.image_url || clerkUser.profile_image_url || "";

          try {
            user = await userModel.create({
              clerkId,
              email,
              name: name || "User",
              profileImage,
            });
          } catch (createErr) {
            console.error("Error creating user from Clerk data:", createErr);
          }
        }
      }

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
