import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import React from "react";
import Problem from "./pages/Problem";
import Home from "./pages/Home";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  return (
    <React.Fragment>
      <Routes>
        <Route
          path="/"
          element={!isSignedIn ? <Home /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard"
          element={isSignedIn ? <Dashboard /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem"
          element={isSignedIn ? <Problem /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/session/:id"
          element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </React.Fragment>
  );
};

export default App;
