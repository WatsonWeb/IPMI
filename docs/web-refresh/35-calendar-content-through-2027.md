# 35 — IPMI dependency: confirmed calendar content through 2027

[Back to master](README.md)

**Owner:** IPMI approves event facts/status; BWC reconciles CMS records for the calendar. **Status:** Existing candidate records identified; dates/venues and complete coverage require confirmation.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 3, July 9 calendar addition: coverage through the end of 2027 and locked On the Horizon shells.
- Existing **Institutes** collection and the month-grid calendar on [Upcoming Institutes](https://ipmi.webflow.io/institutes), implemented in [24](24-institutes-calendar.md).

## Current state and intended result

Populate the calendar from existing Institute dates, titles, locations, and `On the Horizon` state, including ongoing and upcoming events from the current month through December 2027. The following records were found in CMS research; the table uses research shorthand, not new slug assignments. Match each to its live record before making changes. Except HIT 2027, dates and venues were not verified in the planning snapshot.

| Existing CMS number | Event reference      | Confirmation needed                                                            |
| ------------------- | -------------------- | ------------------------------------------------------------------------------ |
| 21                  | EHS Jan 2027         | Exact title, dates, venue/location, status.                                    |
| 22                  | HR Feb 2027          | Exact title, dates, venue/location, status.                                    |
| 23                  | HGC Feb 2027         | Exact title, dates, venue/location, status.                                    |
| 24                  | HCHR March 2027      | Exact title, dates, venue/location, status.                                    |
| 25                  | CLDI March 2027      | Exact title, dates, venue/location, status.                                    |
| 26                  | HFI 2027             | Exact title, dates, venue/location, status.                                    |
| 27                  | HR Canada April 2027 | Exact title, dates, venue/location, status.                                    |
| 28                  | TAI US 2027          | Exact title, dates, venue/location, status.                                    |
| 29                  | TAEEI Canada         | Confirm year before including; then all event facts.                           |
| 210                 | HIT 2027             | Snapshot: June 6–8, 2027, Horizon true; confirm location and current approval. |
| 211                 | HRMI June 2027       | Exact title, dates, venue/location, status.                                    |
| 212                 | EHS July 2027        | Exact title, dates, venue/location, status.                                    |
| 213                 | CLDI Sept 2027       | Exact title, dates, venue/location, status.                                    |
| 214                 | HGC Sept 2027        | Exact title, dates, venue/location, status.                                    |
| 215                 | HCHR Sept 2027       | Exact title, dates, venue/location, status.                                    |
| 216                 | IP Law 2027          | Exact title, dates, venue/location, status.                                    |
| 217                 | HRMI Oct 2027        | Exact title, dates, venue/location, status.                                    |
| 218                 | CNI 2027             | Exact title, dates, venue/location, status.                                    |
| 219                 | CWI 2027             | Exact title, dates, venue/location, status.                                    |
| 220                 | HR Canada 2027       | Distinguish from April record; confirm all event facts.                        |

## Required IPMI inputs

Provide a complete approved schedule from the current month through December 2027, including remaining 2026 events: exact event title, start/end calendar dates, venue/location, matching record/slug where known, Horizon/public status, cancellations or date changes, and whether each row is final. Clearly identify genuine new events versus corrections to the existing records above. Do not infer missing dates from a month embedded in a record name.

## Chrome / Webflow implementation checklist

1. Reconcile the approved schedule with the live Institutes collection by record ID/slug and event identity; record mismatches and duplicate candidates before edits.
2. Update approved dates/title/location/Horizon values in existing items through Chrome. Create new records only for approved events confirmed absent from the CMS.
3. Keep calendar dates as calendar dates without timezone conversion. Preserve the Institute page's independent availability and registration behavior.
4. Hand the reconciled records to task 24. All Horizon calendar entries, including HIT 2027, show event details without registration actions; HIT's existing page keeps its separate pre-registration flow.
5. Check completeness, month boundaries, ongoing/multi-day events, December 2027, and revised/cancelled records on staging under [37](37-staging-verification.md).

## Acceptance checks

- [ ] Every approved schedule row maps to one Institute record; existing candidates are reused rather than duplicated.
- [ ] Unknown dates, venues, and the TAEEI Canada year remain unresolved until confirmed.
- [ ] Remaining 2026 and all approved 2027 events are included through December 31, 2027.
- [ ] Multi-day events preserve their approved dates; no timezone shift creates a wrong day.
- [ ] Horizon entries have no calendar registration action; the HIT page's separate flow is preserved.

## Rollback

Record prior date/title/location/status values and CMS IDs for every touched record. Restore only the affected values and unpublish newly added records if needed; do not delete pre-existing Institutes or their references.
