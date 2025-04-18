import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import "react-tooltip/dist/react-tooltip.css";

import Home from "./Home";
import { useEffect } from "react";

function App() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect } =
    useAuth0();

  // useEffect(() => {
  //   if (!isAuthenticated) loginWithRedirect();
  // }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return <Home />;
  } else {
    return (
      <div className="login-ctn">
        <button
          onClick={() =>
            loginWithRedirect({
              authorizationParams: {
                scope: "openid profile email",
              },
            })
          }
        >
          Log in
        </button>
      </div>
    );
  }
}

export default App;
