# 25 — KBYG sponsor and delegate page coverage

[Back to master](README.md)

- **Owner:** Bryan / Webflow CMS implementation; IPMI Operations confirms event coverage and supplies audience-specific content.
- **Status:** Documented; four existing CMS records verified in Chrome. Expansion is blocked on the approved remaining event/audience inventory and content; no pages were created in this documentation pass.
- **Sources:** [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), KBYG sponsor/delegate request; [KBYG example folder](https://ipmionline.sharepoint.com/:f:/s/IPMIExternal/IgDMJTaH9TtpSKYjyVlP6hzHATZ9JieE2KQImFfNSV6rGhc?e=xLcQz9).
- **Depends on:** [36 — Operations content and event coverage](36-kbyg-operations-content.md). Coordinate shared agenda presentation with [26](26-kbyg-agenda-links.md) and confirmed MeetMax destinations with [27](27-kbyg-meetmax-links.md); those changes can proceed on existing pages while new-page inputs are pending. Verify the combined result through [37](37-staging-verification.md).

## Exact targets and current evidence

Extend the existing **KBYG Pages** collection (`6a9a5f7b77769cbf46ce29a1`), **KBYG Content Blocks** collection (`6a9a5f494b89250952dfff08`) and their existing Collection Template. Do not rebuild this feature or create parallel collections.

Chrome CMS inspection confirmed these four records and exact slugs:

| Existing CMS record    | Audience | Staging verification target                                                         |
| ---------------------- | -------- | ----------------------------------------------------------------------------------- |
| HCHR Sep 2026 Delegate | Delegate | [HCHR Delegate](https://ipmi.webflow.io/know-before-you-go/hchr-sept-2026-delegate) |
| HCHR Sep 2026 Sponsor  | Sponsor  | [HCHR Sponsor](https://ipmi.webflow.io/know-before-you-go/hchr-sept-2026-sponsor)   |
| EHS Jan 2027 Delegate  | Delegate | [EHS Delegate](https://ipmi.webflow.io/know-before-you-go/ehs-jan-2027-delegate)    |
| EHS Jan 2027 Sponsor   | Sponsor  | [EHS Sponsor](https://ipmi.webflow.io/know-before-you-go/ehs-jan-2027-sponsor)      |

All four displayed **Published** in the CMS. That badge alone does not establish which domains were published; the links above are verification targets, not a claim that each URL was tested or is currently public. No complete list of missing future event/audience pairs was supplied.

The adjacent maintained checkout `webflow-frontend-kbyg-cms` documents native CMS rendering and data ownership in `docs/KBYG-CMS-Rendering-Release.md`. It confirms that page headings, copy, CTA labels and destinations remain native Webflow bindings; the runtime enhances interactions. Reconfirm actual template bindings before applying that source to a new change.

## Requested result and interfaces

Create only missing, approved event/audience pairs after reconciling the supplied roster against these records. Keep one page per Institute and Audience. Preserve existing URLs for current pages and use their naming pattern for new records, checking for duplicates before creation.

| Existing data owner                  | Content to use and preserve                                                                                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KBYG Page                            | Institute reference, Audience, Operations Lead, hero/hub assets and alt text, editorial headings/body, ordered content-block references, Hub URL, Sponsor Support URL, CTA labels |
| KBYG Page > KBYG Reservation Details | Audience-specific reservation rich text; slug `kbyg-reservation-details`                                                                                                          |
| Referenced Institute                 | Event title/year/dates, venue/map/gallery, Agenda Link, hotel intro, reservation URL and transportation details                                                                   |
| KBYG Content Block                   | Referenced Institute, audience scope, block type, ordered page membership, body and relevant calendar/link/icon fields                                                            |

Do not reconnect reservation rich text to the Institute's **Legacy - KBYG Reservation Details** backup. The established page-level field keeps Delegate and Sponsor copy independent. Reuse shared blocks only when the supplied content is truly shared; never copy stale HCHR dates, venue, Operations Lead or links into EHS/other events.

Preserve `.kbyg-page[data-audience]` native Audience binding, conditional audience branches, existing `noindex,follow`, current native empty states and optional-field suppression. Keep native Webflow CMS field chips intact in embeds. Preserve venue gallery binding, event colors, calendar-date adapters, section anchors and independent CTA destinations.

## Ordered Chrome implementation checklist

1. [ ] Open the IPMI Webflow CMS in Chrome and inventory current KBYG Pages by Institute reference and Audience. Reconcile the four records above and record any additions since this baseline.
2. [ ] Obtain the approved event/audience matrix and Operations content through [36](36-kbyg-operations-content.md). Mark each pair Existing / Missing / Awaiting input; do not create an assumed page for every future Institute without that roster.
3. [ ] Inspect the existing Collection Template and native bindings in Designer, including Audience, Institute, Operations Lead, page-level reservation copy and ordered multi-reference lists. Capture current records/template and asset pins for rollback.
4. [ ] For each approved missing pair, create a draft CMS record in the existing collection. Set the actual Institute reference and Audience before filling event-specific content. Apply the existing name/slug convention without changing current URLs.
5. [ ] Create or reference approved content blocks in the existing collection. Set the matching Institute, audience scope and block type; preserve the supplied order in each page's multi-reference field.
6. [ ] Populate approved hero/welcome/preparation/key dates/hotel/experience/FAQ/contact fields and independent audience copy. Leave unsupplied optional content empty with the established empty-state handling; do not use a different event as filler.
7. [ ] Apply [26](26-kbyg-agenda-links.md) to the shared agenda presentation and [27](27-kbyg-meetmax-links.md) to each confirmed destination. Preserve the correct staff contact and event-specific date adapters.
8. [ ] Preview every event/audience pair in Designer at desktop and mobile widths. Check native binding behavior when optional fields are empty and with different event names, years, colors, dates and venues.
9. [ ] If custom-code changes are necessary, identify the matching maintained source and use isolated, immutable asset pins. Do not modify the production-live unversioned global CSS URL.
10. [ ] Publish only to **ipmi.webflow.io** when the approved records are ready. Verify the actual staged URLs and add evidence and unresolved pairs to [37](37-staging-verification.md).

## Input blockers

The missing event roster, approved Operations copy, agenda destinations, MeetMax destinations and any missing staff/venue assets belong to [36](36-kbyg-operations-content.md). No exact MeetMax URLs were supplied in the source package; task 27 must remain blocked until supplied. Draft records with incomplete required event content must not be represented as review-ready pages.

## Acceptance checks

- [ ] Approved roster reconciles with the CMS; every approved event has both a Sponsor page and a Delegate page, with no duplicate pair, unless an explicit IPMI-approved audience exception is recorded.
- [ ] All four baseline records retain their original slugs and are checked for appropriate current content.
- [ ] Every page references its own Institute, audience, Operations Lead and correctly scoped blocks; ordered lists retain approved ordering.
- [ ] Reservation copy remains page-specific. Hub, Support, agenda and reservation destinations remain independent and correct.
- [ ] A populated page and a sparse page show correct empty states without duplicate notices, blank portraits or dead CTAs.
- [ ] Native title/year, venue gallery, maps, event colors, key-date controls, FAQ accordions and section navigation remain functional.
- [ ] The `#agenda` destination works after task 26; no unwanted indexability change occurs.
- [ ] Desktop, tablet and mobile layouts work for both audiences; actual staging URL/domain publication is verified separately from the CMS Published badge.
- [ ] If code changes, run the matching checkout's configured Vite+ checks/build and relevant KBYG CMS/markup/runtime tests.

## Rollback

Restore changed CMS field values and reference order from the capture. Unpublish only newly created staging pages that fail acceptance; retain draft records and block data for correction rather than deleting approved content. Restore the captured shared template or versioned asset pins if changed, then verify both existing audiences on staging.
