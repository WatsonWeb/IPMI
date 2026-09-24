# 35 — Calendar content through 2027

[Back to master](README.md)

**Owner:** IPMI approves the schedule; BWC reconciles native records. **Status:** Provisional handoff complete September 24, 2026. Final schedule approval and completeness remain pending; calendar implementation belongs to [24](24-institutes-calendar.md).

## Source and result

[Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 3, July 9: calendar coverage through December 2027, with non-registering Horizon shells. Bryan's later placeholder instruction permits a provisional implementation from retained facts; it does not authorize fabricated event dates, venues or schedule approval.

All 103 native Institute records were reconciled against stored start/end dates as of September 24, 2026: 77 past records excluded and 26 current/future records retained (six remaining 2026 released Institutes and twenty 2027 Horizon Institutes). No current event is ongoing. All 26 have valid inclusive date ranges, titles, years and locations; none is draft or archived. No duplicate IDs, slugs or exact title/date/location identities were found. Existing facts and all CMS IDs/references remain unchanged. No CMS write, new record, website placeholder label or site publication was necessary.

- [Readable complete 26-row roster](evidence/task35/ROSTER.md)
- [Exact ID, slug, title, year, stored dates, location, Horizon, validity, source and provisional status manifest](evidence/task35/calendar-roster.json)
- [Full 103-record reconciliation](evidence/task35/all-institutes-reconciliation.json)
- [Evidence, data contract and remaining approval register](evidence/task35/README.md)

TAEEI Canada `29-taeei-can` is stored as **2027**, May 30–June 1. The earlier unknown stored-year issue is resolved; client approval remains open. April and November HR Canada are separate dated records. Repeated titles at different dates and different Institutes on the same dates are not duplicate events. CNI 2027 has a trailing title space; CLDI March omits the ampersand present in September. Both exact native values are preserved in JSON for IPMI's editorial review.

## Task 24 handoff

Read the live native CMS fields, not this dated manifest, for the calendar. Preserve independent released-card filters and task 34's native `data-slug` / `data-attend-recipient` routing metadata. The calendar's data source must include all applicable ongoing/upcoming records, including Horizon. The six visible Upcoming cards alone are incomplete. Current generic Attend metadata corroborates all 26; Horizon corroborates twenty.

Use the stored `YYYY-MM-DD` portions without converting midnight UTC to America/Toronto or browser-local time. Include each day through the end date, including TAEEI's May/June boundary. Scope the grid from the current month through December 31, 2027; include ongoing events whose start precedes today. All twenty Horizon entries, **including HIT**, must have no calendar registration action. Preserve independent existing page flows, including [HIT pre-registration](https://ipmi.webflow.io/institutes/hit-2027#invitation).

Last observed event ends November 23, 2027. Empty December 2026, August 2027 and December 2027 have no matching native events; this does not establish that the approved schedule has none. Show a truthful empty state through December, not invented events. Missing-date records, if later supplied, remain outside the dated grid and in the unresolved register. `Venue pending confirmation` is the permitted fallback only for an actually missing location; none of the current 26 needs it. Synthetic ongoing, invalid-date and December cases belong in task 24 test fixtures, never CMS records.

[Task 36](36-kbyg-operations-content.md) can use these exact 26 IDs × Delegate/Sponsor plus the retained past HCHR September 2026 pair: 54 provisional coverage rows. This establishes planning scope, not approved Operations content or event-specific destinations.

## Approval and acceptance

- [x] All current/future native records mapped exactly once; 103-record inventory reconciled; no duplication or invented schedule.
- [x] Remaining 2026 and twenty stored 2027 events retained provisionally; exact source/authority limitations recorded for every row.
- [x] Stored TAEEI year and cross-month interval verified; all date components retained unchanged.
- [x] Staging lists corroborate the roster: six released, twenty Horizon and all 26 Attend identities; existing HIT pre-registration remains visible.
- [x] Exact retained values and required replacements linked from [PLACEHOLDERS](PLACEHOLDERS.md).
- [ ] IPMI approves each title, year, inclusive dates, location and Horizon/released status, including corrections, cancellations and any genuinely missing events.
- [ ] IPMI confirms exhaustive schedule coverage through December 31, 2027, explicitly addressing empty months.
- [ ] Task 24 implements and tests multi-day/ongoing boundaries, empty December, filtering and non-registering Horizon calendar entries; task 37 completes integrated staging acceptance.

## Replacement and rollback

Use the approval register in the evidence handoff. Reuse the exact ID/slug for corrections; create an event only after IPMI confirms it is genuine and absent. Apply approved changes in Chrome Designer/CMS, retain original field values, and publish only `ipmi.webflow.io` with custom domains unchecked. Recheck live calendar and event/audience coverage after changes. No sending test or production publication is authorized here.

This task is documentation-only, so rollback is the task's documentation delta. There are no Webflow mutations to undo. Protected shared stylesheet remains unchanged. Detailed validation results and scope limitations are in the evidence handoff.
