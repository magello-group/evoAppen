import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: "35feaa01-8b5f-4b67-b7be-442d959f2e47",
        authority: "https://login.microsoftonline.com/0ef3ca2b-0b6f-4543-b1f3-eb1e7ec2069f",
        redirectUri: import.meta.env.VITE_APP_URI
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["User.Read"]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
