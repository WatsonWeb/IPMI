# 29 — IPMI dependency: complete gallery image supply

[Back to master](README.md)

**Owner:** IPMI supplies/approves content; BWC maps and enters approved assets. **Status:** Awaiting complete client image manifest; website changes not performed.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 2, **On our end**: all gallery images.
- [Gallery](https://ipmi.webflow.io/gallery), the existing **Gallery Photos** CMS collection (77 records in the research snapshot), and the relevant event/gallery references. This additional supply is separate from the approved feature-photo replacements in [08](08-gallery-feature-photos.md).

## Current state and intended result

The site already has gallery content. Obtain a complete approved set and explicit placement instructions; update existing matching records before creating new ones. Do not replace the whole gallery, remove existing images, infer event identities, or invent missing assets simply because the supplied set is incomplete.

## Required IPMI inputs

Provide a manifest containing each original-quality asset/download link, filename, event/Institute name and slug, intended gallery/category, caption or descriptive context, desired order, and whether it adds to or replaces a named existing image. Include approved usage/attribution details where applicable and identify any explicit removals. State whether the manifest is complete or still partial.

## Chrome / Webflow implementation checklist

1. Reconcile the approved manifest with current Gallery Photos items and event references in Chrome; record existing record IDs/slugs, additions, replacements, and unresolved matches.
2. Inspect final images and prepare alt descriptions with [19](19-photo-accessibility.md). Deduplicate identical supplied assets against existing uploads.
3. In Webflow Assets/CMS, upload only missing approved files and update the matched records using their current image, caption, event/reference, and ordering fields. Inspect live field names before entering content; no schema expansion is assumed.
4. Create a new CMS item only where the manifest identifies a new gallery entry. Keep unresolved assets unentered and do not delete existing items without an explicit removal instruction.
5. Verify thumbnails, full-size/lightbox destinations, associated event filters, image order, and responsive crops; publish only through [37](37-staging-verification.md).

## Dependencies and acceptance

- [ ] The approved manifest states its completeness and every asset has a destination/event association.
- [ ] Every approved row maps to one existing or newly required Gallery Photos record without accidental duplication.
- [ ] Supplied photo/caption/attribution/alt and display order match the approved manifest.
- [ ] Gallery filters, linked full-size images, desktop/mobile crops, and image loading work on staging.
- [ ] Unprovided content remains a visible dependency; approved feature swaps in task 08 are tracked independently.

## Rollback

Record each affected CMS item's original asset, metadata, references, and order. Restore replacements/references as needed; unpublish newly added items before considering deletion. Preserve original image assets during review.
