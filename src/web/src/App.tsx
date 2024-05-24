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

import { EditRound } from "./pages/EditRound";
import NewFeedbackRound from "./pages/NewFeedbackRound";
import { InteractionStatus } from "@azure/msal-browser";
import Home from "./pages/Home";
import { ViewRound } from "./pages/ViewRound";
import NewTemplate from "./pages/NewTemplate";

const App: React.FC = () => {
console.log(import.meta.env.VITE_API_CLIENT_ID)
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-0 lg:px-0 xl:px-0">
      <div className="max-w-full md:max-w-[50rem]  mx-auto">
        <Router>
          <Routes>
            <Route path="/round/edit/:name" element={<EditRound />} />
            <Route
              path="/"
              element={
                <ProtectedRouteWrapper>
                  <Home />
                </ProtectedRouteWrapper>
              }
            />
            <Route
              path="/round/view/:name"
              element={
                <ProtectedRouteWrapper>
                  <ViewRound />
                </ProtectedRouteWrapper>
              }
            />
            <Route
              path="/newfeedbackround"
              element={
                <ProtectedRouteWrapper>
                  <NewFeedbackRound />
                </ProtectedRouteWrapper>
              }
            />
            <Route
              path="/newfeedbackround/edit/:name"
              element={
                <ProtectedRouteWrapper>
                  <NewFeedbackRound />
                </ProtectedRouteWrapper>
              }
            />
            <Route
              path="/newtemplate"
              element={
                <ProtectedRouteWrapper>
                  <NewTemplate />
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
