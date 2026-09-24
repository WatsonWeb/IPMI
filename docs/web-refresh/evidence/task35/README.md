# Task 35 — provisional schedule handoff

September 24, 2026 · [Task](../../35-calendar-content-through-2027.md) · [Roster](ROSTER.md) · [Exact manifest](calendar-roster.json)

## Authority and reconciliation

Source is the read-only native Webflow capture at `2026-09-24T09:46:21.620Z`, site `62f30d583ebbed2d6d47f9a5`, Institutes collection `6392772fccd80e5128026020`. Both paginated batches (100 + 3, total 103) were inspected. The manifest records the original capture SHA256; [the committed audit](all-institutes-reconciliation.json) preserves the relevant exact fields for all 103. The full raw capture remains an ignored local baseline because unrelated CMS fields are unnecessary to this handoff. Site timezone observed by the orchestrator is America/Toronto.

All 103 have valid ordered stored calendar-date ranges. Exactly 77 end before September 24, 2026; all other 26 fall within the requested window. No duplicate ID, slug, or normalized title + date interval + location identity occurs. None of the retained 26 is draft/archived; all have nonempty locations and existing published timestamps. Timestamps alone do not establish domain publication or client approval. No schedule was provided with which to establish cancellations, revisions, omissions or final approval.

The retained twenty 2027 rows are all Horizon. Repeated event names (EHS, HR, HGC, HCHR, CLDI and HR Canada) have separate native identities and intervals and are preserved. Concurrent events are independent, not duplicates. TAEEI Canada spans May 30–June 1, 2027. March CLDI's stored title lacks `&`; September's includes it. CNI 2027's title ends in one space. Retain these values until approved correction. No semantic duplicate is inferred from a similar name.

## Exact pending replacement / approval register

Every manifest event has a stable `approvalRegisterId` of `35-<exact slug>`. Its exact provisional values are the row's `title`, `year`, `start`, `end`, `location` and `horizon`; `cmsName`, ID and slug identify the existing record. Each of the 26 rows has status `retained-provisional-approval-pending`, source `native-cms-2026-09-24`, and date validity `valid-calendar-date-range`. Prior and retained values are identical. This is the exact per-event replacement register, not a generic request to supply a schedule again.

IPMI must return, **for each of those 26 IDs**, one of retain / correct / cancelled, and approve or replace each of the six schedule fields above. Supply approver, approval date and source, and indicate whether the row is final or provisional. For cancelled events, specify intended page/registration treatment and reference preservation before any change; do not silently delete records. For changed dates, preserve identity and revalidate KBYG references and external links. For disputed duplicates, identify the surviving ID and reference migration explicitly.

Additional register entries:

| ID               | Exact interim value                                                      | Required replacement / owner                                                                                                                                                               | Applied location                                              |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| 35-completeness  | `Pending complete schedule approval through 2027-12-31`                  | IPMI confirms exhaustive remaining-2026/2027 coverage, corrections, cancellations, and explicitly whether empty months have no events; identify genuine new events absent from all 103 IDs | Documentation only                                            |
| 35-empty-months  | `No matching native records observed; schedule completeness unconfirmed` | IPMI confirms December 2026, August 2027 and December 2027, plus remainder of September 2026; last native event ends November 23, 2027                                                     | Documentation only; task 24 must render truthful empty states |
| 35-new-undated   | `No additional event identities or dates supplied`                       | IPMI supplies an actual identity and approved dates before adding a dated record; no synthetic event placeholder is authorized                                                             | Documentation only; no CMS record                             |
| 35-cancellations | `Cancellation and revision status not independently confirmed`           | IPMI gives explicit retain/correct/cancelled disposition for all 26 and any omitted/revised records                                                                                        | Documentation only                                            |

No dates, titles or venues were invented. No public label was installed. `Venue pending confirmation` remains a future fallback only where a location is absent; all 26 currently have stored locations. Follow [PLACEHOLDERS](../../PLACEHOLDERS.md) for review status, and replace these interim entries with dated evidence before final content approval.

## Task 24 data contract and task 36 scope

Use live CMS fields `global-institute-title-no-year`, `global-institute-year`, `global-start-date`, `global-end-date`, `location`, `on-the-horizon`, and native ID/slug. This JSON is audit evidence, not a hardcoded runtime dataset. Preserve title source and IDs; formatting may trim display whitespace without editing the native title. Keep existing industry bindings, reference relationships and independent released-card filters.

Native dates are calendar dates serialized as midnight UTC. Extract `YYYY-MM-DD` directly, validate strictly and compare date components; converting them to America/Toronto would incorrectly show the previous day. Match inclusive ranges with `end >= today` and `start <= 2027-12-31`, exclude draft/archived records, and show every intersecting day. An event starting before today but not yet ended is ongoing. With the September 24 snapshot there are zero ongoing events, so a synthetic fixture is required to test that branch. The current month may have no remaining event.

All Horizon rows have `calendarAction: none`; this forbids a calendar CTA to a registering/pre-registering destination even when an independent event page is public. Released rows may link to the existing Institute page. Preserve HIT's independent pre-registration and task 34's attributes/routing. The existing Horizon page itself still has pre-registration CTAs; that does not change the separate locked-calendar rule.

All 26 rows are in the native Attend data source, but its existing display date only supplies month/day and lacks end date/location/Horizon fields; do not scrape option labels to infer the full calendar. Add/consume properly bound full native calendar fields in task 24 through Designer. Keep the existing native `data-slug` and `data-attend-recipient` values intact. Read all records rather than limiting the data to the six visible released cards. Task 36 uses the exact 26 event IDs × two audiences and retains the existing past HCHR September 2026 pair, giving 54 provisional planning rows without inventing approved Operations facts.

## Staging verification

Read-only Chrome UI/DOM observations on September 24, 2026:

- [Upcoming](https://ipmi.webflow.io/institutes#institutes): six released 2026 cards with existing date/location text and View Institute links. [Saved rows](upcoming-live-source.json).
- [Horizon](https://ipmi.webflow.io/institutes-on-the-horizon#horizon): twenty 2027 cards with matching native titles, dates and locations. [Saved rows](horizon-live-source.json) contain forty attribute-bearing nodes because card metadata and generated dropdown options each identify the same twenty slugs; they are not forty records. Option parent text includes the complete dropdown.
- [Attend](https://ipmi.webflow.io/attend#invite): twenty-six unique native rows and twenty-six real dropdown options, plus its empty prompt. [Saved rows](attend-live-source.json) retain task 34 routing metadata. No selection or submission was necessary.
- [HIT](https://ipmi.webflow.io/institutes/hit-2027#invitation): June 6–8, 2027, The Ritz-Carlton, New Orleans, LA and PRE-REGISTER NOW remain visible. [DOM snapshot](hit-page.txt). No form submitted.

No CMS, Designer, form routing, filter, draft, reference or publication changed. Browser research tab closed; no viewport override was applied and existing user tabs were left open. No website publish is required for this documentation-only handoff.

## Validation and limits

`vp node docs/web-refresh/evidence/task35/validate-roster.mjs` checks pagination, full 103-record partition, exact manifest fields against the committed audit, strict dates/year consistency, 26 unique identities, six released/twenty Horizon counts, live-list membership and title/location agreement, TAEEI cross-month dates, HIT action exclusion and preserved recipient, and every local documentation link in task 35's changed Markdown. It writes `validation-results.json`.

[Independent orchestrator verification](root-verification.json) also compared every manifest ID, slug, title, year, date, location and Horizon flag directly against the full native capture: all exact, with no mismatches.

Changed files pass scoped `vp fmt --check`; `git diff --check` passes. Full `vp run verify` is not represented as passing: task 34 recorded 36 pre-existing formatting failures in [its baseline](../task34/configured-check-baseline.txt), with full-document normalization assigned to task 37. No runtime code changed, so no runtime build or behavioral calendar test is claimed. The task 24 calendar does not exist yet; final schedule approval, cancellation/completeness evidence and integrated task 37 acceptance remain outstanding.

Protected `ipmi-custom-styles.css` SHA256 was checked unchanged: `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496`. Rollback affects only this documentation delta; there is no site mutation to undo.
