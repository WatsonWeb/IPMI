# 18 — Verify HIT 2027 pre-registration wording

[Back to master](README.md)

**Owner:** BWC / Webflow implementer. **Status:** Partially present on the site; verification and any targeted wording correction pending.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 1, HIT 2027 On the Horizon pre-registration wording request.
- [Healthcare IT Institute 2027](https://ipmi.webflow.io/institutes/hit-2027), its invitation section (`#invitation`), and event-specific template bindings.
- Institutes record `6a062fba0e49a14badf21c95`, slug `hit-2027`; June 6–8, 2027; `On the Horizon` is true in the research snapshot.

## Current state and intended result

Prior live inspection found **Pre-Register now** linking to `#invitation`, and the heading split as **Pre-Register For / Healthcare IT Institute / 2027**. Pre-registration therefore already exists; verify and adjust only the exact requested wording to read **Pre-Register for the Healthcare IT Institute 2027** in its natural reading order. Preserve intentional line breaks and styling if they remain readable.

Do not change every Institute's CTA. The existing HIT page may retain its pre-registration flow while [24](24-institutes-calendar.md) displays its Horizon calendar entry without a registration action. The attendee recipient was blank in the research snapshot; wording is not proof of working routing, which belongs to [34](34-hit-2027-sam-routing.md).

## Chrome / Webflow implementation checklist

1. Reopen HIT 2027 in Chrome, inspect the current CTA, heading, section anchor, form category, and record state; capture the pre-change values.
2. Locate the event-specific text binding/condition in the Institutes template and CMS. If the requested sentence already matches, record verification and make no duplicate change.
3. Correct only the HIT 2027 heading to the exact requested sentence if needed. Preserve the working `#invitation` destination and existing pre-registration CTA intent.
4. Preview HIT 2027 and another Institute to confirm event-specific behavior; inspect the Horizon listing/calendar separately without altering their action policy.
5. Verify form behavior only with the agreed test arrangement after task 34 is resolved, then publish to staging through [37](37-staging-verification.md).

## Acceptance checks

- [ ] HIT 2027 heading reads “Pre-Register for the Healthcare IT Institute 2027”.
- [ ] CTA reaches the visible invitation form, including on mobile and with keyboard navigation.
- [ ] Other Institutes retain their existing event-specific heading/CTA behavior.
- [ ] Calendar Horizon policy and HIT's existing page flow coexist without global CTA changes.
- [ ] Routing is linked to task 34 and reported independently; it is not marked verified while the recipient is unresolved.

## Rollback

Restore only the recorded HIT wording/binding and any event-specific visibility condition. Preserve existing date, Horizon status, and independently approved recipient settings.
