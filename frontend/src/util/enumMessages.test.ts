import { describe, expect, it } from "vitest";
import {
  toTimeRangeTypeLabel,
  toWorkDayValidationMessage
} from "./enumMessages";

describe("enumMessages", () => {
  it("maps time range types to labels", () => {
    expect(toTimeRangeTypeLabel("WORK")).toBe("Arbeit");
    expect(toTimeRangeTypeLabel("BREAK")).toBe("Pause");
    expect(toTimeRangeTypeLabel("OTHER")).toBe("OTHER");
  });

  it("maps validation messages and passes unknown values through", () => {
    expect(toWorkDayValidationMessage("EMPTY_TIME_RANGE")).toBe(
      "Bitte mindestens einen Zeitraum erfassen."
    );
    expect(toWorkDayValidationMessage("UNKNOWN_CODE")).toBe("UNKNOWN_CODE");
    expect(toWorkDayValidationMessage(null)).toBeNull();
    expect(toWorkDayValidationMessage(undefined)).toBeNull();
  });
});
