import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "../hooks/useSession";
import { PROBLEMS } from "../data/problem";
import { executeCode } from "../lib/piston";

const SessionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLang, setSelectedLang] = useState("javascript");
  const [code, setCode] = useState(
    problemData?.starterCode?.[selectedLang] || "",
  );

  //auto-join session if user is not alreaady a participants and not the host

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);
  //   redirect the participant when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLang, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified.",
      )
    ) {
      endSessionMutation.mutate(id, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  return <div></div>;
};

export default SessionPage;
