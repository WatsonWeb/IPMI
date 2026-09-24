# 16 — Change the public general-contact email

[Back to master](README.md)

**Owner:** BWC / Webflow implementer. **Status:** Staged for review — September 24, 2026.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 1, general-contact email domain change; accepted replacement: **info@ipmievents.com**.
- Primary target: [Contact](https://ipmi.webflow.io/contact). Also inspect the shared Footer and general-contact text/links in static pages, CMS rich text, and reusable contact components.

## Current state and intended result

Live research found the old public address **Info@IPMIOnline.com** in the Contact page body and shared footer. Replace the public general-contact email wherever it is shown with `info@ipmievents.com`, and use `mailto:info@ipmievents.com` for its link destination. Preserve any intentional subject/body parameters. An address inside a staff profile, speaker bio, form notification setting, hidden recipient input, or event-specific contact is a different purpose and must not be changed by a global text replacement. The master document's `editor@ipmionline.com` account note is not public-contact replacement copy.

## Chrome / Webflow implementation checklist

1. Inventory public general-contact occurrences in Chrome and record page/component, existing visible value, destination, and whether the occurrence is shared.
2. Open each unique source in Webflow Designer/CMS and change both visible general-contact text and its mailto destination. Recheck all shared component instances.
3. Inspect accessible link labels and contact icons/tooltips for a stale general-contact address.
4. Preview the contact page and representative footer instances, then publish to staging using [37](37-staging-verification.md).
5. Revisit the staging pages and inspect the resolved link destinations without sending an email.

## Inputs and dependencies

- No additional copy approval is required for the accepted replacement address.
- [28](28-activecampaign-domain.md) covers ActiveCampaign domain verification; [34](34-hit-2027-sam-routing.md) covers Sam's attendee routing. Neither is implied by a public text change.
- Save unresolved non-general addresses in the implementation record with their purpose rather than guessing replacements.

## Acceptance checks

- [x] Every inventoried general-contact occurrence displays `info@ipmievents.com` and links to the matching mailbox.
- [x] No stale general-contact address remains in the sampled public links, accessible labels, or CMS page contact copy; inventory scope is recorded below.
- [x] Individual staff addresses, hidden `Recipient` fields, and form notification settings preserved; all four complete published inquiry form blocks match the post-task-15 baseline.
- [x] Email links remain readable and keyboard accessible at desktop and mobile widths.

## Rollback

Record prior text and href for each unique component or CMS record. Restore those exact values if needed; do not roll back independently approved staff/routing changes.

## Implementation record

September 24, 2026, Codex task-16 worker using Chrome Designer as IPMI Webmaster. Changed two unique sources: shared Footer component Base variant (Designer reports 23 instances), and Contact page `63c3829b2405e78449d8cae5` → Contact Section → Contact Info → first Footer List Item → Footer Contact Link. Both previously displayed `Info@IPMIOnline.com` and used `mailto:Info@IPMIOnline.com`; both now display `info@ipmievents.com` and use `mailto:info@ipmievents.com`. Subject was blank and neither had body parameters or custom accessible labels. These are static link values, not CMS/property bindings; shared Footer image property remains intact.

Published only `ipmi.webflow.io`, with `www.ipmievents.com` visibly unchecked. [Contact staging](https://ipmi.webflow.io/contact#contact). Desktop Contact/Home and mobile Contact/HIT shared-footer checks passed. Independent HTTP checks passed on 23 routes, including static, CMS and four KBYG pages. Privacy's existing current-domain body link was retained. Complete Contact, Attend, Horizon and HIT form markup remains byte-identical to the post-task-15 baseline, including optional Phone and hidden routing. No form/provider/editor account/CMS content or unversioned CSS was edited, and no email was sent. No placeholders needed.

See [evidence, preservation checks and exact rollback](evidence/task16/README.md). Production remains unchanged; tasks 28 and 34 remain separate.
