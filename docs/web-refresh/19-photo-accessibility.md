# 19 — Photo alternative text and accessibility

[Back to master](README.md)

**Owner:** BWC / Webflow implementer; IPMI confirms uncertain people/event identities. **Status:** Staged for review September 24, 2026. P01–P27 and all 67 active Gallery Photos records / 97 placements audited; native descriptions, linked names, full-size viewer alternatives and focus verified. [Exact audit and evidence](evidence/task19/README.md). Later supplied images require the same audit; three concurrent KBYG image-description follow-ups are assigned to task 37.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 1, photo alt-text/accessibility request; [Photo Changes](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U), page-by-page replacement mappings.
- All images replaced by [05](05-homepage-photos.md), [06](06-upcoming-institutes-photos.md), [07](07-recent-institutes-photo.md), [08](08-gallery-feature-photos.md), [09](09-think-tanks-photo.md), [10](10-about-ipmi-photos.md), [11](11-testimonials-photos.md), [12](12-faq-photos.md), [13](13-attend-photos.md), and [14](14-contact-photo.md); also supplied gallery images in tasks [29](29-gallery-content-supply.md)–[32](32-attend-speak-sponsor-images.md).
- Webflow Assets, individual image elements, CMS image bindings, linked image cards, and responsive variants.

## Current state and intended result

Image replacements can inherit stale or generic text. Inspect each final image in context: give informative images concise, accurate descriptions; set decorative/redundant images to empty alt text. Do not invent names, companies, venue, or event identity from appearance. A linked image needs an accessible link name describing its destination; duplicated adjacent text should not be read twice unnecessarily.

## Chrome / Webflow implementation checklist

1. Build the audit checklist from the final photo mappings in tasks 05–14 and approved additional-gallery inputs. Record page, image/component, asset, current alt, intended role, and proposed replacement alt.
2. View every asset and its surrounding copy in Chrome. Write factual descriptions based on visible content and confirmed source metadata; flag uncertain proper names for IPMI.
3. Update Webflow element alt text or the actual CMS alt binding. Set decorative elements to decorative/empty alt; do not use a filename or the word “image” as a substitute description.
4. Check reused assets in every distinct context rather than assuming one asset-level description suits all uses. Inspect desktop/mobile variants, gallery thumbnails/full images, and linked cards.
5. Preview accessible names and reading order; verify final rendered markup after staging publication via [37](37-staging-verification.md).

## Inputs and dependencies

Approved photo mappings and final asset selection are dependencies. IPMI must confirm identities only when a description requires them. [17](17-chair-sponsor.md) supplies the chair Partner identity; its logo alt can use the approved organization name.

## Acceptance checks

- [x] Every changed informative image has accurate alt text matching the final image and context.
- [x] Decorative images have empty alt text and do not add redundant announcements.
- [x] Linked images/cards have a meaningful accessible name; visible text and alt do not unnecessarily repeat.
- [x] No stale person/event names, filenames, or guessed identities remain in changed images.
- [x] Responsive variants and CMS-rendered gallery images receive the same audit.

These checks cover the approved P01–P27 set and retained active Gallery Photos inventory. Tasks 29–32 still require final content approval; this accessibility pass does not approve those assets as new supplied content. The chair demonstration remains an explicitly labeled placeholder. Concurrent external KBYG edits are preserved, with exact remaining descriptions in the evidence handoff.

## Rollback

Retain the audit's previous alt values and asset/element mappings. Restore only the affected descriptions or bindings; do not undo the approved photo swaps unless their own task requires rollback.
