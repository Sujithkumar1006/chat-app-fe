import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-loading-skeleton/dist/skeleton.css";

console.log(process.env.AUTH0_AUDIENCE);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <Auth0Provider
      domain={process.env.AUTH0_DOMAIN ?? ""}
      clientId={process.env.CLIENT_ID ?? ""}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.AUTH0_AUDIENCE ?? "",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Auth0Provider>
  </BrowserRouter>
  // </StrictMode>
);
