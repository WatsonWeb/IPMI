# 30 — IPMI dependency: additional FAQ content and gallery images

[Back to master](README.md)

**Owner:** IPMI supplies/approves content; BWC enters the approved updates. **Status:** Provisional staging example and image handoff complete; final IPMI content approval pending.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 2, **On our end**: FAQ content and images, with photos linked to the gallery.
- [FAQ](https://ipmi.webflow.io/faq), existing **FAQs** collection (7 records in the research snapshot), page image elements, and relevant **Gallery Photos** records.
- Existing supplied answer rewrites are in [04](04-faq-copy.md); specific supplied image swaps are in [12](12-faq-photos.md). This dependency covers additional client material only.

## Required IPMI inputs

| Content       | Required details                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| FAQ copy      | Exact approved question and answer, new vs replacement item, existing question/slug when replacing, category/order, and any links. |
| Images        | Original asset links, intended FAQ page position or question association, descriptive context, and usage/attribution information.  |
| Gallery links | Exact gallery item/page or approved gallery destination for each linked photo; identify missing gallery entries.                   |
| Completion    | Which rows are approved/final and which remain pending.                                                                            |

## Current state and intended result

Use approved material where supplied. Bryan's September 23 placeholder instruction permits a visibly temporary staging example for missing additional copy. Preserve current anchor IDs, accordion behavior, and approved changes from task 04. Photos must retain verified destinations until replacement assets and associations are approved.

## Chrome / Webflow implementation checklist

1. Match approved questions to live FAQs records in Chrome and reconcile against task 04 to avoid overwriting its approved copy.
2. Record existing fields, item IDs/slugs, anchors, and order. Edit matched CMS items or create only the explicitly new questions using existing fields.
3. Match approved images to page positions and gallery records. Complete any missing gallery entry through [29](29-gallery-content-supply.md) before wiring its link.
4. In Webflow Designer/CMS, add the approved images and exact gallery links; apply contextual alt/link names from [19](19-photo-accessibility.md).
5. Preview FAQ reading order, anchors, accordion states, and links across desktop/mobile; publish only through [37](37-staging-verification.md).

## Acceptance checks

- [x] Seven existing FAQ field sets preserved exactly; one explicitly temporary example appended at order 999.
- [x] Existing public anchors and task 04 rewrites preserved; task 12 hero image tags unchanged.
- [x] Existing 5/3/5 gallery references retained and mapped to exact assets/captions/lightbox URLs.
- [x] New example works at desktop, tablet and mobile sizes and with keyboard; existing accordion/lightbox checks passed.
- [ ] Final additional copy, imagery, associations and rights approved by IPMI. Existing generic lightbox names and full-size alt limitations remain task 19; inherited tablet navigation overflow remains task 37.

## Rollback

Save old FAQ text, order, slugs/anchors, image assets, and destinations. Restore only the affected fields; keep newly added items unpublished if rolled back and preserve unrelated task 04/12 updates.

## September 24, 2026 staging completion

Created FAQ `6ab4dcb7c6fcf3d14c3706d1` through Chrome CMS, queued it for the next site publish, then published only `ipmi.webflow.io` after verifying the custom-domain checkbox was unchecked. No immediate CMS Publish now action was used. Exact new fields and rollback are in [task evidence](evidence/task30/README.md), [before/after snapshots](evidence/task30/faq-items-after.json), and the [placeholder register](PLACEHOLDERS.md). The visible question is `Placeholder question — replace with approved FAQ?` (the existing template adds the question mark); answer is `Placeholder: the approved answer will be added here.`

The existing 13 gallery placements remain provisional: [exact 5/3/5 reference manifest](evidence/task30/retained-faq-images.json). No photo, gallery record, approved answer, original order or anchor was replaced. Independent CMS and HTTP checks confirm preservation and absence of the placeholder on production. Final client content acceptance remains pending.
