import { describe, it, expect } from "vitest";
import { reminderDate, reminderIcs } from "../lib/reminder";

describe("calendar reminder", () => {
  it("lands 3 and 6 months out", () => {
    const now = new Date(2026, 10, 11); // Nov 11 2026
    expect(reminderDate(3, now)).toBe("20270211");
    expect(reminderDate(6, now)).toBe("20270511");
  });

  it("is a valid all-day VEVENT with no urgency language", () => {
    const ics = reminderIcs(3, new Date(2026, 10, 11));
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART;VALUE=DATE:20270211");
    expect(ics).toContain("you set this");
    for (const banned of ["as soon as possible", "urgent", "don't wait", "hurry", "running out"]) {
      expect(ics.toLowerCase()).not.toContain(banned);
    }
  });

  it("carries no personal data at all", () => {
    const ics = reminderIcs(6, new Date(2026, 10, 11));
    expect(ics).not.toMatch(/name|email|phone|diagnos/i);
  });
});
