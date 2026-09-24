# 03 Attend page attendee experience copy

Owner: Webflow implementer. Content owner: IPMI.

Status: Staged for review. Approved copy published only to ipmi.webflow.io; production remains unchanged.

[Back to master](README.md)

## Source and target

- [Copy to Edit.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQB-J292Wk3bSr5qa-ma4XvjAWwp5nq2sYY9Gg1g6ZAA6Zk?e=Z5tEbC): page 3, Attend attendee-experience row.
- Web Refresh Master To-Do: copy updates across all pages; source attachment is recorded in the master.
- [Attend page](https://www.ipmievents.com/attend), existing paragraph describing the IPMI Institute attendee experience. Confirm the exact Designer text element against the source screenshot before editing; the content's current full text and binding have not been recorded in this task.

## Approved replacement copy

> IPMI Institute Attendees receive a unique and unparalleled experience. With a range of engaging opportunities to connect with senior industry executives, encounter the latest strategies, and forge valuable business relationships, attendees customize their event experience by selecting thought leadership sessions, business meetings, and networking functions that directly relate to their goals and objectives.

Replace the existing attendee-experience paragraph with this copy. Keep Attend, Speak, and Sponsor/Partner actions and their destinations intact; this task does not supply replacement Speak or Sponsor copy.

## Chrome and Webflow implementation checklist

1. Open the published Attend page and the matching page in Webflow Designer in Chrome. Compare its existing attendee-experience section with page 3 of the source, then record the exact page URL, component/field, existing copy, and a screenshot.
2. Inspect whether the paragraph is static, a component property, or CMS-bound. Edit the existing source of that paragraph; preserve its heading and any separate CTA.
3. Paste the approved paragraph as a single paragraph, preserving the source's capitalization and punctuation. Avoid introducing a new rich-text wrapper or changing the surrounding typography.
4. Preview the paragraph at desktop, tablet, and mobile widths. Check nearby image overlap, section height, and CTA visibility.
5. Verify existing Attend, Speak, and Sponsor/Partner navigation and form-category selection still work. Publish only to staging, then record staging URL and comparison screenshots.

## Required fields and dependencies

No new fields or CMS schema. Requires access to the existing attendee-experience text. Coordinate with [13 Attend photos](13-attend-photos.md), [15 Optional phone fields](15-optional-phone-fields.md), and [32 Additional Attend, Speak, and Sponsor images](32-attend-speak-sponsor-images.md). [22 Chatbot knowledge](22-chatbot-knowledge-and-training.md) should ingest the accepted updated page.

## Acceptance checks

- [x] The existing attendee-experience paragraph exactly matches the approved copy.
- [x] Target page URL and actual edited element/component/CMS field are recorded.
- [x] No unrelated Speak, Sponsor, heading, or CTA text was replaced.
- [x] Copy is readable without truncation or image/CTA overlap at all three viewport sizes.
- [x] Existing navigation and visible form-category selection remain correct; hidden-field and delivery verification limits are recorded below.
- [x] Staging evidence is recorded for [37 Integrated verification](37-staging-verification.md).

## Rollback

Restore the captured original paragraph in its original binding and republish staging. Recheck the surrounding CTA and layout; retain all unrelated image/form changes made by their own tasks.

## Implementation evidence — September 23, 2026 (September 24 UTC)

Editor: Codex task 03 worker, Chrome Webflow Designer, IPMI / IPMI Webmaster. No placeholders were needed. Task 01–02 changes were preserved.

- Page: Attend an Institute, `/attend`, Webflow page ID `63c3cdd3cff81805b2fec9e4`.
- Edited source: existing static Rich Content block, class `rich-content no-max-width w-richtext`, element ID `ce38fc5f-2bf7-08bd-2e75-0762b96d65e8`, inside Attend Section → Card → Card Content Wrap. This is not a CMS field or component property.
- Original content was two paragraphs in this block (captured directly from Designer):

  > Attendees of IPMI events receive a unique and unparalleled experience. Institutes provide a range of engaging opportunities to connect with senior industry executives, encounter the latest strategies, and forge valuable business relationships.

  > Attendees customize their event experience by selecting thought leadership sessions, business meetings, and networking functions that directly relate to their strategic goals.

- Replaced both paragraphs with the single approved paragraph above using the existing rich-text editor. No new wrapper or typography changes. Exact `textContent` matched in Designer and published staging; the existing terminal line break remained.
- Staging publish dialog showed only `ipmi.webflow.io` checked and `www.ipmievents.com` unchecked. Completion showed staging published a few seconds ago while production retained its earlier publication time.
- Review URL: [Attend on staging](https://ipmi.webflow.io/attend#attend). Live production still contained the original first paragraph and no approved replacement after staging publication.
- Visual screenshots were inspected in the task conversation at 1440 × 1000 desktop, 768 × 1024 tablet, and 390 × 844 mobile. The complete copy was readable, with the adjacent desktop image or stacked tablet/mobile images clear of the text. The existing registration CTA remained usable; mobile document width and viewport width both measured 390px.
- Heading text and CTA labels/IDs/destinations were retained. `attend-button`, `speak-button`, and `partner-button` still point to `#invite`; each clicked through to the form and selected its matching visible active category. Direct Attend/Speak/Partner category tabs also switched correctly. The Speak and Partner rich-text contents exactly matched production in a read-only comparison.
- **Verification limit for task 15 / integrated verification:** browser DOM inspection reported an empty `.value` and absent `value` attribute on hidden `field-category` in both staging and production, including after a production Speak selection. Visible category selection worked. The lead independently confirmed the entire published form markup is byte-identical to the pre-edit public baseline (whose source contains `value="Attend"`). This observation does not establish a new regression or successful submitted payload. No form, CAPTCHA, or message was submitted; delivery remains untested.
- No application code or shared assets changed, so application tests were not rerun for this browser-only text edit. Documentation formatting was checked with `vp fmt`.
- Chrome responsive overrides were cleared; Designer is left on Attend at desktop with the publish dialog closed. Browser control is released for the next sequential worker.

### Exact rollback delta

Restore the two original paragraphs above in Rich Content `ce38fc5f-2bf7-08bd-2e75-0762b96d65e8`, preserving the existing wrapper and terminal line break, then publish only to staging. Original paragraph IDs were `f9980357-165c-f89c-3b87-7b4accc2438e` and `cd480554-387e-cf15-7d5a-c10d03fba62a`; the first remains in the edited block. Do not restore a whole site backup or revert tasks 01–02. Production publication is not part of this task.
