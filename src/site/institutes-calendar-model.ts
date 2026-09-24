export interface InstituteCalendarEvent {
  slug: string;
  title: string;
  start: string;
  end: string;
  location: string;
  horizon: boolean;
  url: string;
}

export const COVERAGE_END = "2027-12-31";
export const SITE_TIME_ZONE = "America/Toronto";
const DAY = 86_400_000;

/** Calendar components only: never parse CMS dates through the visitor's zone. */
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year! < 1000 || month! < 1 || month! > 12 || day! < 1) return false;
  return new Date(Date.UTC(year!, month! - 1, day!)).toISOString().slice(0, 10) === value;
}

export function siteToday(now = new Date(), zone = SITE_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (name: string) => parts.find((p) => p.type === name)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function addDays(date: string, amount: number): string {
  return new Date(Date.parse(`${date}T12:00:00Z`) + amount * DAY).toISOString().slice(0, 10);
}

export function monthStart(date: string): string {
  return `${date.slice(0, 7)}-01`;
}
export function shiftMonth(date: string, amount: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const first = new Date(Date.UTC(year!, month! - 1 + amount, 1));
  const lastDay = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
  ).getUTCDate();
  first.setUTCDate(Math.min(day!, lastDay));
  return first.toISOString().slice(0, 10);
}
export function dayOfWeek(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}
export function dateLabel(date: string, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(`${date}T12:00:00Z`));
}

export function eventsOn(events: InstituteCalendarEvent[], date: string): InstituteCalendarEvent[] {
  return events.filter((event) => event.start <= date && event.end >= date);
}

export function readCalendarEvents(root: ParentNode, today: string): InstituteCalendarEvent[] {
  const seen = new Set<string>();
  const result: InstituteCalendarEvent[] = [];
  for (const row of root.querySelectorAll<HTMLElement>("[data-ipmi-calendar-event]")) {
    const {
      slug = "",
      title = "",
      start = "",
      end = "",
      location = "",
      horizon = "",
      url = "",
    } = row.dataset;
    if (
      !slug ||
      !title.trim() ||
      !location.trim() ||
      !validDate(start) ||
      !validDate(end) ||
      start > end ||
      end < today ||
      start > COVERAGE_END ||
      seen.has(slug)
    )
      continue;
    // Missing/unknown boolean values must never turn an unreleased event into a link.
    if (horizon !== "true" && horizon !== "false") continue;
    seen.add(slug);
    result.push({
      slug,
      title: title.trim(),
      start,
      end,
      location: location.trim(),
      horizon: horizon === "true",
      url: url === `/institutes/${slug}` ? url : "",
    });
  }
  return result.sort(
    (a, b) =>
      a.start.localeCompare(b.start) ||
      a.title.localeCompare(b.title) ||
      a.slug.localeCompare(b.slug),
  );
}
