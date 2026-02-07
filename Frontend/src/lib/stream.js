import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let client = null;

export const initializeStreamClient = async (user, token) => {
  // if client exists with same user instead return it

  if (client && client?.user?.id === user.id) return client;

  if(client){
    await disConnectStreamClient()
  }

  if (!apiKey) throw new Error("Stream API Error");

  client = new StreamVideoClient({
    apiKey,
    user,
    token,
  });

  return client;
};

// disConnectStreamUSer
export const disConnectStreamClient = async () => {
  if (client) {
    try {
      await client.disconnectUser();
      client = null;
    } catch (error) {
      console.error("Error disconnecting Stream Client", error);
    }
  }
};
