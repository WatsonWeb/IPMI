# 36 — IPMI dependency: Operations copy and KBYG event coverage

> **Current task 37 handoff — September 24, 2026:** All 50 prepared missing pages were subsequently created, for 54 pages / 27 pairs. Four EHS Delegate placeholder fields were superseded by concurrent Operations copy; current EHS reservation includes $369 and three day cards plus PDF are preserved. Use task 37 current registers rather than restoring earlier blank copy/refs or old slugs. Current content approval remains separate. See [final evidence](evidence/task37/README.md) and [current replacement guide](PLACEHOLDERS.md).

[Back to master](README.md)

**Owner:** IPMI Operations supplies/approves event coverage and content; BWC maps approved content into existing CMS structures. **Status:** Provisional handoff and EHS scope corrections staged; final Operations approval remains pending.

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
- Approval status and unresolved rows. User-authorized placeholders are explicitly labeled and registered; borrowed event-specific links and guessed dates remain prohibited.

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

## September 24, 2026 provisional implementation

[Evidence and exact editorial handoff](evidence/task36/README.md) supplies a [54-row event × audience matrix](evidence/task36/MATRIX.md), all actual fields/IDs, a 50-row native-import candidate CSV and mapped JSON, and [exact placeholder replacements](evidence/task36/placeholder-fields.json). Task 25 creates the missing pages; no missing page was imported in task 36. Task 35's 26 provisional native events provide 52 rows, plus the retained past HCHR pair. All four original IDs/URLs remain.

Both EHS pages had 28 cross-event references to HCHR blocks removed through native Chrome CMS. The 43 original blocks and both HCHR pages are unchanged. EHS Delegate's four own date blocks remain; its incorrect Healthcare HR welcome and stale three-step wording were replaced with a labeled pending paragraph. Existing correct staff/images/event details remain. Empty sections show native pending notices. Exact changes, original reference order and rollback are in the evidence.

Only ipmi.webflow.io was published; custom production domain was visibly unchecked. Desktop/mobile sparse states, original HCHR content, reference scope, noindex and asset pins were verified. Final Operations content approval and complete schedule coverage remain pending; task 26 owns compact Institute Agenda presentation and task 27 owns independent platform destinations, including inherited active example.com URLs. Known all-day date display semantics and sparse Sponsor Experience whitespace are assigned to task 37 without changing authored dates.

- [x] 54 provisional planning pairs reconciled; original four reused and 50 missing creation candidates prepared.
- [x] Exact field/content/placeholder handoff prepared and native scope corrections staged.
- [x] All original blocks, HCHR values, staff links, image assignments and EHS-owned dates preserved.
- [x] Independent structural CMS/HTTP and matrix checks passed; viewport reset and owned QA tab closed.
- [ ] Operations approves final coverage, event facts, copy, deadlines, contacts, imagery and audience-specific logistics.
- [ ] Tasks 25–27 and integrated task 37 complete; no claim of 54 live pages or final-content approval.
