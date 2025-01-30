/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AuthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";

import { loginRequest } from "./misc/authConfig";
import "./App.css";

import { AnswerRound } from "./pages/AnswerRound";
import { Round } from "./pages/Round";
import { InteractionStatus } from "@azure/msal-browser";
import { Landing } from "./pages/Landing";
import { ViewRound } from "./pages/ViewRound";
import { Template } from "./pages/Template";

const App: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-0 lg:px-0 xl:px-0">
      <div className="max-w-full md:max-w-[50rem] mx-auto">
        <Router>
          <Routes>
            <Route path="/answer/:name" element={<AnswerRound />} />
            <Route
              path="/"
              element={
                <ProtectedRouteWrapper>
                  <Landing />
                </ProtectedRouteWrapper>
              }
            />
            <Route
              path="/view/:name"
              element={
                <ProtectedRouteWrapper>
                  <ViewRound />
                </ProtectedRouteWrapper>
              }
            />
            <Route
              path="/round/:id?"
              element={
                <ProtectedRouteWrapper>
                  <Round />
                </ProtectedRouteWrapper>
              }
            />
            <Route
              path="/template/:id?"
              element={
                <ProtectedRouteWrapper>
                  <Template />
                </ProtectedRouteWrapper>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

const ProtectedRouteWrapper = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();

  useEffect(() => {
    const redirectIfNotAuthenticated = () => {
      if (inProgress === InteractionStatus.None && !isAuthenticated) {
        instance.loginRedirect(loginRequest);
      }
    };
    const redirectTimeout = setTimeout(redirectIfNotAuthenticated, 100);
    return () => clearTimeout(redirectTimeout);
  }, [inProgress, isAuthenticated, instance]);
  return <AuthenticatedTemplate>{children}</AuthenticatedTemplate>;
};

export default App;
