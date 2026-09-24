# 13 Attend page photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. Both approved hero photos and factual alternative descriptions are published to Webflow staging only; evidence below.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Attend](https://www.ipmievents.com/attend): existing feature-photo placements indicated in the source screenshots.

Replace the Attend page's source-indicated front/back photo pair with the supplied Dinner and Session images.

## Current state and asset mapping

The source supplies two image replacements for the Attend page. The exact section/Designer elements and current bindings must be verified against its page 6 screenshot. These two swaps are separate from IPMI's pending full Attend, Speak, and Sponsor gallery image supply.

| Source row | Source page / row | Destination                               | Supplied asset or instruction                                                                                                            |
| ---------- | ----------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| P24        | 6 / 1             | Attend — front image in source screenshot | [CLDI Apr 2025 Dinner 12](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQAbnabpGqfYSIiqt50fOPIWAdfdqCCQl__h_nDTUTREVA8?e=9k39fu) |
| P25        | 6 / 2             | Attend — back image in same pair          | [HR East 2026 Session 6](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQDc9GELRZ1JSL0vMdLl8MQ5AZtJnkbR4Xs5o4AJNhaoH_o?e=UakCsf)  |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Attend page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 2 approved replacement files from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Preserve attendee, speaker, and sponsor gallery collections, their linked images, CTA destinations, and form-category switching. Check the form and category buttons remain reachable beneath the image/text layout.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [03 Attend copy](03-attend-page-copy.md) and [32 Attend Speak and Sponsor image supply](32-attend-speak-sponsor-images.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P24: the approved asset is visible at the destination specified in the mapping table.
- [x] P25: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.

## Implementation record — September 24, 2026

Implemented by Codex through Chrome Designer as **IPMI Webmaster**, with exclusive editor control. Page **Attend an Institute**, ID `63c3cdd3cff81805b2fec9e4`; staging [Attend](https://ipmi.webflow.io/attend#hero). No placeholders were needed.

The [source page 6 screenshot](evidence/task13/source-p24-p25.png) explicitly identifies the lower-left foreground lawn-game circle as P24 and upper-right background Sydney circle as P25. Both are static image elements under **Hero Section → Hero Container → Hero Wrap → Bubble Photos**. They are separate from the Attend, Speak and Partner CMS galleries.

| Row       | Element ID                             | Previous asset and asset alt                                                    | New Webflow asset                                                                                                                                                  | Exact custom description                                                 |
| --------- | -------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| P24 front | `45fc8c33-bacb-f7cf-8979-02789931e0b8` | `63cf42c5a6582964edff70d1_Attend-Bubble-4.webp`; `IPMI Institute Entertainment` | [P24 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4c705655ed43be06ebd36_P24-CLDI-Apr-2025-Dinner-12.jpg), asset `6ab4c705655ed43be06ebd36` | `Attendees networking outdoors around a cocktail table at sunset`        |
| P25 back  | `45fc8c33-bacb-f7cf-8979-02789931e0b7` | `63cf42c4b3cf92330bc8319f_Attend-Bubble-3.webp`; `IPMI Staff- Sydney`           | [P25 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4c776b9f31bbef1a63b13_P25-HR-East-2026-Session-6.jpg), asset `6ab4c776b9f31bbef1a63b13`  | `Speaker wearing a headset microphone and holding a presentation remote` |

Original alt mode was **Use alt text from asset**; replacements use **Custom description**, preserving old asset metadata. Both photos were inspected in their approved SharePoint previews before retrieval. The scenes are outdoor sunset networking and a speaker holding a presentation remote. No identities were inferred.

### Provenance and preserved settings

Chrome `downloadMedia` retrieved the official SharePoint preview blobs: `9c9b5133-8550-4999-82bd-faebc13aec7c.jpg` (P24) and `593ea9c2-b1d5-4b19-bba3-07801640a4be.jpg` (P25). Both are **2560 × 2560 JPEG preview derivatives**, not claimed to be original camera files. Local copies remain under ignored `.webflow/task13-photos/`. No screenshot was used as a replacement image. Asset searches showed related assets but no exact supplied match; each new asset was uploaded once through Assets' native file chooser and selected through Replace Image.

| Filename                          | Bytes  | SHA-256                                                            |
| --------------------------------- | ------ | ------------------------------------------------------------------ |
| `P24-CLDI-Apr-2025-Dinner-12.jpg` | 291038 | `38BFC2A4AFC6EDD55BAE7F1D2BD3687B02DD7F36B90E698EBAD3B47BE14D2BCF` |
| `P25-HR-East-2026-Session-6.jpg`  | 286562 | `3D1E14BAE57EC91A85FA11B6A4B8E14712A566CD5BD5B6F36F65F7E916247D87` |

[Desktop baseline](evidence/task13/before-desktop-designer.png), [mobile baseline](evidence/task13/before-mobile.png). Preserved 400 × 400 HTML dimensions, eager loading, responsive image generation, `object-fit: fill`, `object-position: 50% 50%`, circle radius 50%, and shadows. Front classes remain `bubble-photo bottom left circle front shadow-xl`, z-index 2; back classes remain `bubble-photo top right circle shadow-xl`, z-index auto. Webflow automatically enabled HiDPI for the larger uploads without changing dimensions. No CSS, breakpoint, focal position, layering or background adjustment was required.

### Verification

Only `ipmi.webflow.io` was selected; the sole listed custom domain `www.ipmievents.com` was unchecked. [Staging-only publish selection](evidence/task13/publish-staging-only.png), [completed publication](evidence/task13/publish-completed.png). No CMS immediate publication was used.

| Viewport           | Result                                                                                                                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop 1912 × 970 | [Hero](evidence/task13/desktop-hero.png), [checks](evidence/task13/desktop-checks.json): both approved images loaded, 334px rendered circles, correct foreground overlap and visible subjects; document width 1912px.                     |
| Tablet 768 × 1024  | [Hero](evidence/task13/tablet-hero.png), [checks](evidence/task13/tablet-checks.json): both loaded, 250px circles and inherited vertical overlap preserved. Existing shared navigation produces document width 790px; tracked in task 37. |
| Mobile 390 × 844   | [Hero](evidence/task13/mobile-hero.png), [checks](evidence/task13/mobile-checks.json): both loaded, approximately 182px circles, horizontal pair preserved, no document overflow.                                                         |

- Desktop and mobile Experience an Institute CTA reaches `#attend`. Mobile canonical `#speak` and `#partner` reach their matching sections; [Partner view](evidence/task13/mobile-partner.png). Registration CTA reaches `#invite`; desktop Speak CTA selects Speak.
- Attend, Speak and Partner category buttons visibly activate the matching state on desktop and mobile. [Desktop Partner form](evidence/task13/desktop-form-partner.png), [mobile Attend form](evidence/task13/mobile-form.png). All fields remain reachable. No inquiry was submitted and delivery/hidden category serialization was not asserted; task 03's existing validation limit remains for task 15.
- All three gallery Next controls advance to the second slide; counts remain Attend 6, Speak 6 and Partner 7. Each gallery opens its lightbox and closes normally; Attend next-image control works. Speak retains its single-image lightbox; [Partner lightbox](evidence/task13/partner-lightbox.png) retains seven items.
- Independent orchestrator HTTP comparison against the exact pretask staging baseline: 43 image tags remain, other 41 byte-identical; all 118 anchor opening tags unchanged; normalized source text unchanged (6701 characters); complete form HTML byte-identical. All 43 production image tags match their baseline. Task 03 approved copy is preserved.
- No CMS records, galleries, form recipients, routing, scripts, styles, shared definitions or old asset bytes were changed. Task 15 phone work and task 32 broader imagery remain separate. No placeholder register changes were required.
- Viewport override reset; owned source tabs closed; staging retained for review. Designer left on Attend at Desktop, without dialogs, and Chrome explicitly released to the orchestrator.
- Relevant `vp fmt --check` and `git diff --check` passed. No app build was needed for photo-only browser edits and evidence.

### Exact rollback

In the two static hero image elements, restore the previous asset references above using prefix `https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/` and **Use alt text from asset**. Preserve dimensions, eager loading, classes, centered positioning, circle masks and gallery/form state. Republish only staging with custom domains unchecked. Retain both old and new assets; do not restore a whole-site backup over other tasks.
