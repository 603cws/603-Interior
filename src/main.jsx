import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppProvider } from "./Context/Context.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./common-components/ErrorFallBack.jsx";
import { EcomAppProvider } from "./Context/EcomContext.jsx";
import { BoqAppProvider } from "./Context/BoqContext.jsx";

const AppWrapper = ({ children }) => {
  if (import.meta.env.DEV) {
    console.log("Error boundary triggered!");
    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        {children}
      </ErrorBoundary>
    );
  }

  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper>
      <BrowserRouter>
        <AppProvider>
          <BoqAppProvider>
            <EcomAppProvider>
              <Toaster />
              <App />
            </EcomAppProvider>
          </BoqAppProvider>
        </AppProvider>
      </BrowserRouter>
    </AppWrapper>
  </StrictMode>,
);
