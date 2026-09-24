# 32 — IPMI dependency: Attend, Speak, and Sponsor gallery images

[Back to master](README.md)

**Owner:** IPMI supplies/approves images and mappings; BWC implements. **Status:** Awaiting additional client image mappings; website changes not performed.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 2, **On our end**: Attend, Speak, and Sponsor photos linked to Gallery.
- [Attend an Institute](https://ipmi.webflow.io/attend), its Attend, [Speak](https://ipmi.webflow.io/attend#speak), and [Partner/Sponsor](https://ipmi.webflow.io/attend#partner) sections, plus referenced gallery destinations. Confirm the current rendered anchors in Chrome before editing.
- [13](13-attend-photos.md) owns the specifically supplied swaps; this task covers the additional client photo set and gallery links.

## Current state and intended result

Use approved, audience-appropriate images across the three existing sections and connect the intended photos to the gallery. “Sponsor” in the source may correspond to the site's existing Partner section; reuse that section instead of creating a duplicate page. Keep the existing inquiry category/CTA behavior intact.

## Required IPMI inputs

For every photo provide original asset URL, section (Attend/Speak/Sponsor), exact position/order, replacement target or addition intent, approved subject/event context, gallery destination, and rights/attribution details. Identify which assets overlap task 13 and any destination gallery items still missing.

## Chrome / Webflow implementation checklist

1. Inventory the current three sections in Chrome, record anchors/photo positions, and reconcile the approved mapping with task 13.
2. Resolve each gallery destination against existing records; complete approved missing entries through [29](29-gallery-content-supply.md).
3. In Webflow Designer, replace the mapped assets in their existing wrappers and set only the intended gallery image links. Preserve Attend/Speak/Partner inquiry buttons and their category-changing behavior.
4. Apply alt text and accessible link naming with [19](19-photo-accessibility.md). Verify image crops and the photo group layout at all breakpoints.
5. Follow every changed photo link and test all three inquiry CTAs without submitting, then publish through [37](37-staging-verification.md).

## Acceptance checks

- [ ] Approved assets appear in the correct Attend, Speak, or Sponsor/Partner section and order.
- [ ] Each intended photo link reaches its exact approved gallery destination.
- [ ] Existing section anchors and inquiry-category selection still work.
- [ ] Linked image accessible names, desktop/mobile crops, and photo-group layout pass review.
- [ ] Task 13 content is reconciled; additional missing assets remain dependencies rather than substituted photos.

## Rollback

Save original assets, order, alt values, and link destinations for each section. Restore only the affected photo/link configuration and preserve inquiry buttons and unrelated copy/form changes.
