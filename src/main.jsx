import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppProvider } from "./Context/Context.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./common-components/ErrorFallBack.jsx";
import { EcomAppProvider } from "./Context/ecomContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // action to run when resetErrorBoundary() is called
        window.location.reload(); // refresh the entire page
      }}
    >
      <BrowserRouter>
        <AppProvider>
          <EcomAppProvider>
            <Toaster />
            <App />
          </EcomAppProvider>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
