import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useActiveSessions,
  useCreateSession,
  useMyRecentSessions,
} from "../hooks/useSession";
import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import ActiveSessions from "../components/ActiveSessions";
import StatsCards from "../components/StatsCards";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } =
    useMyRecentSessions(!!user);
  const { data: activeSessionsData, isLoading: loadingActiveSessions } =
    useActiveSessions();

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInsession = (session) => {
    if (!user.id) return false;
    return (
      session?.host?.clerkId === user.id ||
      session.participant.clerkId === user.id
    );
  };

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      },
    );
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        {/* grid layout */}
        <div className="container mx-auto px-6 pb-16 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />

            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInsession}
            />
          </div>
          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions}
          />
        </div>
      </div>
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation?.isPending}
      />
    </>
  );
};

export default Dashboard;
