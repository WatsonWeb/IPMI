# Task 18 — HIT 2027 pre-registration evidence

Implemented September 24, 2026 in Chrome Webflow Designer as IPMI Webmaster. Staging only; this commit records the native Webflow delta, not an export of Designer state.

## Native delta and rollback

Institutes template `6392772fccd80e6d0e02600d`, HIT item `6a062fba0e49a14badf21c95`, slug `hit-2027`. Path: Details Section → Container → Details Columns → Request an Invitation → Pre-Pregister Subhead → first Details Subhead Pre-Register h3.

Before: static prefix `Pre-Register For`, followed by the existing `Global - Institute Title (No Year)` binding (`Healthcare IT Institute`) and year (`2027`). The wrapper already uses the Horizon visibility rule. The 44-field CMS schema contains no equivalent prefix override field.

After: the first h3 uses native **Text conditional**, Current Institute **is any** `210. HIT 2027`: `Pre-Register for the`; Else: original `Pre-Register For`. [Designer evidence](native-conditional.png). Visibility remains Visible; h3 tag and `details-subhead-pre-register _550` classes are unchanged. No new field, element, duplicated heading, custom code or stylesheet was needed. Existing title/year binding and wrapper conditions remain. The correction resolves server-side in published HTML.

Rollback only this prefix: remove its Text conditional and set the static text back to `Pre-Register For`. Preserve Visible, the title/year bindings, Horizon wrapper, all forms and prior task edits. Re-publish only staging. Exploratory visibility condition was removed before publication and baseline Visible restored.

## Publication and preservation

[Publish result](publish-result.png) shows `ipmi.webflow.io` selected and published a few seconds ago, `www.ipmievents.com` unchecked with its previous five-hours-ago publication. These exact destination choices were checked before publishing. No CMS Publish now or CMS item edits; unrelated records/drafts were preserved.

[Independent root HTTP comparison](task18-root-verification.json) verifies HIT, Horizon EHS January 2027 and released Healthcare Law & Compliance October 2026. Only HIT's prefix text changed. Complete forms, image tags and anchor tags are byte-identical to the post-task-15/16 baseline. Phone fields, public `info@ipmievents.com`, hidden recipients and existing category/routing data remain. Production HIT still has the original prefix. No unversioned CSS or runtime source changed.

## Browser acceptance

- [HIT desktop 1440×1000](hit-desktop.png): exact natural-reading sequence “Pre-Register for the Healthcare IT Institute 2027”; existing uppercase visual styling remains. Keyboard Enter on `Pre-Register now` reaches `#invitation`; next Tab enters `field-name`.
- [Tablet 768×1024](hit-tablet.png): heading and form fit. CTA click reaches invitation. The inherited document width of 790 from the navbar remains task 37; heading right edge is 651, inside the viewport.
- [Mobile 375×812](hit-mobile.png): prefix wraps naturally onto the first line; title/year on the second. No horizontal overflow (document width 375). Existing mobile CTA is `Request Invitation`, preserved; keyboard Enter reaches `#invitation`, next Tab enters `field-name`. Desktop `Pre-Register now` remains unchanged.
- [EHS Horizon comparison](ehs-horizon.png): original `Pre-Register For EHS Management Institute 2027` retained.
- [Released Institute comparison](released-institute.png): original `Request an Invitation` and Attend/Speak/Partner tabs retained; keyboard CTA reaches invitation.
- [Breakpoint measurements](breakpoint-checks.json) record current heading geometry. No inquiry or CAPTCHA submitted.

Task 24 owns the calendar Horizon action policy; this change only touches an Institute-page text conditional and preserves all CTAs. Task 34 owns routing approval and actual delivery. Corrected baseline: CMS field `test`, labeled `Form - Attendee Request E-mail Address`, already contains `scolquhoun@ipmievents.com`; published attendee/recipient inputs match. This address was preserved, and successful delivery remains unverified.

No placeholders applied. Temporary viewport override reset; owned QA tab closed; Designer left on HIT with no modal. Browser control released to the orchestrator.
