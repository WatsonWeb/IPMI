# 25 — KBYG sponsor and delegate page coverage

> **Current task 37 handoff — September 24, 2026:** 54 pages means 27 audience pairs, not 54 pairs. All URLs return 200; three current CMS draft flags and renamed current slugs are preserved in task 37 current registers. Earlier all-non-draft/staging-only records are historical. See [final evidence](evidence/task37/README.md) and [current replacement guide](PLACEHOLDERS.md).

[Back to master](README.md)

- **Owner:** Bryan / Webflow CMS implementation; IPMI Operations confirms event coverage and supplies audience-specific content.
- **Status:** Complete for the user-authorized provisional scope: 50 native pages created, 54 exact event/audience pairs staged and structurally verified on September 24, 2026. Final Operations content remains pending. See [execution evidence](evidence/task25/README.md).
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

The maintained CMS-rendering work is now consolidated into this `webflow-frontend` checkout on `master`. Its [release notes](../KBYG-CMS-Rendering-Release.md) document native CMS rendering and data ownership: page headings, copy, CTA labels and destinations remain native Webflow bindings; the runtime enhances interactions. Reconfirm actual template bindings before applying that source to a new change.

## Requested result and interfaces

The user explicitly authorized clearly labeled placeholders, superseding the original approved-only creation blocker. Task 36 supplies the concrete 54-pair provisional matrix; task 25 created its 50 missing pairs after native reconciliation. Keep one page per Institute and Audience. Preserve existing URLs for current pages and use their naming pattern for new records, checking for duplicates before creation.

| Existing data owner                  | Content to use and preserve                                                                                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KBYG Page                            | Institute reference, Audience, Operations Lead, hero/hub assets and alt text, editorial headings/body, ordered content-block references, Hub URL, Sponsor Support URL, CTA labels |
| KBYG Page > KBYG Reservation Details | Audience-specific reservation rich text; slug `kbyg-reservation-details`                                                                                                          |
| Referenced Institute                 | Event title/year/dates, venue/map/gallery, Agenda Link, hotel intro, reservation URL and transportation details                                                                   |
| KBYG Content Block                   | Referenced Institute, audience scope, block type, ordered page membership, body and relevant calendar/link/icon fields                                                            |

Do not reconnect reservation rich text to the Institute's **Legacy - KBYG Reservation Details** backup. The established page-level field keeps Delegate and Sponsor copy independent. Reuse shared blocks only when the supplied content is truly shared; never copy stale HCHR dates, venue, Operations Lead or links into EHS/other events.

Preserve `.kbyg-page[data-audience]` native Audience binding, conditional audience branches, existing `noindex,follow`, current native empty states and optional-field suppression. Keep native Webflow CMS field chips intact in embeds. Preserve venue gallery binding, event colors, calendar-date adapters, section anchors and independent CTA destinations.

## Original implementation checklist (completed or explicitly handed off below)

1. [x] Open the IPMI Webflow CMS in Chrome and inventory current KBYG Pages by Institute reference and Audience. Reconcile the four records above and record any additions since this baseline.
2. [x] Obtain the concrete provisional event/audience matrix and labeled placeholder pack through [36](36-kbyg-operations-content.md). Mark each pair Existing / Missing / Awaiting input; do not create an assumed page for every future Institute without that roster.
3. [x] Inspect the existing Collection Template and native bindings in Designer, including Audience, Institute, Operations Lead, page-level reservation copy and ordered multi-reference lists. Capture current records/template and asset pins for rollback.
4. [x] For each user-authorized missing pair, import a native CMS record queued for the next site publish in the existing collection. Set the actual Institute reference and Audience before filling event-specific content. Apply the existing name/slug convention without changing current URLs.
5. [x] Preserve the existing 43 blocks exactly; leave all five new-page block lists empty because approved content is not supplied.
6. [x] Populate explicitly labeled placeholder hero/welcome/preparation/key dates/hotel/experience/FAQ/contact fields and independent audience copy. Leave unsupplied optional content empty with the established empty-state handling; do not use a different event as filler.
7. [ ] Apply [26](26-kbyg-agenda-links.md) to the shared agenda presentation and [27](27-kbyg-meetmax-links.md) to each confirmed destination. Preserve the correct staff contact and event-specific date adapters.
8. [x] Inspect the shared native template in Designer and every rendered staging event/audience pair at desktop and mobile widths. Check native binding behavior when optional fields are empty and with different event names, years, colors, dates and venues.
9. [x] If custom-code changes are necessary, identify the matching maintained source and use isolated, immutable asset pins. Do not modify the production-live unversioned global CSS URL.
10. [x] Publish only to **ipmi.webflow.io** when the provisional records are ready. Verify the actual staged URLs and add evidence and unresolved pairs to [37](37-staging-verification.md).

## Provisional scope and remaining editorial inputs

The original approved-content blocker below is superseded for provisional creation by the user’s placeholder instruction. It remains relevant to final editorial approval, not structural coverage completion. No placeholder has been represented as Operations-approved. Task 26 owns compact agenda/navigation; task 27 owns link corrections; task 37 owns accumulated presentation verification.

## Original input requirements

The missing event roster, approved Operations copy, agenda destinations, MeetMax destinations and any missing staff/venue assets belong to [36](36-kbyg-operations-content.md). No exact MeetMax URLs were supplied in the source package; task 27 must remain blocked until supplied. Draft records with incomplete required event content must not be represented as review-ready pages.

## Original acceptance checks (structural scope verified; final content and dependent behavior excluded)

- [x] The 54-pair provisional matrix reconciles exactly with CMS; no duplicate event/audience pair.
- [x] All four baseline records retain their original slugs and are checked for appropriate current content.
- [x] Every page references its own Institute and audience; unsupplied Operations Lead and block lists stay empty. Original references/order are preserved.
- [x] Reservation copy remains page-specific; destination fields remain independent. New missing destinations are empty; inherited example links are assigned to task 27.
- [x] A populated page and a sparse page show correct empty states without duplicate notices, blank portraits or dead CTAs.
- [x] Native title/year/venue/colors and audience-appropriate section anchors render across all pairs. Existing gallery/calendar/FAQ data is preserved; navigation and calendar defects are explicitly handed off.
- [ ] The `#agenda` destination works after task 26; no unwanted indexability change occurs.
- [x] Desktop/mobile structural checks and representative tablet visual checks are recorded for both audiences; actual staging URL/domain publication is verified separately from the CMS Published badge.
- [x] If code changes, run the matching checkout's configured Vite+ checks/build and relevant KBYG CMS/markup/runtime tests.

## Rollback

Restore changed CMS field values and reference order from the capture. Unpublish only newly created staging pages that fail acceptance; retain draft records and block data for correction rather than deleting approved content. Restore the captured shared template or versioned asset pins if changed, then verify both existing audiences on staging.

## Execution qualification

The checked workflow records completion under the authorized provisional scope, not blanket final approval of the original content criteria. Native CSV import queued new items for the next site publish; no CMS Publish now action was used. Existing four pages and 43 blocks are exactly preserved. Missing contacts/images/URLs and block lists remain empty, while copy is explicitly labeled. All 54 staging URLs return 200; both 1440px and 390px rendered identity, venue, audience, noindex, anchors and overflow checks pass. Desktop/tablet/mobile representative screenshots are retained.

The static Orlando skyline now has native Institute-specific visibility for HCHR September 2026 only; other pages retain the neutral gradient. No runtime/CSS pin changed. Sparse Sponsor `#agenda` click sets the hash but settles beyond the section; task 26 must fix it and task 37 must retest. Therefore agenda navigation is not claimed as passing. Known all-day calendar shifts, sparse Sponsor Experience whitespace and empty-state contrast remain assigned to task 37. Exact evidence and rollback are in [task 25 evidence](evidence/task25/README.md).
