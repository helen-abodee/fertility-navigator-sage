/**
 * The privacy-safe reminder: an event the patient saves into their OWN
 * calendar. Nothing is scheduled on any server, no address or number is
 * collected, and deleting the event is entirely in their hands.
 */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function reminderDate(monthsFromNow: number, now: Date = new Date()): string {
  const d = new Date(now);
  d.setMonth(d.getMonth() + monthsFromNow);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

export function reminderIcs(monthsFromNow: number, now: Date = new Date()): string {
  const date = reminderDate(monthsFromNow, now);
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T000000Z`;
  const uid = `fpn-${date}-${Math.random().toString(36).slice(2, 10)}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fertility Preservation Navigator//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${date}`,
    "SUMMARY:Fertility check-in (you set this)",
    "DESCRIPTION:You asked for this nudge. Have you had space to think about fertility again? The Navigator is where you left it. If now is not the time\\, move this to a later date.",
    "URL:https://navigator-sage.vercel.app",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadReminder(monthsFromNow: number): void {
  const blob = new Blob([reminderIcs(monthsFromNow)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fertility-check-in.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
