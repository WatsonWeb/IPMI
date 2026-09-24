# 18 — Verify HIT 2027 pre-registration wording

[Back to master](README.md)

**Owner:** BWC / Webflow implementer. **Status:** Staged for review; HIT-only native text conditional verified September 24, 2026.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 1, HIT 2027 On the Horizon pre-registration wording request.
- [Healthcare IT Institute 2027](https://ipmi.webflow.io/institutes/hit-2027), its invitation section (`#invitation`), and event-specific template bindings.
- Institutes record `6a062fba0e49a14badf21c95`, slug `hit-2027`; June 6–8, 2027; `On the Horizon` is true in the research snapshot.

## Current state and intended result

Prior live inspection found **Pre-Register now** linking to `#invitation`, and the heading split as **Pre-Register For / Healthcare IT Institute / 2027**. Pre-registration therefore already exists; verify and adjust only the exact requested wording to read **Pre-Register for the Healthcare IT Institute 2027** in its natural reading order. Preserve intentional line breaks and styling if they remain readable.

Do not change every Institute's CTA. The existing HIT page may retain its pre-registration flow while [24](24-institutes-calendar.md) displays its Horizon calendar entry without a registration action. Correction: the native attendee recipient field `test` already contains `scolquhoun@ipmievents.com`, matching staging and production hidden attendee/recipient inputs. It was preserved; wording is not proof of successful delivery, which belongs to [34](34-hit-2027-sam-routing.md).

## Chrome / Webflow implementation checklist

1. Reopen HIT 2027 in Chrome, inspect the current CTA, heading, section anchor, form category, and record state; capture the pre-change values.
2. Locate the event-specific text binding/condition in the Institutes template and CMS. If the requested sentence already matches, record verification and make no duplicate change.
3. Correct only the HIT 2027 heading to the exact requested sentence if needed. Preserve the working `#invitation` destination and existing pre-registration CTA intent.
4. Preview HIT 2027 and another Institute to confirm event-specific behavior; inspect the Horizon listing/calendar separately without altering their action policy.
5. Verify form behavior only with the agreed test arrangement after task 34 is resolved, then publish to staging through [37](37-staging-verification.md).

## Acceptance checks

- [x] HIT 2027 heading reads “Pre-Register for the Healthcare IT Institute 2027”.
- [x] CTA reaches the visible invitation form, including on mobile and with keyboard navigation.
- [x] Other Institutes retain their existing event-specific heading/CTA behavior.
- [x] HIT page correction preserves all CTAs and leaves calendar Horizon policy to task 24.
- [x] Routing is linked to task 34 and reported independently; existing recipient preserved, actual delivery unverified.

## Rollback

Restore only the recorded HIT wording/binding and any event-specific visibility condition. Preserve existing date, Horizon status, and independently approved recipient settings.

## September 24, 2026 completion record

[Implementation, rollback, screenshots and acceptance evidence](evidence/task18/README.md). Native first-h3 Text conditional: Current Institute is HIT 2027 → `Pre-Register for the`; Else → original `Pre-Register For`. Existing title/year bindings, styling and form flow preserved. Only staging published. Desktop/tablet/mobile and keyboard anchor checks passed; another Horizon and a released Institute retain original behavior. Independent HTTP checks confirm form/image/link preservation and unchanged production wording. No placeholders or runtime-code changes. Task 34 delivery and task 24 calendar remain separate.
