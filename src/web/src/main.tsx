
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./misc/authConfig.tsx";
import FeedbackRoundsContextProvider from "./contexts/FeedbackRoundsContextProvider.tsx";
import CoworkersContextProvider from "./contexts/CoworkersContextProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// VERSION 1.2

/**
 * Initialize a PublicClientApplication instance which is provided to the MsalProvider component
 *
 */
const msalInstance = new PublicClientApplication(msalConfig);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <FeedbackRoundsContextProvider>
          <CoworkersContextProvider>
            <App />
          </CoworkersContextProvider>
        </FeedbackRoundsContextProvider>
      </QueryClientProvider>
    </MsalProvider>
  </React.StrictMode>
);
