import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import TimeRangeFields from "./TimeRangeFields";

describe("TimeRangeFields", () => {
  it("renders values and fires change handlers", () => {
    const onStartChange = vi.fn();
    const onEndChange = vi.fn();

    render(
      <TimeRangeFields
        startValue="08:00"
        endValue="17:00"
        onStartChange={onStartChange}
        onEndChange={onEndChange}
      />
    );

    const startInput = screen.getByLabelText("Start") as HTMLInputElement;
    const endInput = screen.getByLabelText("Ende") as HTMLInputElement;

    expect(startInput.value).toBe("08:00");
    expect(endInput.value).toBe("17:00");

    fireEvent.change(startInput, { target: { value: "09:00" } });
    fireEvent.change(endInput, { target: { value: "18:00" } });

    expect(onStartChange).toHaveBeenCalledTimes(1);
    expect(onEndChange).toHaveBeenCalledTimes(1);
  });
});
