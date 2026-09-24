# 06 Upcoming Institutes photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. All five approved photographs are installed and verified on Webflow staging; production was not published.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Upcoming Institutes](https://www.ipmievents.com/institutes): existing feature-photo placements indicated in the source screenshots.

Replace five specified images on Upcoming Institutes. The source identifies two separate front-image placements; match each screenshot before editing so the Dinner and Session 9 images do not overwrite the same slot.

## Current state and asset mapping

The source supplies the hero background image and front bubble, a separate Recaps front/back pair, and the Intimate/Interactive overview image. Source screenshots and Designer structure were matched before editing; exact destinations, original references, and final assets are recorded below.

| Source row | Source page / row | Destination                                                            | Supplied asset or instruction                                                                                                                |
| ---------- | ----------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| P05        | 1 / 5             | Upcoming Institutes — background image; match source screenshot        | [HR East 2026 Session 2.jpg](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQCIvwX0sBA4Q4X-XO-VH0VeAQBLFiXEaiOxDRKwVDMOJ0k?e=cUPZJl)  |
| P06        | 1 / 6             | Upcoming Institutes — front bubble in page 1 screenshot                | [HR Central 2024 Dinner](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQB4wy3T4J7uTbCPgj4emSRzAWXEBZcUwcmRREmMdw-WSOE?e=8bwv7R)      |
| P07        | 2 / 1             | Upcoming Institutes — front image in page 2 pair; distinguish from P06 | [HR East 2026 Session 9](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQDu7oc7EdoATZKkx3lKw0_BAb_d-cOuFACEthK0DK1RF44?e=s38DM2)      |
| P08        | 2 / 2             | Upcoming Institutes — back image paired with P07                       | [HRMI West 2025 Think Tank 5](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQC3JsDJbgc6Q59BiIzYp8RPAROkTRyY0sA4X84UbjRKQLw?e=EOFdf7) |
| P09        | 2 / 3             | Intimate / Interactive section — indicated image                       | [CLDI Apr 2025 Think Tank 9](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQCj_tyEuLDfQJoyCuzVriZGAfPgDMgs3eAppNoU7NmItE8?e=kM2UXj)  |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Upcoming Institutes page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 5 approved replacement files from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Do not change event-card images, list filters, pagination, dates, registration actions, or Horizon status while replacing the five section images. Verify P05 as the actual background-style slot rather than an overlapping image element before choosing its editing control.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [01 Overview copy](01-homepage-and-institute-overview-copy.md) and [24 Institutes calendar](24-institutes-calendar.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P05: the approved asset is visible at the destination specified in the mapping table.
- [x] P06: the approved asset is visible at the destination specified in the mapping table.
- [x] P07: the approved asset is visible at the destination specified in the mapping table.
- [x] P08: the approved asset is visible at the destination specified in the mapping table.
- [x] P09: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Implementation evidence — September 24, 2026

Editor: Codex task 06 worker, Chrome Designer account **IPMI Webmaster**, site **IPMI**, Upcoming Institutes page `63ba5ae2944baf57c9a073c8`. All website edits used the Designer UI. [P05/P06 source screenshot](evidence/task06/source-p05-p06.png) identifies the hero background and lower-left front bubble; [P06–P09 source screenshot](evidence/task06/source-p06-p09.png) distinguishes the hero front from the lower-right Recaps front, upper-left Recaps back, and rectangular overview photo.

### Source retrieval

All five approved links opened and their photographs were visually inspected. As in task 05, the SharePoint download menu did not produce an original file. The supported image-locator `downloadMedia()` retrieved official preview derivatives: P05/P09 are **2560 × 1706 JPEGs**; P06/P07/P08 are **2560 × 2560 JPEGs**. These are clean source photographs, not screenshots, placeholders, or a claim of original-byte retrieval. Reusing a navigated viewer produced no download for later sources; fresh viewers resolved that issue. No browser permission or access control was bypassed.

Observed blob filenames under `C:/Users/Bryan/Downloads/` were copied to recognizable names in `.webflow/task06-photos/` and uploaded together through the Designer file chooser after confirming it accepted multiple files. Asset searches found no exact approved replacements. All five were uploaded as new assets; existing asset bytes and metadata were preserved.

| Row | Observed downloaded filename               | Bytes  | Uploaded filename                     |
| --- | ------------------------------------------ | ------ | ------------------------------------- |
| P05 | `d4d3bdc9-46c4-42bc-9396-20ebcaeb6e8c.jpg` | 259768 | `P05-HR-East-2026-Session-2.jpg`      |
| P06 | `48ca5c5c-0f58-42ad-a821-368acbedbd56.jpg` | 640692 | `P06-HR-Central-2024-Dinner.jpg`      |
| P07 | `7df6aa94-02a0-4465-945b-9434f2d809bf.jpg` | 274537 | `P07-HR-East-2026-Session-9.jpg`      |
| P08 | `7dbf565c-0a76-450e-86c2-c27ff9955947.jpg` | 249626 | `P08-HRMI-West-2025-Think-Tank-5.jpg` |
| P09 | `9ee597c9-0aaf-4a22-a9cb-67178164724a.jpg` | 288681 | `P09-CLDI-Apr-2025-Think-Tank-9.jpg`  |

### Exact mapping and accessibility

| Row | Designer destination / element ID                                                                                                                                                 | Previous asset / alt                                                                                                                                                                                                            | New asset / exact alt                                                                                                                                                                                                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P05 | Hero Section → Hero BG → **Hero BG Image**, `2b8dd0d9-8af4-ddc1-3613-866c8af082e1`, class `hero-bg-image`                                                                         | [Institutes-Hero-BG-2.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63cf4a4bcdbc6f8c47df7d64_Institutes-Hero-BG-2.webp); empty alt, Decorative                                                              | [P05-HR-East-2026-Session-2.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b14b89ec7715954bd6d1_P05-HR-East-2026-Session-2.jpg); empty alt, Decorative retained                                                               |
| P06 | Hero Section → Hero Container → Hero Wrap → Bubble Photos → lower-left front, `45fc8c33-bacb-f7cf-8979-02789931e0b8`                                                              | [Institutes-Bubble-7.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63cf4959cdbc6f93c3df6c57_Institutes-Bubble-7.webp); `IPMI Institute Dinner`                                                              | [P06-HR-Central-2024-Dinner.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b14c3c45253949502846_P06-HR-Central-2024-Dinner.jpg); `Attendees networking over dinner at an IPMI Institute`                                      |
| P07 | Recaps CTA Section → Recaps Section → Container → Bubbles Columns → Recap Column Left → Bubble Photos → lower-right front; component child `11d81f25-1d4b-d992-52b0-801a2df1164f` | [Recaps-Bubble-4.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63cf3d77cd8c8532cb40a613_Recaps-Bubble-4.webp); `IPMI Business Meeting`                                                                      | [P07-HR-East-2026-Session-9.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b14cda6412ca2ac37a85_P07-HR-East-2026-Session-9.jpg); `A speaker presenting on stage at an IPMI Institute`                                         |
| P08 | Same Recaps instance and parent hierarchy, upper-left back; component child `11d81f25-1d4b-d992-52b0-801a2df1164e`                                                                | [Recaps-Bubble-2.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63b7c3cbc7dee5f009e13e8c_Recaps-Bubble-2.webp); `An advisor addressing the crowd at an IPMI institute ` (trailing space retained in default) | [P08-HRMI-West-2025-Think-Tank-5.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b14b10198c9b1043170a_P08-HRMI-West-2025-Think-Tank-5.jpg); `A participant listening during a Think Tank session`                              |
| P09 | Feature Section → Container → Home - What We Do Wrap → Home - What We Do Video → Image Cover, `df7c2891-8821-fbd0-d7fb-566fefc8352b`                                              | [Home-WhatWeDo-Video.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/638d6cf265a7e4190f8ace3b_Home-WhatWeDo-Video.webp); `IPMI What We Do Video Thumbnail`                                                    | [P09-CLDI-Apr-2025-Think-Tank-9.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b14b065ea59f68522cca_P09-CLDI-Apr-2025-Think-Tank-9.jpg); `A facilitator leading a Think Tank discussion with participants seated in a circle` |

P05 is an actual `<img>` behind the hero overlay, not either circle and not a CSS background field. Its decorative role, centered `object-fit: cover`, eager loading, and unset width/height attributes were retained. P06/P07/P08 retain `400 × 400` attributes, `object-fit: fill`, centered position, circular 50% mask, front z-index 2/back auto; P06 loads eagerly, P07/P08 lazily. P09 retains `768 × 512` attributes, centered cover fit, 10px radius, and lazy loading. No class or breakpoint style was changed. The upper-right hero Speaker Panel source remains unchanged. The four informative photos use custom descriptions without inferred person, company, or venue identities. [Original fields](evidence/task06/original-elements.json) and [final fields](evidence/task06/edited-elements.json) include exact attributes and styles.

### Shared component isolation

**Recaps CTA Section** showed two instances and no existing properties. Four native properties were added with their prior defaults intact: **Front photo**, **Back photo**, **Front photo description**, **Back photo description**. The image defaults remain the original Recaps-Bubble-4/2 assets above; both description defaults remain **Use alt text from asset**. Only Upcoming Institutes instance `44ce6109-455e-10ac-91b7-85d695c20155` receives P07/P08 and the custom descriptions. The component was not unlinked and child IDs were preserved. [Defaults](evidence/task06/component-defaults.png) and [instance overrides](evidence/task06/component-overrides.png) were captured.

The other consumer is [Recent Institutes](https://ipmi.webflow.io/recent-institutes#recaps). Independent lead verification after publication confirmed it still renders both old image URLs and exact old alt strings, matching production, with no P07/P08 leakage. No CMS collection/item, event image, event data, shared hosting asset, or runtime code was changed.

### Staging verification

- Published once with only **ipmi.webflow.io** checked and **www.ipmievents.com** unchecked; [domain evidence](evidence/task06/staging-only-publish.png). Completion showed staging “Published a few seconds ago” while production remained “Published 2 hours ago.”
- [Hero](https://ipmi.webflow.io/institutes#hero), [Recaps](https://ipmi.webflow.io/institutes#recaps), and [overview](https://ipmi.webflow.io/institutes#features) visually passed at **1912 × 970**, **768 × 1024**, and **390 × 844**. Circular layering follows existing diagonal/vertical/horizontal layouts; key subjects remain visible and adjacent text/links remain readable. The overview's tablet cover crop retains the facilitator and group.
- All five images load from Webflow-managed sources with nonzero natural dimensions. Published URLs and alt strings match exactly; informative images have responsive variants. [Desktop checks](evidence/task06/desktop-checks.json) record delivered sources and dimensions. P05 is decorative with empty alt.
- Independent lead verification found each new source exactly once on staging Upcoming Institutes and none on production Upcoming Institutes. Recent Institutes defaults are unchanged.
- The industry filter opens, Healthcare yields `healthcare-gci-oct-2026` and `cni-2026`, and toggling it off restores the six original visible events. Their View Institute links remain event-specific. Existing list/pagination structure, thumbnails, dates, registration behavior, and Horizon data were not edited. Recaps CTAs remain `/insights`; overview CTA remains `/attend`; task 01 overview copy remains staged.
- No desktop/mobile document overflow. At 768px, shared navigation produces document width 790px on both staging and unchanged production; [production baseline](evidence/task06/production-tablet-navigation-baseline.png) confirms this existing limitation, already tracked by task 04 for task 37. This photo task does not claim to fix it.
- No placeholders were needed. No application build was required for browser-only photo changes. Changed documentation was formatted and checked with `vp fmt`; Git whitespace checks passed. Temporary viewport overrides were cleared, source tabs closed, and Designer left at the desktop breakpoint with no dialog. Chrome control was released at handoff.

| Viewport         | Hero                                              | Recaps and overview                                                                                            |
| ---------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Desktop          | [Hero](evidence/task06/desktop-hero.png)          | [Recaps and overview](evidence/task06/desktop-recaps-features.png)                                             |
| Tablet           | [Hero](evidence/task06/tablet-hero.png)           | [Recaps and overview](evidence/task06/tablet-recaps-features.png)                                              |
| Mobile           | [Hero](evidence/task06/mobile-hero.png)           | [Recaps](evidence/task06/mobile-recaps.png), [overview](evidence/task06/mobile-features.png)                   |
| Original desktop | [Hero](evidence/task06/original-desktop-hero.png) | [overview](evidence/task06/original-desktop-features.png)                                                      |
| Original mobile  | [Hero](evidence/task06/original-mobile-hero.png)  | [Recaps](evidence/task06/original-mobile-recaps.png), [overview](evidence/task06/original-mobile-features.png) |

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static fields. For P07/P08 reset this page's four component overrides to their preserved defaults; leave the reusable properties and other instances intact. Republish staging only and verify every affected placement. Keep both old and new assets available through review; do not delete an asset that another page may use.
