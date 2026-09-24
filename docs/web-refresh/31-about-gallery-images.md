# 31 — IPMI dependency: About IPMI gallery-linked images

[Back to master](README.md)

**Owner:** IPMI supplies/approves images and destinations; BWC implements. **Status:** Provisional handoff verified September 24, 2026. Six existing gallery-linked placements retained and inventoried; final additional image/destination approval pending. No website mutation or publication needed.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 2, **On our end**: About IPMI images linked to gallery.
- [About IPMI](https://ipmi.webflow.io/about), its photo elements/reusable blocks, and the existing **Gallery Photos** collection where a gallery item is required.
- The specific already-supplied replacement images are mapped in [10](10-about-ipmi-photos.md); this task covers additional client supply and gallery linking.

## Current state and intended result

The About page already has imagery. Apply additional approved content to precisely identified page positions and make the intended photos useful links to their approved gallery destinations. Preserve page structure, image positioning, and responsive crops unless the approved mapping expressly changes them.

## Required IPMI inputs

Supply each original asset/download link, intended About page section/position, whether it replaces a named current image or adds to an existing photo group, approved event/subject context, exact gallery destination, ordering, and any attribution/usage conditions. Identify gallery records still needing creation and mark the set complete or partial.

## Chrome / Webflow implementation checklist

1. Reconcile the supplied mapping with task 10 and live About image elements in Chrome. Record exact existing element/component and asset per approved row.
2. Match each gallery destination to an existing gallery item/page. Use [29](29-gallery-content-supply.md) for approved new gallery content; do not invent a destination.
3. In Webflow Designer, replace/add the approved assets using current image wrappers. Add the verified gallery destination on the intended link wrapper without creating nested links.
4. Set alt text and an accessible destination name under [19](19-photo-accessibility.md). Retain responsive crop/focal positioning and check hover/focus styling.
5. Preview every updated linked image and its destination, then publish only through [37](37-staging-verification.md).

## Acceptance checks

- [ ] Each approved row has an exact About position, asset, and working gallery destination.
- [x] Task 10's already supplied swaps are preserved or intentionally reconciled, without duplicated work.
- [ ] Linked photos are keyboard accessible and do not create nested interactive elements.
- [ ] Desktop/tablet/mobile crops and surrounding layout remain correct.
- [x] Missing client assets or destination decisions remain visible dependencies.

## September 24 provisional retention and verification

No additional asset/destination manifest was supplied. Retained the four appropriate existing carousel photos as provisional content and preserved approved task 10 P16–P19. No empty placement, fabricated image, duplicate CMS record, or guessed gallery URL was introduced. Existing links open the six-item **About** lightbox; they do not navigate to `/gallery` or individual Gallery Photos template pages. This is a functioning current destination, not evidence of IPMI approval for the final requested linking behavior.

The [exact six-row manifest](evidence/task31/retained-about-manifest.json) records actual asset URLs, CMS IDs and fields, rendered position/order, wrapper, href, thumbnail alt, and full-size destination. [Verification and replacement instructions](evidence/task31/README.md) include responsive screenshots and rollback. Mission rows 31-01/02 remain approved task 10 assets; only their additional destination decision is pending. Rows 31-03–06 are provisional retained carousel content.

Keyboard launch, viewer navigation/close, focus return and carousel controls worked; no nested interactive elements were found. Descriptive names/full-size alt and the carousel's inherited `role=listitem` semantics remain task 19, so comprehensive accessibility acceptance remains open. Image crops passed at 1440, 768 and 390px; the inherited 768px shared-navigation overflow and visible Swiper status text remain task 37. Final approved-row/destination acceptance remains pending IPMI's manifest.

## Rollback

Record original assets, wrappers, alt values, and hrefs. Restore only the affected image/link configuration; preserve the gallery records and unrelated approved About page changes.
