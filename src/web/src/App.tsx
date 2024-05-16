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
// import Feedbackrounds from "./components/feedbackrounds";
import Home from "./pages/Home";
import config from "./config/config"


import { ViewRound } from "./pages/ViewRound";
import { Button } from "./shadcnComponents/ui/button";

const App: React.FC = () => {


  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={
  //         <>
  //           <Button onClick={
  //             async () => {
  //               const response = await fetch(config.api.baseUrl + '/lists');
  //               const getList = await response.json();
  //               console.log(getList);
  //             }}>HEJ</Button>
  //           <Home />
  //         </>
  //       }
  //       />
  //     </Routes>
  //   </Router>
  // )
  // }

  return (

    <div className="container mx-auto px-4 sm:px-6 md:px-0 lg:px-0 xl:px-0">
      <div className="max-w-full md:max-w-[50rem]  mx-auto">
        <Router>
          <Routes>
            <Route path="/round/edit/:name" element={
              <EditRound />
            } />
            <Route path="/" element={
              <ProtectedRouteWrapper>
                <Home />
              </ProtectedRouteWrapper>
            } />
            <Route path="/round/view/:name" element={<ProtectedRouteWrapper><ViewRound /> </ProtectedRouteWrapper>} />
            <Route path="/newfeedbackround" element={<ProtectedRouteWrapper><NewFeedbackRound /> </ProtectedRouteWrapper>} />
          </Routes>
        </Router>
      </div >
    </div >
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