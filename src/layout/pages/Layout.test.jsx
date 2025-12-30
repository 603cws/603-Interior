import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/test-utils";
import Layout from "./Layout";

describe("Total Area input is 25000", () => {
  it("Check workspace values", async () => {
    renderWithProviders(<Layout />);

    const input = screen.getByTitle(/enter area value here/i);

    await userEvent.clear(input);
    await userEvent.type(input, "25000");

    expect(input).toHaveValue(25000);

    checkLayoutValue(/linear Workstation/i, 417);
    checkLayoutValue(/l-type Workstation/i, 25);
    checkLayoutValue(/md cabin/i, 7);
    checkLayoutValue(/manager cabin/i, 8);
    checkLayoutValue(/small cabin/i, 4);
    checkLayoutValue(/interview room/i, 2);
    checkLayoutValue(/conference room/i, 5);
    checkLayoutValue(/board room/i, 1);
    checkLayoutValue(/meeting room/i, 6);
    checkLayoutValue(/Meeting Room\(large\)/i, 2);
    checkLayoutValue(/hr room/i, 0);
    checkLayoutValue(/finance room/i, 0);
    checkLayoutValue(/sales room/i, 0);
    checkLayoutValue(/video recording room/i, 1);
    checkLayoutValue(/reception/i, 1);
    checkLayoutValue(/lounge/i, 1);
    checkLayoutValue(/phone booth/i, 8);
    checkLayoutValue(/breakout room/i, 0);
    checkLayoutValue(/washrooms/i, 1);
    checkLayoutValue(/ups room/i, 0);
    checkLayoutValue(/bms room/i, 0);
    checkLayoutValue(/server room/i, 8);
    checkLayoutValue(/executive washroom/i, 0);
  });
});

export function checkLayoutValue(titleRegex, expectedValue) {
  const matches = screen.queryAllByText(titleRegex);

  const titleEl =
    matches.length > 1
      ? matches.find((el) => el instanceof HTMLDivElement)
      : screen.getByText(titleRegex);

  const container = titleEl.closest(".grid");

  const input2 = within(container).getByTestId("layout-value");

  expect(input2).toHaveValue(expectedValue);
}
