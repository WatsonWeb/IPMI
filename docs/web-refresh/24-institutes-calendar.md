# 24 — Upcoming Institutes month-grid calendar

[Back to master](README.md)

- **Owner:** Bryan / Webflow and custom-code implementation; IPMI confirms event data through 2027.
- **Status:** Documented; calendar implementation and staging verification are not started.
- **Sources:** [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), Upcoming Institutes calendar request; accepted plan's month-grid, staging and Horizon behavior decisions.
- **Depends on:** [35 — confirmed event data through 2027](35-calendar-content-through-2027.md), [18 — existing HIT pre-registration](18-hit-2027-pre-registration.md). Verify with [37](37-staging-verification.md).

## Target and current evidence

Target the **Upcoming Institutes** page at `/institutes`, immediately below its existing listing/pagination area. The Chrome baseline showed six upcoming 2026 cards, Finsweet filtering and no calendar. A View More control was not visible in that baseline; place the trigger beneath the actual list/pagination wrapper, without creating or assuming a View More button.

The native **Institutes** CMS already contains title, start/end dates, venue/location, URL slug and **On the Horizon** fields. Inspection found approximately 20 future/2027 records; task 35 must confirm the complete intended roster rather than treating that observation as a complete approved calendar.

The **HIT 2027** record is `6a062fba0e49a14badf21c95`, slug `hit-2027`, with On the Horizon enabled and June 6–8, 2027 at The Ritz-Carlton, New Orleans. Its existing individual page has a pre-registration flow. The calendar must render this Horizon entry without a registration action while leaving that existing individual page's pre-registration behavior unchanged.

## Requested behavior and minimum interface

- Add a button labeled **View calendar** below the listing/pagination. Open an accessible modal dialog containing a month grid, previous/next month buttons, close control and a selected-day event list below the grid at every viewport size.
- Open to the current month. Navigation spans the current month through **December 2027**, inclusive; disable previous/next controls at those bounds. Recompute the current month on open. After December 2027, hide the expired calendar trigger until a new coverage horizon is approved.
- The calendar is an independent all-Institutes view. Preserve existing list filters, pagination, selection and scroll behavior; opening, browsing and closing the calendar must not change them.
- Use every approved CMS event whose end date is today or later and whose date range overlaps the supported months. Include an event already in progress. Show each multi-day event on every occupied day, including month/year boundaries. Sort day details by start date and then title.
- For each selected day, show event title, complete date range and venue/location. For ordinary released events, use their existing individual Institute destination. For **every On the Horizon event**, show details with a clear unavailable-registration state and no event/registration link in the calendar. Do not special-case HIT 2027 into an actionable calendar entry.
- Use date-only `YYYY-MM-DD` values formatted from the native CMS fields in the site's configured timezone. Compare calendar date components; do not parse midnight timestamps through a visitor's local timezone and shift an event into another day.
- If no events occupy a selected day, show `No Institutes scheduled for this day.` Omit unconfirmed dates instead of inventing placement, and list those records as blocked under task 35.

Use a separate native Webflow CMS list as the calendar's data source, independent of the visible paginated/filterable cards. Bind values through Webflow's native CMS controls. This requires **no new collection, external API endpoint or browser-exposed API secret**. Ensure the full matching result set is rendered; if native list limits are exceeded, extend the native rendered data coverage before declaring completion.

Minimal proposed DOM contract for the scoped calendar runtime:

| Element/attribute                                   | Meaning / binding                                                     |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| `[data-ipmi-calendar-open]`                         | The View calendar button                                              |
| `[data-ipmi-calendar-dialog]`                       | Dialog root; accessible name references its visible heading           |
| `[data-ipmi-calendar-event]`                        | One noninteractive data item per unique Institute slug                |
| `data-slug`, `data-title`, `data-start`, `data-end` | Institute slug/title and date-only start/end bindings                 |
| `data-location`, `data-horizon`                     | Existing venue/location text and explicit native On the Horizon value |
| `data-url`                                          | Native current Institute URL; ignored for Horizon entries             |

Keep all runtime selectors and added styles scoped to this calendar. Consume the independent data list once per opening, deduplicate by slug and reject invalid/reversed ranges without breaking the rest of the grid. Treat blank end dates as incomplete data to fix, not permission to invent a duration.

## Ordered Chrome implementation checklist

1. [ ] In Chrome, open `/institutes` in Webflow Designer. Capture the current list/filter/pagination structure, breakpoints, native field labels, page custom code and deployed asset references.
2. [ ] Confirm the approved roster and date/location values via [35](35-calendar-content-through-2027.md). Record native field bindings and verify date formatting against visible event dates.
3. [ ] Add the View calendar trigger and dialog structure in Designer with a visible title, close control, month navigation, grid and day-details region. Add the independent native CMS data list with the bindings above.
4. [ ] Verify the CMS list contains all eligible records, including records outside the first six visible cards and all approved Horizon events through December 2027. Preserve the current listing's Finsweet attributes and behavior.
5. [ ] Identify the maintained source matching the deployed page/runtime before writing calendar code. Add a scoped runtime that implements date ranges, navigation and details without replacing the existing Institute filter initializer.
6. [ ] Implement keyboard support: Tab remains within the modal; arrow keys move among grid dates, Home/End move within the week, Page Up/Down change month within bounds, and Enter/Space selects a day. On open, focus the current/selected date; Escape or Close dismisses and returns focus to View calendar. Announce month changes and selected-day details accessibly.
7. [ ] Bind the dialog to isolated/versioned custom assets through Webflow's native settings in Chrome. Never overwrite the unversioned shared global CSS URL already used by production.
8. [ ] Publish only to **ipmi.webflow.io**, run the scenarios below and record screenshots, actual URLs and any blocked CMS rows in [37](37-staging-verification.md).

## Acceptance checks

- [ ] Calendar opens in the current month; current-month and December 2027 navigation bounds work.
- [ ] A record beyond the first visible six cards is present. The approved roster reconciles with the independent dataset without duplicates or pagination omissions.
- [ ] An event already in progress is included; ended events are excluded. Multi-day and overlapping events appear on every occupied day.
- [ ] Month/year crossings, leap/non-leap February lengths and empty months/days render correctly; invalid dates do not corrupt the grid.
- [ ] Event date ranges match CMS/display dates in different visitor timezones, including near midnight and daylight-saving transitions.
- [ ] Horizon entries show details without registration/event links; HIT 2027 follows this rule while its existing separate pre-registration page still works.
- [ ] Keyboard date navigation, focus containment, Escape dismissal and focus return work; screen-reader labels identify month, selected day and event details.
- [ ] At 320px, 390px, tablet and desktop widths, the day list stays below the grid with no horizontal overflow or clipped controls.
- [ ] Opening/closing/navigating the calendar leaves the existing listing filters, pagination and card links functional and preserves their state.
- [ ] Run meaningful date-range and state-transition tests in the maintained custom-code checkout plus its configured Vite+ checks/build. Record actual results, not presumed passes.

## Rollback

Restore the captured `/institutes` structure and previous page asset references, removing only the new dialog, trigger and independent data list. Revert the scoped runtime/style release if necessary; retain approved CMS event corrections unless separately identified as erroneous. Republish only staging and verify the original filter/list behavior.
