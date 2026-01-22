import App from "./App";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test/test-utils";

describe("App routing", () => {
  it("Search text from App on about us page", async () => {
    renderWithProviders(<App />, { route: "/Aboutus" });

    expect(
      await screen.findByText(/Creating Workspaces\s*that inspires/i)
    ).toBeInTheDocument();
  });
  it("Search btn from App on about us page", async () => {
    renderWithProviders(<App />, { route: "/Aboutus" });
    expect(
      await screen.findByRole("button", {
        name: /start your layout/i,
      })
    ).toBeInTheDocument();
  });
});
