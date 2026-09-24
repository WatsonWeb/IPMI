export interface CmsRecord {
  [field: string]: unknown;
}

const isRecord = (value: unknown): value is CmsRecord =>
  value !== null && typeof value === "object" && !isUnknownArray(value);
const isUnknownArray = (value: unknown): value is unknown[] => Array.isArray(value);

const AUDIENCES = new Set(["delegate", "sponsor"]);
const SCOPES = new Set(["shared", ...AUDIENCES]);
const HERO_CTA_TARGETS = new Set([
  "#welcome",
  "#prepare",
  "#key-dates",
  "#agenda",
  "#hub",
  "#hotel-travel",
  "#experience",
  "#faq",
  "#sponsor-support",
  "#contact",
]);

export const BLOCK_LISTS = {
  preparation: "preparation",
  keyDates: "key-date",
  agendaDays: "agenda-day",
  experience: "experience",
  faqs: "faq",
};

const BLOCK_REQUIRED: Record<string, readonly string[]> = {
  preparation: ["title", "body", "icon"],
  "key-date": ["title", "calendarStart", "calendarEnd", "allDay"],
  "agenda-day": ["title", "body"],
  experience: ["title", "body", "icon"],
  faq: ["title", "body"],
};

const PAGE_CORE_COPY = [
  "heroEyebrow",
  "heroIntro",
  "heroCtaLabel",
  "heroCtaUrl",
  "welcomeEyebrow",
  "welcomeTitle",
  "welcomeIntro",
  "welcomeBody",
  "preparationEyebrow",
  "preparationTitle",
  "preparationIntro",
  "keyDatesEyebrow",
  "keyDatesTitle",
  "keyDatesIntro",
  "agendaEyebrow",
  "agendaTitle",
  "agendaIntro",
  "agendaCtaLabel",
  "hubEyebrow",
  "hubTitle",
  "hubBody",
  "hubCtaLabel",
  "hotelEyebrow",
  "hotelTitle",
  "experienceEyebrow",
  "experienceTitle",
  "experienceIntro",
  "contactEyebrow",
  "contactTitle",
  "contactIntro",
];

const SPONSOR_SUPPORT_COPY = ["supportEyebrow", "supportTitle", "supportBody", "supportCtaLabel"];

const INSTITUTE_TEXT_FIELDS = {
  title: ["title", "name", "label"],
  titleNoYear: ["titleNoYear", "title-no-year"],
  venue: ["venue", "venueCityState", "venue-city-state"],
  address: ["address"],
  accentColor: ["accentColor", "accent-color"],
  darkColor: ["darkColor", "dark-color"],
  mapQuery: ["mapQuery", "map-query"],
  kbygHotelIntro: ["kbygHotelIntro", "kbyg-hotel-intro"],
  kbygReservationDetails: ["kbygReservationDetails", "kbyg-reservation-details"],
  kbygTransportationDetails: ["kbygTransportationDetails", "kbyg-transportation-details"],
};

const STAFF_TEXT_FIELDS = {
  fullName: ["fullName", "full-name", "name"],
  jobTitle: ["jobTitle", "job-title"],
};

const kebabCase = (value: string): string =>
  value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const fieldValue = (record: unknown, ...keys: string[]): unknown => {
  if (!isRecord(record)) return undefined;
  for (const source of [record, record?.fieldData]) {
    for (const key of keys) {
      const value = isRecord(source) ? source[key] : undefined;
      if (value != null && value !== "") return value;
    }
  }
  return undefined;
};

const idOf = (record: unknown): string | undefined => {
  const value = fieldValue(record, "id", "_id", "itemId");
  return hasText(value) ? value : undefined;
};
const referenceId = (value: unknown): string | undefined => {
  if (hasText(value)) return value.trim();
  if (value != null && typeof value === "object") return idOf(value);
  return undefined;
};
const instituteOf = (record: unknown) =>
  referenceId(fieldValue(record, "institute", "instituteId", "institute-reference"));
const operationsLeadOf = (record: unknown) =>
  referenceId(fieldValue(record, "operationsLead", "operations-lead"));
const audienceOf = (record: unknown): string => {
  const value = fieldValue(record, "audience", "audienceScope", "audience-scope");
  return typeof value === "string" ? value.toLowerCase() : "";
};
const blockTypeOf = (record: unknown): string => {
  const value = fieldValue(record, "blockType", "block-type");
  return typeof value === "string" ? value.toLowerCase().replaceAll(" ", "-") : "";
};

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function hasField(record: unknown, key: string): boolean {
  const aliases: Record<string, string[]> = {
    allDay: ["allDay", "all-day"],
    body: ["body"],
    calendarEnd: ["calendarEnd", "calendar-end"],
    calendarStart: ["calendarStart", "calendar-start"],
    title: ["title"],
  };
  const value = fieldValue(record, ...(aliases[key] ?? [key]));
  if (key === "allDay") return value === true || value === false;
  return hasText(value);
}

function isValidUrl(value: unknown): boolean {
  if (!hasText(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isValidLink(value: unknown): boolean {
  if (!hasText(value)) return false;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return true;
    return url.protocol === "mailto:" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url.pathname);
  } catch {
    return false;
  }
}

function isValidEmail(value: unknown): boolean {
  return hasText(value) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim());
}

function isValidPhone(value: unknown): boolean {
  if (!hasText(value) || !/^\+?[\d().\-\s]+(?:\s*(?:x|ext\.?)\s*\d+)?$/i.test(value.trim())) {
    return false;
  }
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

function isValidHeroCtaUrl(value: unknown): boolean {
  return hasText(value) && HERO_CTA_TARGETS.has(value.trim());
}

function isValidImage(value: unknown): boolean {
  if (isValidUrl(value)) return true;
  return (
    value != null &&
    typeof value === "object" &&
    hasText(fieldValue(value, "fileId", "id")) &&
    isValidUrl(fieldValue(value, "url", "hostedUrl"))
  );
}

function isValidIcon(record: unknown): boolean {
  const icon = fieldValue(record, "icon");
  return isValidImage(icon) || isValidUrl(icon);
}

function isValidReference(value: unknown): boolean {
  return hasText(value) || (value != null && typeof value === "object" && hasText(idOf(value)));
}

function parseDate(value: unknown): Date | null {
  if (!hasText(value)) return null;
  const match =
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2}))?$/.exec(
      value,
    );
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, , zone] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year < 1 || month < 1 || month > 12) return null;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) return null;

  if (hourText != null) {
    const hour = Number(hourText);
    const minute = Number(minuteText);
    const second = Number(secondText);
    if (hour > 23 || minute > 59 || second > 59) return null;
    if (zone && zone !== "Z") {
      const zoneHour = Number(zone.slice(1, 3));
      const zoneMinute = Number(zone.slice(4, 6));
      if (zoneHour > 14 || zoneMinute > 59 || (zoneHour === 14 && zoneMinute !== 0)) return null;
    }
  }

  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function referenceList(page: unknown, listName: string): unknown {
  return fieldValue(page, listName, kebabCase(listName));
}

function buildRecordMap(
  errors: string[],
  records: unknown[],
  recordName: string,
): Map<string, unknown> {
  const recordsById = new Map<string, unknown>();
  for (const [index, record] of records.entries()) {
    const id = idOf(record);
    const label = id || `${recordName.toLowerCase()}[${index}]`;
    if (!id) {
      errors.push(`${recordName} ${label} is missing id.`);
    } else if (recordsById.has(id)) {
      errors.push(`Duplicate ${recordName.toLowerCase()} id: ${id}.`);
    } else {
      recordsById.set(id, record);
    }
  }
  return recordsById;
}

function validateInstitute(errors: string[], institute: unknown, label: string): void {
  for (const [field, aliases] of Object.entries(INSTITUTE_TEXT_FIELDS)) {
    if (!hasText(fieldValue(institute, ...aliases))) {
      errors.push(`Institute ${label} is missing ${field}.`);
    }
  }

  const startValue = fieldValue(institute, "startDate", "start-date");
  const endValue = fieldValue(institute, "endDate", "end-date");
  const start = parseDate(startValue);
  const end = parseDate(endValue);
  if (!start) errors.push(`Institute ${label} has an invalid startDate.`);
  if (!end) errors.push(`Institute ${label} has an invalid endDate.`);
  if (start && end && end < start) errors.push(`Institute ${label} ends before it starts.`);

  const thumbnail = fieldValue(institute, "thumbnail", "thumbnailImage", "thumbnail-image");
  if (!isValidImage(thumbnail)) errors.push(`Institute ${label} has an invalid thumbnail.`);

  const gallery = fieldValue(
    institute,
    "venueGallery",
    "venue-gallery",
    "venueThumbnails",
    "venue-thumbnails",
  );
  if (
    !isUnknownArray(gallery) ||
    gallery.length === 0 ||
    gallery.some((image) => !isValidImage(image))
  ) {
    errors.push(`Institute ${label} must define a non-empty venueGallery of valid images.`);
  }

  const agendaUrl = fieldValue(institute, "agendaUrl", "agenda-url");
  if (!isValidUrl(agendaUrl)) errors.push(`Institute ${label} has an invalid agendaUrl.`);

  const reservationUrl = fieldValue(institute, "kbygReservationUrl", "kbyg-reservation-url");
  if (!isValidLink(reservationUrl)) {
    errors.push(`Institute ${label} has an invalid kbygReservationUrl.`);
  }
}

function validateStaff(errors: string[], staff: unknown, label: string): void {
  for (const [field, aliases] of Object.entries(STAFF_TEXT_FIELDS)) {
    if (!hasText(fieldValue(staff, ...aliases))) errors.push(`Staff ${label} is missing ${field}.`);
  }

  const email = fieldValue(staff, "email");
  if (!isValidEmail(email)) errors.push(`Staff ${label} has an invalid email.`);

  const phone = fieldValue(staff, "phone");
  if (!isValidPhone(phone)) errors.push(`Staff ${label} has an invalid phone.`);

  const profilePhoto = fieldValue(staff, "profilePhoto", "profile-photo", "photo");
  if (!isValidImage(profilePhoto)) errors.push(`Staff ${label} has an invalid profilePhoto.`);
}

function requirePageFields(
  errors: string[],
  page: unknown,
  pageId: string,
  audience: string,
): void {
  const operationsLead = fieldValue(page, "operationsLead", "operations-lead");
  if (!isValidReference(operationsLead)) errors.push(`Page ${pageId} is missing operationsLead.`);

  for (const imageName of ["heroImage", "hubImage"]) {
    const image = fieldValue(page, imageName, kebabCase(imageName));
    if (!isValidImage(image)) errors.push(`Page ${pageId} has an invalid ${imageName}.`);

    const altName = `${imageName}Alt`;
    const alt = fieldValue(page, altName, kebabCase(altName));
    if (!hasText(alt)) errors.push(`Page ${pageId} is missing ${altName}.`);
  }

  const requiredCopy = [...PAGE_CORE_COPY, ...(audience === "sponsor" ? SPONSOR_SUPPORT_COPY : [])];
  for (const field of requiredCopy) {
    const value = fieldValue(page, field, kebabCase(field));
    if (!hasText(value)) errors.push(`Page ${pageId} is missing ${field}.`);
  }

  const heroCtaUrl = fieldValue(page, "heroCtaUrl", "hero-cta-url");
  if (hasText(heroCtaUrl) && !isValidHeroCtaUrl(heroCtaUrl)) {
    errors.push(`Page ${pageId} has an invalid heroCtaUrl.`);
  }

  const requiredLinks = [
    "agendaUrl",
    "hubUrl",
    "reservationUrl",
    ...(audience === "sponsor" ? ["supportUrl"] : []),
  ];
  for (const field of requiredLinks) {
    const value = fieldValue(page, field, kebabCase(field));
    if (!isValidLink(value)) errors.push(`Page ${pageId} has an invalid ${field}.`);
  }
}

function validateKeyDate(errors: string[], block: unknown, label: string): void {
  const start = parseDate(fieldValue(block, "calendarStart", "calendar-start"));
  const end = parseDate(fieldValue(block, "calendarEnd", "calendar-end"));
  const allDay = fieldValue(block, "allDay", "all-day");

  if (!start) errors.push(`Block ${label} (key-date) has an invalid calendarStart.`);
  if (!end) errors.push(`Block ${label} (key-date) has an invalid calendarEnd.`);
  if (allDay !== true && allDay !== false) {
    errors.push(`Block ${label} (key-date) must define allDay as a boolean.`);
  }
  if (!start || !end) return;

  if (end < start) errors.push(`Block ${label} (key-date) ends before it starts.`);
  if (allDay === true && start.toISOString().slice(0, 10) !== end.toISOString().slice(0, 10)) {
    errors.push(`Block ${label} (key-date) is all-day but spans more than one calendar day.`);
  }
}

export function validateKbygModel(model: unknown = {}): string[] {
  const data = isRecord(model) ? model : {};
  const errors: string[] = [];
  const pages = data.pages ?? [];
  const blocks = data.blocks ?? [];
  const institutes = data.institutes ?? [];
  const staff = data.staff ?? [];
  const blocksById = new Map<string | undefined, unknown>();
  const referencedInstitutes = new Set<string>();

  if (!isUnknownArray(pages) || pages.length === 0) errors.push("Model must contain KBYG pages.");
  if (!isUnknownArray(blocks) || blocks.length === 0)
    errors.push("Model must contain KBYG blocks.");
  if (!isUnknownArray(institutes) || institutes.length === 0) {
    errors.push("Model must contain Institute records.");
  }
  if (!isUnknownArray(staff) || staff.length === 0)
    errors.push("Model must contain Staff records.");
  if (
    !isUnknownArray(pages) ||
    !isUnknownArray(blocks) ||
    !isUnknownArray(institutes) ||
    !isUnknownArray(staff)
  ) {
    return errors;
  }

  const institutesById = buildRecordMap(errors, institutes, "Institute");
  const staffById = buildRecordMap(errors, staff, "Staff");
  for (const [index, institute] of institutes.entries()) {
    validateInstitute(errors, institute, idOf(institute) || `institute[${index}]`);
  }
  for (const [index, person] of staff.entries()) {
    validateStaff(errors, person, idOf(person) || `staff[${index}]`);
  }

  for (const [index, block] of blocks.entries()) {
    const id = idOf(block);
    const type = blockTypeOf(block);
    const scope = audienceOf(block);
    const institute = instituteOf(block);
    const label = id || `blocks[${index}]`;

    if (!id) errors.push(`Block ${label} is missing id.`);
    else if (blocksById.has(id)) errors.push(`Duplicate block id: ${id}.`);
    else blocksById.set(id, block);

    if (!institute) errors.push(`Block ${label} is missing Institute.`);
    else {
      referencedInstitutes.add(institute);
      if (!institutesById.has(institute)) {
        errors.push(`Block ${label} references missing Institute ${institute}.`);
      }
    }
    if (!SCOPES.has(scope)) {
      errors.push(`Block ${label} has invalid Audience Scope: ${scope || "(missing)"}.`);
    }
    if (!BLOCK_REQUIRED[type]) {
      errors.push(`Block ${label} has invalid Block Type: ${type || "(missing)"}.`);
    } else {
      for (const field of BLOCK_REQUIRED[type]) {
        const valid = field === "icon" ? isValidIcon(block) : hasField(block, field);
        if (!valid) {
          const suffix = field === "icon" ? "a valid Webflow icon image" : field;
          errors.push(`Block ${label} (${type}) is missing ${suffix}.`);
        }
      }
    }

    if (type === "key-date") validateKeyDate(errors, block, label);
  }

  const pageCounts = new Map<string, number>();

  for (const [index, page] of pages.entries()) {
    const id = idOf(page) || `pages[${index}]`;
    const institute = instituteOf(page);
    const audience = audienceOf(page);
    const slug = fieldValue(page, "slug");

    if (!institute) errors.push(`Page ${id} is missing Institute.`);
    else {
      referencedInstitutes.add(institute);
      if (!institutesById.has(institute)) {
        errors.push(`Page ${id} references missing Institute ${institute}.`);
      }
    }
    if (!AUDIENCES.has(audience)) {
      errors.push(`Page ${id} has invalid Audience: ${audience || "(missing)"}.`);
    }
    if (!hasText(slug)) {
      errors.push(`Page ${id} is missing slug.`);
    } else if (AUDIENCES.has(audience) && !slug.endsWith(`-${audience}`)) {
      errors.push(`Page ${id} slug must end with -${audience}.`);
    }

    if (institute && AUDIENCES.has(audience)) {
      const key = `${institute}:${audience}`;
      const count = (pageCounts.get(key) ?? 0) + 1;
      pageCounts.set(key, count);
      if (count > 1) errors.push(`Duplicate ${audience} page for Institute ${institute}.`);
    }

    requirePageFields(errors, page, id, audience);
    const operationsLead = operationsLeadOf(page);
    if (operationsLead && !staffById.has(operationsLead)) {
      errors.push(`Page ${id} references missing Staff member ${operationsLead}.`);
    }

    const pageReferences = new Map<string, string>();
    let faqReferences: unknown[] = [];

    for (const [listName, expectedType] of Object.entries(BLOCK_LISTS)) {
      const references = referenceList(page, listName);
      if (!isUnknownArray(references)) {
        errors.push(`Page ${id} field ${listName} must be an ordered array.`);
        continue;
      }
      if (listName !== "faqs" && references.length === 0) {
        errors.push(`Page ${id} field ${listName} must reference at least one block.`);
      }
      if (listName === "faqs") faqReferences = references;

      for (const reference of references) {
        const blockId = typeof reference === "string" ? reference : idOf(reference);
        if (blockId && pageReferences.has(blockId)) {
          errors.push(
            `Page ${id} references block ${blockId} more than once (${pageReferences.get(blockId)} and ${listName}).`,
          );
        } else if (blockId) {
          pageReferences.set(blockId, listName);
        }

        const block = blocksById.get(blockId);
        if (!block) {
          errors.push(
            `Page ${id} field ${listName} references missing block ${blockId || "(missing id)"}.`,
          );
          continue;
        }
        if (blockTypeOf(block) !== expectedType) {
          errors.push(
            `Page ${id} field ${listName} references ${blockId} with type ${blockTypeOf(block)}; expected ${expectedType}.`,
          );
        }
        if (instituteOf(block) !== institute) {
          errors.push(`Page ${id} references block ${blockId} from another Institute.`);
        }
        const scope = audienceOf(block);
        if (scope !== "shared" && scope !== audience) {
          errors.push(
            `Page ${id} (${audience}) references ${scope || "unscoped"} block ${blockId}.`,
          );
        }
      }
    }

    if (audience === "delegate" && faqReferences.length === 0) {
      errors.push(`Page ${id} (delegate) must reference at least one FAQ.`);
    }
    if (audience === "sponsor" && faqReferences.length > 0) {
      errors.push(`Page ${id} (sponsor) must not reference FAQs.`);
    }

    const expandedFaqs = faqReferences.filter((reference) => {
      const blockId = typeof reference === "string" ? reference : idOf(reference);
      return (
        fieldValue(blocksById.get(blockId), "initiallyExpanded", "initially-expanded") === true
      );
    });
    if (expandedFaqs.length > 1) {
      errors.push(`Page ${id} has more than one initially expanded FAQ.`);
    }
  }

  for (const institute of referencedInstitutes) {
    for (const audience of AUDIENCES) {
      if ((pageCounts.get(`${institute}:${audience}`) ?? 0) === 0) {
        errors.push(`Institute ${institute} is missing its ${audience} page.`);
      }
    }
  }

  return errors;
}

export function assertValidKbygModel<T>(model: T): T {
  const errors = validateKbygModel(model);
  if (errors.length) throw new Error(`KBYG validation failed:\n- ${errors.join("\n- ")}`);
  return model;
}
