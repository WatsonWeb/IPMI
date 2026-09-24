# 29 — IPMI dependency: complete gallery image supply

[Back to master](README.md)

**Owner:** IPMI supplies/approves content; BWC maps and enters approved assets. **Status:** Provisional retained-content handoff complete; final client manifest/approval pending (September 24, 2026).

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

## September 24, 2026 — provisional retained-content handoff

**Status:** Provisional gallery handoff complete; final IPMI content approval pending. Under Bryan's placeholder override, retain the 40 appropriate existing main-Gallery photos in their current positions. No new image manifest was supplied; no CMS/Designer/asset changes or publication were necessary. Existing content was deliberately registered as temporary review content rather than replaced with fabricated images or duplicate records.

The [evidence and replacement instructions](evidence/task29/README.md) link the exact 40-row asset/CMS/caption/order manifest, all-79 preservation inventory, desktop/mobile screenshots and independent HTTP preservation comparison. Placeholder IDs **29-01–29-40** are registered in [PLACEHOLDERS](PLACEHOLDERS.md). All 40 thumbnail images loaded; all 40 full-size bindings match; four category carousels, keyboard controls and sampled desktop/mobile crops/lightboxes work. There are no event filters/reference fields to verify as event associations. Existing alt/label and visible Swiper-status issues remain task 19/37 follow-ups.

Acceptance: provisional inventory and operational checks complete; approved complete supply, rights, event associations, captions/alt and final order remain pending. Task 08 approved P11–P14 features and task 10 P18/P19 About records are preserved. Rollback: no website delta; revert only this task's documentation if required. Owned QA tab closed and viewport reset.
