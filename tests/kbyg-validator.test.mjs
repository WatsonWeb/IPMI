import { readFileSync } from "node:fs";

import { describe, expect, it } from "vite-plus/test";

import { validateKbygModel } from "../scripts/kbyg-validator.mjs";

const fixture = JSON.parse(
  readFileSync(new URL("./fixtures/kbyg-cms-model.json", import.meta.url), "utf8"),
);
const validModel = () => structuredClone(fixture);
const errorsFor = (model) => validateKbygModel(model).join("\n");

describe("validateKbygModel", () => {
  it("accepts the exact staged two-page, 33-block Webflow model", () => {
    const model = validModel();

    expect(model.pages.map(({ id }) => id)).toEqual([
      "6a9a6378aaffd3efb5e46336",
      "6a9a6378aaffd3efb5e46338",
    ]);
    expect(model.institutes.map(({ id }) => id)).toEqual(["68b0aff93e4f6363f03f620b"]);
    expect(model.staff.map(({ id }) => id)).toEqual(["6392772fccd80e4fbe026044"]);
    expect(model.blocks).toHaveLength(33);
    expect(new Set(model.blocks.map(({ id }) => id)).size).toBe(33);
    expect(validateKbygModel(model)).toEqual([]);
  });

  it("requires exactly one delegate and sponsor page per Institute and matching slug suffixes", () => {
    const missingSponsor = validModel();
    missingSponsor.pages.pop();
    expect(errorsFor(missingSponsor)).toContain(
      "Institute 68b0aff93e4f6363f03f620b is missing its sponsor page.",
    );

    const duplicateDelegate = validModel();
    duplicateDelegate.pages.push({ ...duplicateDelegate.pages[0], id: "duplicate-delegate" });
    expect(errorsFor(duplicateDelegate)).toContain(
      "Duplicate delegate page for Institute 68b0aff93e4f6363f03f620b.",
    );

    const wrongSlug = validModel();
    wrongSlug.pages[0].slug = "hchr-sept-2026-attendee";
    expect(errorsFor(wrongSlug)).toContain(
      "Page 6a9a6378aaffd3efb5e46336 slug must end with -delegate.",
    );
  });

  it("rejects duplicate references, incorrect block types, audience leakage, and cross-Institute blocks", () => {
    const model = validModel();
    model.pages[0].preparation.push(model.pages[0].preparation[0]);
    model.pages[1].keyDates[0] = model.pages[0].keyDates[0];
    model.pages[0].keyDates[1] = model.pages[0].agendaDays[0];
    model.blocks.find(({ id }) => id === model.pages[0].agendaDays[1]).institute = "another-event";

    const errors = errorsFor(model);
    expect(errors).toContain("references block 6a9a61608591545695d9c51c more than once");
    expect(errors).toContain("expected key-date");
    expect(errors).toContain("(sponsor) references delegate block");
    expect(errors).toContain("references block 6a9a61f4a74bfa192a4f876c from another Institute");
  });

  it("validates all-day calendar starts and ends as strict, real ISO dates on the same day", () => {
    const model = validModel();
    const dates = model.blocks.filter(({ blockType }) => blockType === "key-date");
    dates[0].calendarStart = "2026-02-30T00:00:00.000Z";
    dates[1].calendarEnd = "2026-08-20T00:00:00.000Z";
    delete dates[2].allDay;

    const errors = errorsFor(model);
    expect(errors).toContain("has an invalid calendarStart");
    expect(errors).toContain("is all-day but spans more than one calendar day");
    expect(errors).toContain("must define allDay as a boolean");
  });

  it("requires non-empty preparation, key-date, agenda, and experience references", () => {
    const model = validModel();
    model.pages[0].preparation = [];
    model.pages[0].keyDates = [];
    model.pages[0].agendaDays = [];
    model.pages[0].experience = [];

    const errors = errorsFor(model);
    expect(errors).toContain("field preparation must reference at least one block");
    expect(errors).toContain("field keyDates must reference at least one block");
    expect(errors).toContain("field agendaDays must reference at least one block");
    expect(errors).toContain("field experience must reference at least one block");
  });

  it("allows at most one expanded delegate FAQ and forbids sponsor FAQ references", () => {
    const model = validModel();
    model.blocks.find(({ id }) => id === model.pages[0].faqs[1]).initiallyExpanded = true;
    model.pages[1].faqs.push(model.pages[0].faqs[0]);

    const errors = errorsFor(model);
    expect(errors).toContain(
      "Page 6a9a6378aaffd3efb5e46336 has more than one initially expanded FAQ.",
    );
    expect(errors).toContain("Page 6a9a6378aaffd3efb5e46338 (sponsor) must not reference FAQs.");

    const missingDelegateFaqs = validModel();
    missingDelegateFaqs.pages[0].faqs = [];
    expect(errorsFor(missingDelegateFaqs)).toContain(
      "Page 6a9a6378aaffd3efb5e46336 (delegate) must reference at least one FAQ.",
    );
  });

  it("requires references, accessible images, alt text, and audience-specific core copy", () => {
    const model = validModel();
    delete model.pages[0].operationsLead;
    model.pages[0].heroImageAlt = "";
    model.pages[0].hubImage = { fileId: "asset-without-url" };
    model.pages[0].heroIntro = "";
    model.pages[0].heroCtaUrl = "javascript:alert(1)";
    model.pages[0].agendaUrl = "javascript:alert(1)";
    model.pages[0].hubUrl = "";
    model.pages[0].reservationUrl = "ftp://example.com/reserve";
    model.pages[1].supportBody = "";
    model.pages[1].supportUrl = "mailto:not-an-email";

    const errors = errorsFor(model);
    expect(errors).toContain("is missing operationsLead");
    expect(errors).toContain("is missing heroImageAlt");
    expect(errors).toContain("has an invalid hubImage");
    expect(errors).toContain("is missing heroIntro");
    expect(errors).toContain("has an invalid heroCtaUrl");
    expect(errors).toContain("has an invalid agendaUrl");
    expect(errors).toContain("has an invalid hubUrl");
    expect(errors).toContain("has an invalid reservationUrl");
    expect(errors).toContain("is missing supportBody");
    expect(errors).toContain("has an invalid supportUrl");
  });

  it("validates referenced Institute and Staff records and their shared KBYG fields", () => {
    const model = validModel();
    const institute = model.institutes[0];
    const operationsLead = model.staff[0];

    delete institute.venue;
    institute.startDate = "2026-09-31T00:00:00.000Z";
    institute.venueGallery = [];
    institute.kbygReservationUrl = "javascript:alert(1)";
    operationsLead.email = "not-an-email";
    operationsLead.phone = "call me";
    operationsLead.profilePhoto = { fileId: "asset-without-url" };
    model.pages[0].operationsLead = "missing-staff-id";

    const errors = errorsFor(model);
    expect(errors).toContain("is missing venue");
    expect(errors).toContain("has an invalid startDate");
    expect(errors).toContain("must define a non-empty venueGallery of valid images");
    expect(errors).toContain("has an invalid kbygReservationUrl");
    expect(errors).toContain("has an invalid email");
    expect(errors).toContain("has an invalid phone");
    expect(errors).toContain("has an invalid profilePhoto");
    expect(errors).toContain("references missing Staff member missing-staff-id");

    const missingSharedRecords = validModel();
    delete missingSharedRecords.institutes;
    delete missingSharedRecords.staff;
    expect(errorsFor(missingSharedRecords)).toContain("Model must contain Institute records");
    expect(errorsFor(missingSharedRecords)).toContain("Model must contain Staff records");
  });

  it("requires an actual Webflow image and rejects missing block content", () => {
    const model = validModel();
    const preparation = model.blocks.find(({ blockType }) => blockType === "preparation");
    preparation.icon = {
      fileId: "webflow-asset-id",
      url: "https://cdn.prod.website-files.com/site/kbyg-travel.svg",
    };
    expect(validateKbygModel(model)).toEqual([]);

    delete preparation.icon;
    preparation.body = "";
    const errors = errorsFor(model);
    expect(errors).toContain("is missing a valid Webflow icon image");
    expect(errors).toContain("is missing body");
  });
});
