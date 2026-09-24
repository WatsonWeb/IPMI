# 34 — IPMI dependency: HIT 2027 attendee inquiries routed to Sam

[Back to master](README.md)

**Owner:** IPMI supplies Sam's exact destination and routing requirements; BWC configures and verifies approved routing. **Status:** Awaiting recipient details and integration verification; routing not implemented.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 2, **On our end**: all Attend inquiries for HIT 2027 go to Sam.
- [Healthcare IT Institute 2027](https://ipmi.webflow.io/institutes/hit-2027), invitation form, and any existing event-aware inquiry route that submits `hit-2027` as an Attend selection.
- Institutes item `6a062fba0e49a14badf21c95`, slug `hit-2027`. Its attendee recipient was blank in the research snapshot; the actual live submission-routing mechanism remains to be verified.

## Current state and intended result

Send HIT 2027 **Attend** inquiries to the exact IPMI-approved Sam destination. Do not infer an address from Sam's name, substitute the public `info@ipmievents.com` mailbox, or claim a hidden field alone guarantees delivery. Preserve Speak/Partner routing and other events' recipients. The existing pre-registration heading/CTA is handled separately by [18](18-hit-2027-pre-registration.md).

## Required IPMI inputs

- Sam's exact approved destination address or approved integration recipient identifier.
- Confirmation that this applies to all HIT 2027 Attend/pre-registration entry points, plus any intentional copy/backup recipients.
- The intended system of delivery (native Webflow notifications, automation/webhook, or another existing integration) and access/evidence to verify it.
- An agreed test destination or controlled delivery-verification arrangement, with no unsolicited test email to staff.

## Chrome / Webflow implementation checklist

1. Inventory current HIT 2027 form inputs, event/category values, initial recipient, category-change logic, notification settings, and integrations in Chrome. Inspect the generic Attend and Horizon entry points for event-aware HIT routing rather than assuming they use the same mechanism.
2. Trace the submitted event/category to its actual delivery configuration. Record the canonical setting/field and existing fallback behavior; if no event-aware route exists, identify the minimal scoped integration change before editing.
3. Configure the approved Sam destination for `hit-2027` + Attend at the actual routing source. Preserve current staff/event routes and ensure switching Attend → Speak/Partner → Attend resets to the correct recipient without leaking another category's value.
4. Coordinate with [15](15-optional-phone-fields.md) so new phone values travel through the same payload. Check every applicable HIT entry point with the agreed test arrangement.
5. Record payload and delivery evidence without personal submission content, then stage through [37](37-staging-verification.md). Mark unresolved delivery verification as pending even if the CMS field is populated.

## Acceptance checks

- [ ] Sam's destination and actual delivery mechanism are recorded and approved.
- [ ] HIT 2027 Attend inquiries from all applicable entry points reach the intended route in controlled verification.
- [ ] Initial load and category switching set the correct recipient; empty or stale recipient values cannot silently reroute an inquiry.
- [ ] Speak/Partner routes and other Institutes remain unchanged.
- [ ] Public-email and heading updates are reported independently from delivery success.

## Rollback

Record the former CMS recipient, hidden-input bindings, and integration rule/configuration. Restore the exact routing baseline if required and flag the unresolved HIT attendee route; never replace it with a guessed fallback mailbox.
