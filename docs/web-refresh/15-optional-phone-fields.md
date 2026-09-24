# 15 — Optional phone fields on contact and inquiry forms

[Back to master](README.md)

**Owner:** BWC / Webflow implementer. **Status:** Four native inquiry forms staged for review September 24, 2026. ActiveCampaign field, backend deployment, and controlled delivery verification remain pending. [Implementation and evidence](evidence/task15/README.md).

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
- [34](34-hit-2027-sam-routing.md) separately owns confirmation of HIT routing. Corrected baseline: CMS field `test` and rendered attendee/recipient inputs already contained `scolquhoun@ipmievents.com` before this task on staging and production. The earlier blank-field claim was incorrect. This task preserved that value; identity, authorization, all entry points, and delivery still require task 34.

## Acceptance checks

- [ ] Each applicable form contains one visible, properly labeled optional telephone field.
- [ ] Blank phone values and a sample international value such as `+44 20 7946 0958 ext 12` are accepted.
- [ ] Required fields still validate; category/event inputs and recipient routing retain their baseline behavior.
- [ ] The agreed test payload contains `Phone`; success/error messages remain reachable and legible.
- [ ] Desktop, tablet, mobile, keyboard focus, and accessible labels pass task 37.

The full acceptance boxes remain open because the provider form and actual delivery are not verified. The native subset is complete:

- [x] Contact, Attend, Horizon, and Institutes Template each have exactly one optional `Phone` telephone field after Email, associated visible label, unique ID, and `autocomplete="tel"`.
- [x] International formatting and blank optional validity verified without submitting; offline standard FormData serializes `Phone` unchanged. This is not proof of the actual Webflow webhook payload.
- [x] Existing field tags, required flags, recipients, inline scripts, form IDs and response settings preserved. Attend/Speak/Partner field visibility checked on desktop/mobile; Horizon/HIT retain their existing pre-registration presentation.
- [x] Form controls fit at 1440, 992, 991, 768, 767, 480, 479, 390 and 375px; keyboard focus and label association verified. Inherited 768px navigation overflow is recorded separately in task 37.
- [x] Published only to `ipmi.webflow.io`; production retains its previous fields and contains no new Phone input.
- [ ] ActiveCampaign Think Tank form 412: authenticated provider access, isolated staging form, provider-native Phone configuration and mapping.
- [ ] Apply/deploy reviewed backend mapping in a verified safe environment. A tested patch against express-server `ee1239b6cd175befd2d8e567006eacf636707d6b` is supplied; the backend repository/live webhook were not modified.
- [ ] Controlled destination test of blank and international Phone through CAPTCHA, Webflow storage/webhook, final notification and success/error states. No staff inquiry was sent.

## Rollback

Save the initial form/component structure and integration mappings. Remove only the new field and its explicit mapping if necessary; restore the recorded baseline. Do not overwrite recipient changes belonging to task 34.
