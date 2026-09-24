# Task 29 — retained gallery evidence

September 24, 2026. Task 29 deliberately retains the existing appropriate gallery imagery as provisional content under Bryan's placeholder instruction. No CMS, Designer, asset, schema, code, or publication change was made. This is a reviewable replacement handoff, not new client approval.

- [Exact 40-row replacement manifest](retained-gallery-manifest.json): placeholder IDs 29-01–29-40, CMS IDs/slugs, categories, displayed/global and within-category order, CMS sort values, original and rendered asset URLs, exact captions/alt, lightbox destinations/groups, prior values and required replacement.
- [All 79 CMS records preserved](cms-preservation-inventory.json): original fields and main-Gallery membership. 40 main-Gallery records, 8 Virtual Think Tanks, 31 blank-category records. Excluded records remain useful content, not task 29 placeholders. P18/P19 task 10 records remain unchanged.
- [Independent HTTP preservation check](http-preservation-check.json): staging 200; image and anchor markup unchanged from baseline.
- [Desktop 1440×900](desktop-1440.png), [mobile 390×844](mobile-390.png), [mobile lightbox](mobile-lightbox-390.png).

## Checks

Chrome on `https://ipmi.webflow.io/gallery#gallery` with site custom code active:

| Check | Result |
| --- | --- |
| Category membership | Institute Sessions 10; Business Meetings 10; Think Tanks & Roundtables 9; Networking & Entertainment 11. Existing four category sections/carousels, not interactive event filters. No event-reference field exists in the collection. |
| Mapping/order | Every displayed asset matches exactly one existing CMS record by decoded filename (legacy uploads-ssl host normalizes to cdn.prod.website-files.com). 40 unique IDs; exact observed positions captured. No record added, deleted or reordered. |
| Thumbnails | All 40 loaded with nonzero natural width after navigating lazy slides. Desktop three-across and mobile one-across sampled crops visually usable; `object-fit` captured per row. |
| Full-size bindings | All 40 lightbox URLs equal their displayed original asset URL. Groups Sessions/Meetings/Thinktanks/Networking match sections. Sessions and Networking opened successfully; full-size image loaded. |
| Pointer/keyboard | Each desktop Next control advanced active slide 1 to 4; Enter on Previous returned to 1. Enter opened Sessions lightbox. Enter on Networking next-image selected item 2 of 11. Escape dismissed and returned focus to gallery. |
| Mobile | 390×844: keyboard Next advanced Sessions to 2/10; last pagination controls reached 10/10, 10/10, 9/9, 11/11 respectively. Networking final image lightbox fits screen with close control/thumbnails. No horizontal document overflow at 390 or 1440. |
| Preserved approved content | Task 08 P11–P14 feature images and descriptive text still present. Task 10 P18/P19 absent from main 40 and unchanged in inventory. |
| Cleanup | Owned QA tab closed, temporary viewport reset. Other existing tabs left intact. |

## Inherited follow-ups for tasks 19/37

Main gallery alt text repeats event captions rather than describing the scene; all lightbox links use generic `open lightbox` names; sampled Webflow full-size images lack alt attributes. Swiper status text such as `This is the first slide`/`Next slide` becomes visibly rendered after keyboard interaction. These are existing accessibility/presentation issues recorded for the integrated audit, not silently repaired within this content-supply task. Full accessibility acceptance remains open.

## Final content replacement

IPMI must approve retention or supply explicit replacement/addition/removal rows with original file, rights/attribution, verified event name/slug, destination/category, approved caption and descriptive alt, and desired order. State whether the manifest is complete. CMS has image/caption/category/Attend category/About flag/color/sort/name/slug fields; no event reference is available to populate. Do not infer event IDs from captions. Apply approved replacements to the recorded IDs through Chrome, deduplicate uploads, preserve other page uses, and recheck staging.

Rollback is a no-op: task 29 changed only these documents/evidence. No site publish occurred, so no domain selection or production-publish claim is applicable. Never roll back task 08 or task 10 approved changes to undo this documentation handoff.
