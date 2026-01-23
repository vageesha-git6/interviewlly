import { Inngest } from "inngest";
import { connectDb } from "./db.js";
import userModel from "../models/userModel.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "interviewly" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDb();
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email.address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };
    await userModel.create(newUser);
    await upsertStreamUser({
      id:newUser.clerkId.toString(),
      name:newUser.name,
      image:newUser.profileImage
    })
  }
);

const deleteUserFromDb = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDb();
    const { id } = event.data;
    await userModel.deleteOne({ clerkId: id });
    await deleteStreamUser(id.toString());
  }
);



export const functions = [syncUser, deleteUserFromDb];