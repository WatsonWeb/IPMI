# 31 — IPMI dependency: About IPMI gallery-linked images

[Back to master](README.md)

**Owner:** IPMI supplies/approves images and destinations; BWC implements. **Status:** Awaiting additional client image mappings; website changes not performed.

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
- [ ] Task 10's already supplied swaps are preserved or intentionally reconciled, without duplicated work.
- [ ] Linked photos are keyboard accessible and do not create nested interactive elements.
- [ ] Desktop/tablet/mobile crops and surrounding layout remain correct.
- [ ] Missing client assets or destination decisions remain visible dependencies.

## Rollback

Record original assets, wrappers, alt values, and hrefs. Restore only the affected image/link configuration; preserve the gallery records and unrelated approved About page changes.
