# 32 — IPMI dependency: Attend, Speak, and Sponsor gallery images

[Back to master](README.md)

**Owner:** IPMI supplies/approves images and mappings; BWC implements. **Status:** Provisional handoff — 19 existing section photos deliberately retained and 38 desktop/mobile lightbox placements verified; final assets/destination approval pending. No website mutation or publication.

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
- [x] Existing section anchors and inquiry-category selection still work (September 24 desktop/mobile checks; no submission).
- [ ] Linked image accessible names, desktop/mobile crops, and photo-group layout pass review.
- [ ] Task 13 content is reconciled; additional missing assets remain dependencies rather than substituted photos.

## Rollback

Save original assets, order, alt values, and link destinations for each section. Restore only the affected photo/link configuration and preserve inquiry buttons and unrelated copy/form changes.

## September 24, 2026 provisional handoff

Bryan's placeholder instruction permits retaining suitable existing imagery. The existing session, speaker, networking and business-meeting photographs were retained across Attend (6), Speak (6), and Partner/Sponsor (7). No supplied task 13 hero was replaced and no duplicate Sponsor section was created. All 19 CMS records have two responsive placements. The [exact per-record manifest](evidence/task32/retained-attend-manifest.json) records both placements, asset URLs, original CMS fields, captions/alts, order, current lightbox destinations, replacement requirements and rollback. Register IDs are `32-01`–`32-19`.

Chrome testing opened all 38 placements by keyboard and verified the matching full-size image loaded. Desktop Speak has individual ungrouped lightboxes; those destinations work and were preserved. Other wrappers use their existing named groups. The separate View Gallery buttons retain `/gallery`; photo clicks currently open full-size lightboxes, not dedicated Gallery records/pages. IPMI must explicitly confirm the intended final destination per row.

All three inquiry CTAs selected the expected visible Attend/Speak/Partner category at desktop and 390px. No personal data was entered, CAPTCHA handled, or form submitted; backend payload/routing/delivery was not tested. Existing optional Phone, task 03 copy, task 13 P24/P25 assets and task 16 public footer were preserved. Read-only source comparison also found the full form and all image/anchor/script/input/form tags unchanged.

Representative crops were visually checked at 1440, 390 and 768px, with geometry checks at 375, 767, 768 and 1024px. Generic `open lightbox` names, empty full-size alts, and a missing visible focus outline remain task 19; the inherited 768px navigation overflow (790px document width) remains task 37. These prevent claiming full accessibility/integrated acceptance here. See [evidence, exact replacement procedure and limits](evidence/task32/README.md). Final approved imagery, rights, factual captions and destination/order decisions remain pending. No Webflow rollback is needed because this task changed only documentation/evidence.
