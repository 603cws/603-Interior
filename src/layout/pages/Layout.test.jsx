import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/test-utils";
import Navbar from "../components/Navbar";

describe("Navbar input", () => {
  it("allows typing total area and displays value", async () => {
    const user = userEvent.setup();

    // ✅ mock props
    const mockSetAreaQuantities = vi.fn();
    const mockHandleVariantChange = vi.fn();

    renderWithProviders(
      <Navbar
        resetAll={vi.fn()}
        areaQuantities={{}}
        areaValues={{}}
        toggleProfile={vi.fn()}
        iconRef={{ current: null }}
        builtArea={0}
        setAreaQuantities={mockSetAreaQuantities}
        handleVariantChange={mockHandleVariantChange}
        seatCounts={{}}
      />
    );

    const input = screen.getByTitle(/Enter area value here/i);

    await user.clear(input);
    await user.type(input, "1200");

    expect(input).toHaveValue(1200);

    // ✅ side-effects were called
    expect(mockSetAreaQuantities).toHaveBeenCalled();
    expect(mockHandleVariantChange).toHaveBeenCalled();
  });
});
