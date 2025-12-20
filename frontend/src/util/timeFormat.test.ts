import { describe, expect, it } from "vitest";
import { formatDate, formatTime } from "./timeFormat";

describe("timeFormat", () => {
  it("formats date strings to DD.MM.YYYY", () => {
    expect(formatDate("2025-01-02T03:04:00")).toBe("02.01.2025");
  });

  it("formats time strings to HH:mm", () => {
    expect(formatTime("2025-01-02T03:04:00")).toBe("03:04");
  });
});
