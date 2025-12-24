import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppProvider } from "./Context/Context.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// import { ErrorBoundary } from "react-error-boundary";
// import ErrorFallback from "./common-components/ErrorFallBack.jsx";
import { EcomAppProvider } from "./Context/EcomContext.jsx";
import { BoqAppProvider } from "./Context/BoqContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
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
  </StrictMode>
);
