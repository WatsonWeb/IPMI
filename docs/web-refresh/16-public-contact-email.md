# 16 — Change the public general-contact email

[Back to master](README.md)

**Owner:** BWC / Webflow implementer. **Status:** Implementation specification; website changes not performed.

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

- [ ] Every inventoried general-contact occurrence displays `info@ipmievents.com` and links to the matching mailbox.
- [ ] No stale general-contact address remains in linked text, accessible labels, or CMS contact copy.
- [ ] Individual staff addresses, hidden `Recipient` fields, and form notification settings match their recorded baseline.
- [ ] Email links remain readable and operable at desktop and mobile widths.

## Rollback

Record prior text and href for each unique component or CMS record. Restore those exact values if needed; do not roll back independently approved staff/routing changes.
