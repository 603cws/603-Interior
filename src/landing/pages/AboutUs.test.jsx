import { screen } from "@testing-library/react";
import AboutUs from "./AboutUs";
import { renderWithProviders } from "../../test/test-utils";

describe("App routing", () => {
  it("Search text on about us page", async () => {
    renderWithProviders(<AboutUs />);
    expect(
      await screen.findByText(/Creating Workspaces\s*that inspires/i)
    ).toBeInTheDocument();
  });
  it("Search btn on about us page", async () => {
    renderWithProviders(<AboutUs />);

    expect(
      await screen.findByRole("button", {
        name: /start your layout/i,
      })
    ).toBeInTheDocument();
  });
});
