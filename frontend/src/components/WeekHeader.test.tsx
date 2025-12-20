import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import WeekHeader from "./WeekHeader";

describe("WeekHeader", () => {
  it("renders the label and triggers callbacks", () => {
    const onPrevWeek = vi.fn();
    const onNextWeek = vi.fn();
    const onToday = vi.fn();

    render(
      <WeekHeader
        weekLabel="KW 12"
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onToday={onToday}
      />
    );

    expect(screen.getByText("KW 12")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    expect(onToday).toHaveBeenCalledTimes(1);
    expect(onPrevWeek).toHaveBeenCalledTimes(1);
    expect(onNextWeek).toHaveBeenCalledTimes(1);
  });
});
