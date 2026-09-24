# 15 — Optional phone fields on contact and inquiry forms

[Back to master](README.md)

**Owner:** BWC / Webflow implementer. **Status:** Implementation specification; website changes not performed.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 1, request to add phone numbers to contact forms. The accepted plan makes phone optional.
- Webflow pages [Contact](https://ipmi.webflow.io/contact), [Attend](https://ipmi.webflow.io/attend), [Institutes on the Horizon](https://ipmi.webflow.io/institutes-on-the-horizon), the Institutes collection template including [HIT 2027](https://ipmi.webflow.io/institutes/hit-2027), and inquiry forms on the Think Tanks collection template. Include the Attend, Speak, and Partner category states of shared inquiry forms. Record actual template URLs during the form inventory.
- Local reference: `Page HTML/Attend An Institute/Attend-Footer.html` and `Page HTML/Institute Single/Institute-Footer.html` update `#field-category` and `#field-recipient` when category changes. These are legacy references; compare them with the current Webflow embeds before editing any code.

## Current state and intended result

The Contact form was inspected as native Webflow form `wf-form-Contact-Form`, with no custom action, hidden `#field-recipient` named `Recipient`, required `#field-name` (name `name`, text) and `#field-email` (name `Email`, email), optional `Message` textarea, reCAPTCHA, and **Send Inquiry** submit control. Phone was absent. HIT 2027's **Invitation Request** form likewise had name, email, title, company, size, and comments fields but no phone. Other templates' runtime endpoints were not verified; inventory each before editing and do not assume all instances are shared.

Add one optional `type="tel"` input per applicable form, with visible label **Phone number (optional)**, submission field name `Phone`, unique ID within its page, and `autocomplete="tel"`. Reuse the current field wrapper and typography. Do not require a national format or strip international `+`, spaces, parentheses, or extensions.

Existing required fields, category visibility, hidden recipient/category/event inputs, CAPTCHA, success/error states, submission destination, and integration mapping must remain functional. Public email replacement in [16](16-public-contact-email.md) does not authorize changing notification recipients.

## Chrome / Webflow implementation checklist

1. In Chrome, open the IPMI Webflow Designer and inventory the target forms and their shared components. Record each form name, existing fields, hidden inputs, current recipients, and submit/integration settings.
2. Add the optional telephone field after Email in each unique form/component. Set a matching label `for` and input ID, then inspect each reused instance.
3. Confirm the new wrapper remains visible for Attend, Speak, and Partner unless the source explicitly excludes that form. Preserve all existing category handlers and event selection logic.
4. Inspect the submission/integration field mapping and add `Phone` only where an explicit mapping is required. Preserve every other mapping and routing rule.
5. Preview every category on desktop and mobile. Coordinate real submission verification with [37](37-staging-verification.md) using the agreed test destination; do not send test inquiries to staff by default.
6. Publish through the staging-only verification procedure in task 37.

## Inputs and dependencies

- An agreed test destination and access to inspect the actual submission payload are required for routing verification.
- [34](34-hit-2027-sam-routing.md) separately owns the unresolved HIT 2027 attendee recipient. Do not silently fill it while adding the phone field.

## Acceptance checks

- [ ] Each applicable form contains one visible, properly labeled optional telephone field.
- [ ] Blank phone values and a sample international value such as `+44 20 7946 0958 ext 12` are accepted.
- [ ] Required fields still validate; category/event inputs and recipient routing retain their baseline behavior.
- [ ] The agreed test payload contains `Phone`; success/error messages remain reachable and legible.
- [ ] Desktop, tablet, mobile, keyboard focus, and accessible labels pass task 37.

## Rollback

Save the initial form/component structure and integration mappings. Remove only the new field and its explicit mapping if necessary; restore the recorded baseline. Do not overwrite recipient changes belonging to task 34.
