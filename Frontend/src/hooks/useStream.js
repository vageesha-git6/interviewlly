import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { sessionApi } from "../api/session";
import { initializeStreamClient, disConnectStreamClient } from "../lib/stream";
import { useEffect, useState } from "react";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall = null;
    let chatClient = null;

    const initCall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;

      try {
        const { token, userId, userName, UserImage } =
          await sessionApi.getStreamToken();
        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: UserImage,
          },
          token,
        );
        setStreamClient(client);
        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClient = StreamChat.getInstance(apiKey);
        await chatClient.connectUser(
          {
            id: userId,
            name: userName,
            image: UserImage,
          },
          token,
        );
        setChatClient(chatClient);
        const chatChannel = chatClient.channel("messaging", session.callId);
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to joined Video call");
        console.error("Error init call", error);
      } finally {
        setInitializingCall(false);
      }
    };

    if (session && !loadingSession) initCall();

    return () => {
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClient) await chatClient.disconnectUser();
          await disConnectStreamClient();
        } catch (error) {
          console.error("CleanUp Error", error);
        }
      })();
    };
  }, [session, loadingSession, isHost, isParticipant]);

  return { streamClient, chatClient, channel, isInitializingCall, call };
}

export default useStreamClient;
