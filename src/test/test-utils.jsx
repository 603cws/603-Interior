import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { AppProvider } from "../Context/Context";
import { BoqAppProvider } from "../Context/BoqContext";
import { EcomAppProvider } from "../Context/EcomContext";
import ErrorFallback from "../common-components/ErrorFallBack";

/**
 * Custom render function that wraps components
 * with the same providers used in main.jsx
 */
export function renderWithProviders(
  ui,
  { route = "/", initialEntries = [route] } = {}
) {
  return render(
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppProvider>
          <BoqAppProvider>
            <EcomAppProvider>{ui}</EcomAppProvider>
          </BoqAppProvider>
        </AppProvider>
      </MemoryRouter>
    </ErrorBoundary>
  );
}
