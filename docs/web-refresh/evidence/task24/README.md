# Task 24 — calendar staging evidence

September 24, 2026. Editor: IPMI Webmaster through Chrome Designer. [Staging calendar](https://ipmi.webflow.io/institutes). Implementation is staged provisionally; final schedule approval/completeness remains with IPMI under task 35. No production publication or form submission occurred.

## Native delta and deployment

On Upcoming Institutes page `63ba5ae2944baf57c9a073c8`, added a Code Embed at the end of Institutes Section → Container, after the existing Cards List Wrapper (including its pagination) and Empty State. It contains the initially hidden **View calendar** button, native HTML dialog, visible heading, Close, Previous/Next month, grid and selected-day details region. The runtime reveals the trigger only within coverage. Both month heading and details are polite live regions; details are atomic. No existing list, pagination, filter initializer or form was replaced.

Added a separate native Collection List Wrapper, ID `ipmi-calendar-data`, sourced from Institutes `6392772fccd80e5128026020`. Native filter: **Global - End Date is after or equal to 2 days in the past**. This intentionally includes a boundary margin; the runtime uses strict `end >= today` in America/Toronto. No pagination, industry filter attributes or item limit is enabled. The 26 rendered records reconcile exactly with task 35; this does not promise coverage beyond Webflow's native capacity. At 100 rendered rows the trigger fails closed until native coverage is extended.

The collection item's Code Embed contains a noninteractive hidden span with native bindings inserted through the Designer binding menu:

| Attribute       | Native field                       | Format                                           |
| --------------- | ---------------------------------- | ------------------------------------------------ |
| `data-slug`     | URL Slug                           | Native text                                      |
| `data-title`    | Global - Institute Title (No Year) | Native text                                      |
| `data-start`    | Global - Start Date                | `YYYY-MM-DD` selected in native date-format menu |
| `data-end`      | Global - End Date                  | `YYYY-MM-DD` selected in native date-format menu |
| `data-location` | Global - Venue, City, State        | Native text                                      |
| `data-horizon`  | On the Horizon                     | Native `true` / `false`                          |
| `data-url`      | URL Path                           | Existing `/institutes/<slug>`                    |

No CMS record, reference, ID, date or venue was edited. Published dates exactly match the retained date components, including October 4–6, 2026 and May 30–June 1, 2027. Horizon URLs exist only as inert metadata; the runtime creates no Horizon links. Missing/unknown Horizon markers, invalid dates, incomplete/reversed ranges and duplicates are rejected.

Separate auto-discovered IIFE and CSS are pinned in the shell embed:

- `https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@9be97e435797394a9c314dda4f4a48181acf94ef/dist/institutes-calendar.js`
- `https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@9be97e435797394a9c314dda4f4a48181acf94ef/dist/institutes-calendar.css`

Source: `src/site/institutes-calendar.ts`, model and scoped CSS, plus `src/entries/institutes-calendar.ts`. `scripts/frontend-entries.ts` now names imported CSS after its entry. The deployed legacy inline Institute filter initializer was inspected before work and preserved byte-for-byte. Publish UI showed only `ipmi.webflow.io` checked and `www.ipmievents.com` unchecked; staging publish succeeded. Production `/institutes` still has no calendar marker or asset. Protected root CSS remains SHA256 `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496`.

## Acceptance results

- [Root independent reconciliation](root-verification.json): 26 unique rows, no omissions/extras/mismatches against task 35; all original image, anchor, form, filter-attribute and inline-script arrays preserved. Root independently compared both CDN assets with local built bytes.
- Open and reopen select September 24, 2026 / September 2026. Previous is disabled at current month. December 2027 disables Next and moves focus to the selected date instead of leaving focus on a disabled control. Reopen discards old month/selection and rereads native data.
- October 18 shows HR Management and IP Law & Management, in title order, with complete October 18–20 ranges, venues and two correct ordinary Institute links. November 8's three records remain in the independent dataset.
- TAEEI Canada appears May 30, May 31 and June 1, 2027 with the full inclusive date range and venue. June 6 shows both Healthcare IT and HR Management; both show `On the Horizon — registration is not yet available.` and zero links. All 20 Horizon rows are explicit native true values.
- Arrow keys, Home, End, Page Up/Down, Enter and Space exercised. Shift+Tab from Close wraps to selected date in Horizon view; Tab wraps back to Close. Escape closes and focuses View calendar. Native dialog provides background modality; explicit Tab handling retains focus.
- Healthcare filter reduced visible cards to Healthcare Law & Compliance and Chief Nursing. Opening/browsing/closing preserved the exact `[true,false,false,false,false]` checkbox state and those card URLs; independent source stayed at 26 rows. Scroll position before and after keyboard opening/navigation/Escape was exactly 1412px. Existing pagination DOM is preserved; current six-card dataset has no active pagination button to exercise.
- [Browser timezone comparison](timezone-browser.json): Los Angeles and Kiritimati both show the same October 4–6 dates and venue. Synthetic tests cover Toronto midnight, spring/fall DST transitions, ongoing/end-today and cross-year ranges, leap/non-leap February, invalid/suffix/incomplete/reversed data, duplicate rows, changed data on reopening, month bounds and post-2027 expiry. No fabricated schedule records were added to CMS.
- [HIT preservation](hit-preservation.json): original direct HIT form HTML exactly unchanged, `Pre-Register now` remains and no calendar assets are loaded on HIT. No delivery test performed.
- No warning/error console entries observed in the acceptance tab. Viewport and timezone overrides reset; only task-owned acceptance tab closed at handoff.

## Visual checks

Ordinary screenshots were inspected and actual PNG dimensions verified. Grid and day list remain vertically ordered at every size. Dialog client width equals scroll width: 304px at 320, 374px at 390 and 704px at 768. The underlying 768px page retains the pre-existing 790px shared-navbar overflow assigned to task 37; the calendar itself fits and does not conceal that baseline with a page overflow hack.

- [Desktop current month, 1912×970](desktop-current-month.png)
- [Desktop released overlap, 1912×970](desktop-overlap.png)
- [320×740 Horizon](mobile-320-horizon.png) and [scrolled second event](mobile-320-scrolled-details.png)
- [390×844 Horizon](mobile-390-horizon.png)
- [768×1024 Horizon](tablet-768-horizon.png)

## Checks and remaining dependencies

`vp test --run tests/institutes-calendar.test.ts`: 5 tests passed. `vp lint`: passed with existing task35 `require-array-sort-compare` warning only. `vp build`, `vp run check:styles:baseline`, and targeted formatting passed. Full `vp run verify` is not claimed: accumulated refresh-document formatting remains task 37's known baseline. Screenshots and unit tests do not establish an approved exhaustive IPMI schedule or a screen-reader speech audit.

Applied label: **`Provisional schedule — final dates and completeness pending IPMI approval.`** Exact replacement is registered in [PLACEHOLDERS](../../PLACEHOLDERS.md). Retain the current 26 factual schedule values provisionally; IPMI must approve/correct the roster and empty months through December 2027, then remove or replace this label. No invented dated event was applied.

## Rollback

Remove only the new shell Code Embed and `ipmi-calendar-data` native list from Upcoming Institutes, then publish staging only. The original footer initializer and all other page settings remain unchanged. Keep the immutable assets in Git for audit; remove their two shell references to disable the feature. Preserve CMS data. Recheck industry filters, original card URLs and pagination after rollback; do not restore an entire site backup.
