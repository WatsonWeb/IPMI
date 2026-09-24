# 36 — IPMI dependency: Operations copy and KBYG event coverage

[Back to master](README.md)

**Owner:** IPMI Operations supplies/approves event coverage and content; BWC maps approved content into existing CMS structures. **Status:** Awaiting final Operations copy and event/audience coverage; existing pages identified.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 3, July 9 KBYG request: sponsor/delegate pages for each event; full copy changes pending Operations.
- Existing **KBYG Pages** (4 records), **KBYG Content Blocks** (43 records), related **Institutes** and **Staff** references in the research snapshot. Extend the existing implementation; do not rebuild these collections.

| Existing KBYG item     | Slug / expected staging page                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| EHS Jan 2027 Sponsor   | [ehs-jan-2027-sponsor](https://ipmi.webflow.io/know-before-you-go/ehs-jan-2027-sponsor)       |
| EHS Jan 2027 Delegate  | [ehs-jan-2027-delegate](https://ipmi.webflow.io/know-before-you-go/ehs-jan-2027-delegate)     |
| HCHR Sep 2026 Sponsor  | [hchr-sept-2026-sponsor](https://ipmi.webflow.io/know-before-you-go/hchr-sept-2026-sponsor)   |
| HCHR Sep 2026 Delegate | [hchr-sept-2026-delegate](https://ipmi.webflow.io/know-before-you-go/hchr-sept-2026-delegate) |

The CMS showed Published badges, which do not establish which domains received those items. Verify actual staging visibility during implementation. The approved future coverage list is still an Operations dependency.

## Required IPMI Operations inputs

- Approved event list with exact Institute ID/slug and content for both Delegate and Sponsor pages per event; identify each existing versus missing audience/event pair. Record any explicit IPMI-approved audience exception separately.
- Final copy per audience and section: welcome, preparation, key dates, attendee/sponsor hub, hotel/travel, experience, FAQ or sponsor support, and contact; identify shared versus audience-specific text and ordered content blocks.
- Exact event-specific agenda URL, audience-specific MeetMax/hub URLs, hotel/reservation links, key date/deadline values, and any relevant timezone.
- Approved Operations lead Staff record/contact details, required imagery/alt context, and explicit instructions for intentionally empty/omitted sections.
- Approval status and unresolved rows; no placeholder copy, borrowed event-specific links, or guessed dates.

## Chrome / Webflow implementation checklist

1. Build the event × audience coverage matrix against the four existing records above and [25](25-kbyg-page-coverage.md). Mark approved, present, missing, and blocked pairs.
2. Inspect live field names and content-block references in Chrome. Map each approved text/link/date to the existing page, Institute, Staff, or Content Block field and identify shared blocks before editing.
3. Apply approved updates to matched records and blocks; add only missing approved pairs. Reuse shared content only when truly identical and keep event/audience-specific content independent.
4. Coordinate agenda presentation with [26](26-kbyg-agenda-links.md) and MeetMax destinations with [27](27-kbyg-meetmax-links.md). Preserve stable anchors, current indexing policy, and empty-content behavior.
5. Preview every affected audience page, check cross-event references and shared-block consumers, and stage through [37](37-staging-verification.md).

## Acceptance checks

- [ ] The approved coverage matrix includes both Sponsor and Delegate for every approved event, records any explicit IPMI-approved exception, and reuses the four existing matching records.
- [ ] Final copy, dates, lead contacts, images, and links match Operations-approved inputs.
- [ ] Shared-block edits are reviewed on every consumer; audience/event-specific text and URLs do not leak between pages.
- [ ] Missing inputs remain explicit blockers for the relevant pair, with no speculative content.
- [ ] Existing indexing behavior, anchors, and optional empty sections are preserved; agenda and MeetMax tasks are reconciled.

## Rollback

Record prior field values, reference lists/order, shared-block consumers, and publication state. Restore only affected records/blocks and unpublish newly added pairs if needed; preserve existing collections and the four original page records.
