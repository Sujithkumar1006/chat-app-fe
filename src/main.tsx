import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-loading-skeleton/dist/skeleton.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <Auth0Provider
      domain="dev-cdsfu1xs67k0fh7b.us.auth0.com"
      clientId="f37GwSh1LKPBzeNIkZZ6eBdkLPo15xC4"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-cdsfu1xs67k0fh7b.us.auth0.com/api/v2/",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Auth0Provider>
  </BrowserRouter>
  // </StrictMode>
);
