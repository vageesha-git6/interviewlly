import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/session";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session Created Successfully"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to Create Room"),
  });
  return result;
};

export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });
  return result;
};

export const useMyRecentSessions = (enabled = true) => {
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
    enabled,
  });
  return result;
};

export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });
  return result;
};

export const useJoinSession = () => {
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: (id) => sessionApi.joinSession(id),
    onSuccess: () => toast.success("Join Session Successfully"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed To Join Session"),
  });
  return result;
};

export const useEndSession = () => {
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: (id) => sessionApi.endSession(id),
    onSuccess: () => toast.success("End Session Successfully"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed To end Session"),
  });
  return result;
};
