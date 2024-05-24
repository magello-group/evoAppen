import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_API_CLIENT_ID,
        authority: "https://login.microsoftonline.com/0ef3ca2b-0b6f-4543-b1f3-eb1e7ec2069f",
        redirectUri: import.meta.env.VITE_APP_URI
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: [`api://${import.meta.env.VITE_API_CLIENT_ID}/User.Read`]
};

