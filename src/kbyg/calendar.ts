import type {
  CalendarIdentity,
  CalendarInput,
  CalendarOptions,
  NormalizedCalendarEvent,
} from "./types";
import { scalarText } from "./text";

interface DateParts {
  year: number;
  month: number;
  day: number;
}
interface DateTimeParts extends DateParts {
  hour: number;
  minute: number;
  second: number;
}
interface ParsedDateTime {
  isUtc: boolean;
  serial: number;
  parts: DateTimeParts;
  value: string;
}

export function parseBoolean(value: unknown, fallback?: boolean) {
  if (value === null || typeof value === "undefined") return Boolean(fallback);
  if (typeof value === "boolean") return value;

  let normalized = scalarText(value).trim().toLowerCase();
  if (normalized === "" && fallback === true) return true;
  if (["true", "1", "yes", "on"].indexOf(normalized) !== -1) return true;
  if (["false", "0", "no", "off"].indexOf(normalized) !== -1) return false;
  return Boolean(fallback);
}

export function slug(value: unknown, fallback: string) {
  let input = scalarText(value || "");
  let normalized = (typeof input.normalize === "function" ? input.normalize("NFKD") : input)
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return normalized || fallback;
}

export function utf8ByteLength(value: unknown) {
  let length = 0;

  for (let character of scalarText(value)) {
    let point = character.codePointAt(0) ?? 0;
    if (point <= 0x7f) length += 1;
    else if (point <= 0x7ff) length += 2;
    else if (point <= 0xffff) length += 3;
    else length += 4;
  }

  return length;
}

export function foldICalLine(line: unknown) {
  let parts = [];
  let current = "";
  let currentBytes = 0;
  let byteLimit = 75;

  for (let character of String(line)) {
    let characterBytes = utf8ByteLength(character);

    if (current && currentBytes + characterBytes > byteLimit) {
      parts.push(current);
      current = character;
      currentBytes = characterBytes;
      byteLimit = 74;
    } else {
      current += character;
      currentBytes += characterBytes;
    }
  }

  parts.push(current);
  return parts.join("\r\n ");
}

export function escapeICalText(value: unknown) {
  return scalarText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function pad(number: number, width = 2) {
  return String(number).padStart(width || 2, "0");
}

function daysInMonth(year: number, month: number) {
  if (month === 2) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  return [4, 6, 9, 11].indexOf(month) !== -1 ? 30 : 31;
}

function validDateParts(year: number, month: number, day: number) {
  return (
    Number.isInteger(year) &&
    year >= 1 &&
    year <= 9999 &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12 &&
    Number.isInteger(day) &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

export function parseDateOnly(value: unknown) {
  let match = scalarText(value || "")
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  let parts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    iso: "",
    value: "",
    serial: 0,
  };

  if (!validDateParts(parts.year, parts.month, parts.day)) return null;
  parts.iso = pad(parts.year, 4) + "-" + pad(parts.month) + "-" + pad(parts.day);
  parts.value = pad(parts.year, 4) + pad(parts.month) + pad(parts.day);
  parts.serial = Date.UTC(parts.year, parts.month - 1, parts.day);
  return parts;
}

export function parseDisplayDate(value: unknown) {
  let match = scalarText(value || "")
    .trim()
    .match(
      /^(?:[A-Za-z]+,\s*)?(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})$/i,
    );
  if (!match) return null;

  let monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  let month = monthNames.indexOf(match[1].toLowerCase()) + 1;
  return parseDateOnly(match[3] + "-" + pad(month) + "-" + pad(Number(match[2])));
}

function addDays(parts: DateParts, amount: number) {
  let date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + amount));
  return parseDateOnly(
    pad(date.getUTCFullYear(), 4) +
      "-" +
      pad(date.getUTCMonth() + 1) +
      "-" +
      pad(date.getUTCDate()),
  );
}

function utcPartsFromMilliseconds(milliseconds: number) {
  let date = new Date(milliseconds);
  if (!Number.isFinite(date.getTime())) return null;

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  };
}

function formatDateTimeParts(parts: DateTimeParts, isUtc: boolean) {
  return (
    pad(parts.year, 4) +
    pad(parts.month) +
    pad(parts.day) +
    "T" +
    pad(parts.hour) +
    pad(parts.minute) +
    pad(parts.second) +
    (isUtc ? "Z" : "")
  );
}

function parseDateTime(value: unknown) {
  let match = scalarText(value || "")
    .trim()
    .match(
      /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(?:\s*(Z|[+-]\d{2}:?\d{2}))?$/i,
    );

  if (!match) return null;

  let parts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] || 0),
  };
  let zone = String(match[7] || "").toUpperCase();

  if (
    !validDateParts(parts.year, parts.month, parts.day) ||
    parts.hour > 23 ||
    parts.minute > 59 ||
    parts.second > 59
  ) {
    return null;
  }

  let serial = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  let isUtc = Boolean(zone);

  if (zone && zone !== "Z") {
    let zoneMatch = zone.match(/^([+-])(\d{2}):?(\d{2})$/);
    let zoneHours = zoneMatch ? Number(zoneMatch[2]) : 99;
    let zoneMinutes = zoneMatch ? Number(zoneMatch[3]) : 99;
    if (!zoneMatch || zoneHours > 23 || zoneMinutes > 59) return null;
    let offset = (zoneHours * 60 + zoneMinutes) * 60 * 1000;
    serial += zoneMatch[1] === "+" ? -offset : offset;
    const utcParts = utcPartsFromMilliseconds(serial);
    if (!utcParts) return null;
    parts = utcParts;
  }

  return {
    isUtc: isUtc,
    serial: serial,
    parts: parts,
    value: formatDateTimeParts(parts, isUtc),
  };
}

function addHour(dateTime: ParsedDateTime) {
  let parts = utcPartsFromMilliseconds(dateTime.serial + 60 * 60 * 1000);
  if (!parts) throw new TypeError("Calendar end time is out of range.");
  return {
    isUtc: dateTime.isUtc,
    serial: dateTime.serial + 60 * 60 * 1000,
    parts: parts,
    value: formatDateTimeParts(parts, dateTime.isUtc),
  };
}

function harmonizeEnd(start: ParsedDateTime, end: ParsedDateTime | null) {
  if (!end) return addHour(start);
  if (start.isUtc === end.isUtc) return end.serial > start.serial ? end : addHour(start);

  let adjusted = {
    isUtc: start.isUtc,
    serial: end.serial,
    parts: end.parts,
    value: formatDateTimeParts(end.parts, start.isUtc),
  };
  return adjusted.serial > start.serial ? adjusted : addHour(start);
}

function hashString(value: unknown) {
  let hash = 0x811c9dc5;
  let bytes = [];

  for (let character of scalarText(value)) {
    let point = character.codePointAt(0) ?? 0;
    if (point <= 0x7f) {
      bytes.push(point);
    } else if (point <= 0x7ff) {
      bytes.push(0xc0 | (point >> 6), 0x80 | (point & 0x3f));
    } else if (point <= 0xffff) {
      bytes.push(0xe0 | (point >> 12), 0x80 | ((point >> 6) & 0x3f), 0x80 | (point & 0x3f));
    } else {
      bytes.push(
        0xf0 | (point >> 18),
        0x80 | ((point >> 12) & 0x3f),
        0x80 | ((point >> 6) & 0x3f),
        0x80 | (point & 0x3f),
      );
    }
  }

  bytes.forEach(function (byte) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  });

  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function stableUid(event: CalendarIdentity) {
  let identity = [
    event.context || "",
    event.eventId || "",
    event.title,
    event.startValue,
    event.endValue,
    event.allDay ? "all-day" : "timed",
    event.location,
    event.description,
  ].join("\u001f");
  let reverseIdentity = Array.from(identity).reverse().join("");
  return "kbyg-" + hashString(identity) + hashString(reverseIdentity) + "@ipmievents.com";
}

export function normalizeCalendarEvent(input?: CalendarInput | null) {
  let raw = input || {};
  let title = scalarText(raw.title || raw.summary || "IPMI Event").trim() || "IPMI Event";
  let startRaw = scalarText(raw.start || raw.startDate || "").trim();
  let inferredAllDay = /^\d{4}-\d{2}-\d{2}$/.test(startRaw);
  let allDay = parseBoolean(raw.allDay, inferredAllDay);
  let normalized: NormalizedCalendarEvent = {
    startValue: "",
    endValue: "",
    uid: "",
    context: scalarText(raw.context || "")
      .replace(/[\r\n\u2028\u2029]+/g, "")
      .trim(),
    eventId: scalarText(raw.eventId || raw.id || "")
      .replace(/[\r\n\u2028\u2029]+/g, "")
      .trim(),
    title: title,
    description: scalarText(raw.description || "").trim(),
    location: scalarText(raw.location || "").trim(),
    url: scalarText(raw.url || "").trim(),
    allDay: allDay,
    filename: scalarText(raw.filename || "").trim(),
  };

  if (allDay) {
    let startDate = parseDateOnly(startRaw);
    if (!startDate) throw new TypeError("A valid calendar start date is required.");

    let endDate = parseDateOnly(raw.end || raw.endDate);
    if (!endDate || endDate.serial < startDate.serial) endDate = startDate;
    endDate = addDays(endDate, 1);
    if (!endDate) throw new TypeError("Calendar end date is out of range.");
    normalized.startValue = startDate.value;
    normalized.endValue = endDate.value;
  } else {
    let startDateTime = parseDateTime(startRaw);
    if (!startDateTime) throw new TypeError("A valid ISO-8601 calendar start time is required.");

    let endDateTime = harmonizeEnd(startDateTime, parseDateTime(raw.end || raw.endDate));
    normalized.startValue = startDateTime.value;
    normalized.endValue = endDateTime.value;
    normalized.utc = startDateTime.isUtc;
  }

  normalized.uid =
    scalarText(raw.uid || "")
      .replace(/[\r\n]/g, "")
      .trim() || stableUid(normalized);
  normalized.filename =
    slug(normalized.filename.replace(/\.ics$/i, "") || title, "ipmi-event") + ".ics";
  return normalized;
}

function formatUtcDate(date?: Date | string | number) {
  let value = date instanceof Date ? date : date === undefined ? new Date() : new Date(date);
  if (!Number.isFinite(value.getTime())) value = new Date();

  return formatDateTimeParts(
    {
      year: value.getUTCFullYear(),
      month: value.getUTCMonth() + 1,
      day: value.getUTCDate(),
      hour: value.getUTCHours(),
      minute: value.getUTCMinutes(),
      second: value.getUTCSeconds(),
    },
    true,
  );
}

export function createICalendar(
  input: CalendarInput | NormalizedCalendarEvent,
  options?: CalendarOptions,
) {
  let event =
    input && "startValue" in input && input.startValue && input.endValue && input.uid
      ? input
      : normalizeCalendarEvent(input);
  let lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IPMI//Know Before You Go//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + escapeICalText(event.uid),
    "DTSTAMP:" + formatUtcDate(options && options.now),
  ];

  if (event.allDay) {
    lines.push("DTSTART;VALUE=DATE:" + event.startValue);
    lines.push("DTEND;VALUE=DATE:" + event.endValue);
  } else {
    lines.push("DTSTART:" + event.startValue);
    lines.push("DTEND:" + event.endValue);
  }

  lines.push("SUMMARY:" + escapeICalText(event.title));
  if (event.description) lines.push("DESCRIPTION:" + escapeICalText(event.description));
  if (event.location) lines.push("LOCATION:" + escapeICalText(event.location));
  if (event.url) lines.push("URL:" + event.url.replace(/[\r\n\u2028\u2029]+/g, ""));
  lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");

  return lines.map(foldICalLine).join("\r\n") + "\r\n";
}
