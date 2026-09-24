# 30 — IPMI dependency: additional FAQ content and gallery images

[Back to master](README.md)

**Owner:** IPMI supplies/approves content; BWC enters the approved updates. **Status:** Awaiting additional client content; website changes not performed.

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

Extend the existing FAQ content only with supplied, approved material. Preserve current anchor IDs, accordion behavior, and approved changes from task 04. Photos must link to their intended gallery destination rather than a guessed event or generic URL chosen without source support.

## Chrome / Webflow implementation checklist

1. Match approved questions to live FAQs records in Chrome and reconcile against task 04 to avoid overwriting its approved copy.
2. Record existing fields, item IDs/slugs, anchors, and order. Edit matched CMS items or create only the explicitly new questions using existing fields.
3. Match approved images to page positions and gallery records. Complete any missing gallery entry through [29](29-gallery-content-supply.md) before wiring its link.
4. In Webflow Designer/CMS, add the approved images and exact gallery links; apply contextual alt/link names from [19](19-photo-accessibility.md).
5. Preview FAQ reading order, anchors, accordion states, and links across desktop/mobile; publish only through [37](37-staging-verification.md).

## Acceptance checks

- [ ] Every approved copy row maps to its intended existing/new FAQ without duplicate questions.
- [ ] Existing public anchors and the task 04 rewrites remain correct.
- [ ] Every additional photo matches its approved position and opens the specified gallery destination.
- [ ] Images and question/answer layout work responsively; accessible link and accordion names remain useful.
- [ ] Missing copy/assets/destinations remain explicitly pending rather than filled with speculative content.

## Rollback

Save old FAQ text, order, slugs/anchors, image assets, and destinations. Restore only the affected fields; keep newly added items unpublished if rolled back and preserve unrelated task 04/12 updates.
