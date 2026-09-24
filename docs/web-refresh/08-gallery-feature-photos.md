# 08 Gallery page feature photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. Four approved feature photos and their descriptions are verified on staging; production remains unchanged.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Gallery](https://www.ipmievents.com/gallery): existing feature-photo placements indicated in the source screenshots.

Replace the Gallery hero pair and the source's additional front/back pair using the four specified assets. The source asks for recent cover images for the additional pair; use the supplied choices rather than selecting different events.

## Current state and asset mapping

The source identifies the hero front/back pair and the lower Upcoming Institutes CTA pair headed ‘Leveraging On-Site Connections to Advance Organizational Objectives.’ The source screenshots match both placements. These four feature replacements are separate from the full gallery content supply.

| Source row | Source page / row | Destination                                                                      | Supplied asset or instruction                                                                                                                |
| ---------- | ----------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| P11        | 3 / 1             | Gallery hero — front image                                                       | [HCHR Mar 2025 Dinner 20](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQCXqgMZMm7bT4hUrXiq5O27AUvtYlgNf8NWp5LCSJIabV8?e=gV9HIj)     |
| P12        | 3 / 2             | Gallery hero — back image                                                        | [HRMI Central 2024 Session 2](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQAFVfHNzRd7QanOFCREEI-tAWp-jy9n28vXCjhe4WVp8BA?e=2IGQYF) |
| P13        | 3 / 3             | Additional pair — front, recent cover image; confirm source screenshot's section | [HIT 2024 Scenic](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQBw9vZIM-5bR4SF6t2BGQq5AWvKk19qvk2rD3tgdHEWlxk?e=e4Vf2I)             |
| P14        | 3 / 4             | Additional pair — back, recent cover image; confirm same pair                    | [SOI 2024 Dinner](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQAOfjZy5BAUT5MrVdd8ive2AUACDnCcjOp6a90GowB0Qyc?e=MRP3yj)             |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Gallery page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 4 approved replacement files from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Preserve gallery filters, collection-item image lists, lightbox behavior, captions, and event links. If a feature is CMS-bound, identify its exact referenced item/field before changing it so unrelated gallery entries are not overwritten.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [29 Complete gallery image supply](29-gallery-content-supply.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P11: the approved asset is visible at the destination specified in the mapping table.
- [x] P12: the approved asset is visible at the destination specified in the mapping table.
- [x] P13: the approved asset is visible at the destination specified in the mapping table.
- [x] P14: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Implementation evidence — September 24, 2026

Editor: Codex task 08 worker, Chrome Designer account **IPMI Webmaster**, site **IPMI**, Gallery page `63bf184b8646db7268e9ce29`. All website changes used the Designer UI. [Hero source screenshot](evidence/task08/source-p11-p12.png) and [lower CTA source screenshot](evidence/task08/source-p12-p14.png) positively identify the two pairs and their front/back directions.

### Source retrieval

All four supplied links opened and were visually inspected. The supported image-locator `downloadMedia()` retrieved official SharePoint preview derivatives through fresh viewer tabs, following the successful task 05/06 method. These are clean source photographs, not screenshots, placeholders, or a claim of original-byte retrieval. P11–P13 are 2560 × 2560 JPEGs; P14 is 2268 × 2268. Observed blob filenames in `C:/Users/Bryan/Downloads/` were copied into `.webflow/task08-photos/` and uploaded as four new assets through the Designer file chooser. Existing asset bytes and metadata were preserved.

| Row | Observed download filename                 | Bytes  | Uploaded filename                     |
| --- | ------------------------------------------ | ------ | ------------------------------------- |
| P11 | `5b8d3dc8-f86b-4c1b-a73e-a95648c932e8.jpg` | 342417 | `P11-HCHR-Mar-2025-Dinner-20.jpg`     |
| P12 | `c373cb0c-9e0d-49e5-b6ff-a98c5abe3d2e.jpg` | 420008 | `P12-HRMI-Central-2024-Session-2.jpg` |
| P13 | `211aca02-7a18-4098-aa4e-6d2a7b81bb03.jpg` | 776220 | `P13-HIT-2024-Scenic.jpg`             |
| P14 | `c1912ced-031e-44fa-a885-37204be822e7.jpg` | 567227 | `P14-SOI-2024-Dinner.jpg`             |

### Exact mapping and accessibility

| Row | Designer destination / element ID                                                                                                                                         | Previous asset / alt                                                                                                                                                    | New asset / exact custom alt                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P11 | Hero Section → Hero Container → Hero Wrap → Bubble Photos → lower-left front; `45fc8c33-bacb-f7cf-8979-02789931e0b8`                                                      | [Gallery-Bubble-1.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63bf554c1f11b192f08972f9_Gallery-Bubble-1.webp); `IPMI Institute Keynote Speaker`   | [P11-HCHR-Mar-2025-Dinner-20.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b6bc009285801122e517_P11-HCHR-Mar-2025-Dinner-20.jpg); `Attendees smiling and raising a hand at an IPMI networking reception` |
| P12 | Same hero pair → upper-right back; `45fc8c33-bacb-f7cf-8979-02789931e0b7`                                                                                                 | [Gallery-Bubble-2.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63bf554d5b35230affd3164e_Gallery-Bubble-2.webp); `IPMI Institute Dinner Lobby`      | [P12-HRMI-Central-2024-Session-2.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b6be6f37170719534329_P12-HRMI-Central-2024-Session-2.jpg); `A speaker seated on stage during an IPMI Institute session`   |
| P13 | Institutes CTA Section → Institutes Section → Container → Bubbles Columns → Recap Column Left → Bubble Photos → lower-right front; `fda1d534-ccfd-d9bf-3f28-572b82388c8e` | [Institutes-Bubble-5.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63cf344ad75e97ad6d8d7066_Institutes-Bubble-5.webp); `IPMI Institute Destination` | [P13-HIT-2024-Scenic.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b6beeae4404f8475938c_P13-HIT-2024-Scenic.jpg); `Fountains and palm trees beside a lake at an Institute venue`                         |
| P14 | Same CTA pair → upper-left back; `fda1d534-ccfd-d9bf-3f28-572b82388c8d`                                                                                                   | [Institutes-Bubble-6.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63cf344a033565aa03ae94b7_Institutes-Bubble-6.webp); `IPMI Institute Destination` | [P14-SOI-2024-Dinner.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b6be655ed43be067d947_P14-SOI-2024-Dinner.jpg); `Attendees networking beside a rooftop pool among city towers`                         |

All four are informative photos with descriptions based on visible content. No people or venue identities were inferred. Each retains 400 × 400 attributes, centered `object-fit: fill`, 50% circular mask, shadows, and front z-index 2/back auto. Hero images load eagerly; CTA images load lazily. No class, focal position, breakpoint style, text, link, CMS item or custom code was changed. [Original fields](evidence/task08/original-elements.json), [edited fields](evidence/task08/edited-elements.json), and [published loading checks](evidence/task08/desktop-checks.json) record the references and styles. The original Designer DOM carried a stale P10 srcset on the hero back image from prior page navigation; its original `src`, source screenshot, and independent production baseline identify Gallery-Bubble-2 correctly. Published new responsive sources were verified separately.

### Shared component isolation

**Institutes CTA Section** has five instances: Gallery, Frequently Asked Questions, Insights, Recaps, and Testimonials. [Consumer dialog](evidence/task08/component-consumers.png) records this scope. Four native properties were added: **Front photo**, **Front photo description**, **Back photo**, and **Back photo description**. [Defaults](evidence/task08/component-defaults.png) preserve Institutes-Bubble-5/6 and **Use alt text from asset** for both descriptions. Only Gallery instance `eceaf85b-916a-39ec-50df-b41d96a79261` receives P13/P14 and descriptions through [instance overrides](evidence/task08/component-overrides.png). The component was not unlinked, and child IDs were preserved.

Independent lead checks after publication confirmed `/faq`, `/testimonials`, `/recaps`, and `/insights` still have both original CTA image tags byte-identical to production, including alt text. There is no shared-default leakage.

### Staging verification

- Published once with only **ipmi.webflow.io** selected and **www.ipmievents.com** unchecked; [domain evidence](evidence/task08/staging-only-publish.png). Completion showed staging “Published a few seconds ago” and production “Published 2 hours ago.”
- [Gallery hero](https://ipmi.webflow.io/gallery#hero) and [Upcoming Institutes CTA](https://ipmi.webflow.io/gallery#institutes) passed at **1912 × 970**, **768 × 1024**, and **390 × 844**. Subject visibility, circular crops, front/back layering, adjacent headings, and CTA readability were retained.
- All four photos load from Webflow-managed assets with nonzero natural dimensions, exact custom alts, and responsive variants. Lazy CTA images were checked after scrolling into view.
- Independent lead comparison found all **40 gallery-image tags byte-identical** to the pre-edit baseline. Production Gallery bubble tags remain unchanged. Task 29 CMS gallery supply was not touched.
- The Institute Sessions slider advances and enables Previous; an existing image opens the lightbox, its thumbnail navigation selects another item, and Close dismisses it. [Lightbox evidence](evidence/task08/gallery-lightbox.png). The four existing category lists (10/10/9/11 items), captions and lightbox data remain intact. Hero CTA retains `#gallery`; lower CTA retains `/institutes`.
- Desktop/mobile document widths equal viewport widths. At 768px the shared navigation still yields 790px document width, the existing baseline limitation tracked by task 37. Photo layout itself remains within the viewport.
- No placeholders were needed. No application build was required for browser-only photo replacements. Changed Markdown/JSON was formatted and checked with `vp fmt`; Git whitespace checks passed.
- Temporary viewport overrides were reset. Source tabs were closed, staging retained as a review deliverable, and Designer left on Gallery at Desktop with no dialog. Chrome control was released at handoff.

| Viewport         | Hero                                              | Lower CTA                                       |
| ---------------- | ------------------------------------------------- | ----------------------------------------------- |
| Desktop          | [Hero](evidence/task08/desktop-hero.png)          | [CTA](evidence/task08/desktop-cta.png)          |
| Tablet           | [Hero](evidence/task08/tablet-hero.png)           | [CTA](evidence/task08/tablet-cta.png)           |
| Mobile           | [Hero](evidence/task08/mobile-hero.png)           | [CTA](evidence/task08/mobile-cta.png)           |
| Original desktop | [Hero](evidence/task08/original-desktop-hero.png) | [CTA](evidence/task08/original-desktop-cta.png) |
| Original mobile  | [Hero](evidence/task08/original-mobile-hero.png)  | [CTA](evidence/task08/original-mobile-cta.png)  |

## Rollback

Restore the captured previous hero asset references and their original alt values. Reset this Gallery instance’s four CTA overrides to their preserved defaults; retain the native properties and other instances. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.
