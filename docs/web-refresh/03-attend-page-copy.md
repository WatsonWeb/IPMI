# 03 Attend page attendee experience copy

Owner: Webflow implementer. Content owner: IPMI.

Status: Ready for implementation. Documentation only; no website edits performed.

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

- [ ] The existing attendee-experience paragraph exactly matches the approved copy.
- [ ] Target page URL and actual edited element/component/CMS field are recorded.
- [ ] No unrelated Speak, Sponsor, heading, or CTA text was replaced.
- [ ] Copy is readable without truncation or image/CTA overlap at all three viewport sizes.
- [ ] Existing navigation and form-category behavior remains correct.
- [ ] Staging evidence is recorded for [37 Integrated verification](37-staging-verification.md).

## Rollback

Restore the captured original paragraph in its original binding and republish staging. Recheck the surrounding CTA and layout; retain all unrelated image/form changes made by their own tasks.
