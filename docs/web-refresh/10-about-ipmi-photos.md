# 10 About IPMI photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review on September 24, 2026 UTC. All four approved photos and contextual alternative descriptions are implemented and verified at desktop, tablet, and mobile sizes. Published only to Webflow staging; production remains unchanged. No placeholder was needed.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [About IPMI](https://www.ipmievents.com/about): existing feature-photo placements indicated in the source screenshots.

Replace the four About IPMI images specified in the source: the front/back bubble pair and the left/right staff-photo placements.

## Current state and asset mapping

The source labels the first pair as front/back bubble staff-photo placements and the second pair as left/right staff-photo placements. Treat these as visual slots; the first supplied asset's name contains Session 16 and does not establish that it depicts staff. Actual image bindings and exact section ownership require source screenshot comparison in Designer.

| Source row | Source page / row | Destination                                       | Supplied asset or instruction                                                                                                             |
| ---------- | ----------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| P16        | 4 / 1             | About IPMI — front bubble / staff-photo placement | [HCHR Mar 2025 Session 16](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQCh2rc39HzbS4aPTPPZXcvuAWHf27CLKoQDFV8wBvzz42c?e=gh6ax5) |
| P17        | 4 / 2             | About IPMI — back bubble / staff-photo placement  | [HCHR March 2024 Staff 1](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQB9sDoVsguqQZ3h9Ir06JN4ASS_n5lhmNgFm5GlMNnIc0k?e=m2awJ3)  |
| P18        | 4 / 3             | About IPMI — left image / staff-photo placement   | [HRMI Apr 2025 Staff 1](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQB13pWKXxpGTqLDUYK_zeeVARCdiD_u7QDfq6e-CRSjkf0?e=D6HZec)    |
| P19        | 5 / 1             | About IPMI — right image / staff-photo placement  | [HFI 2026 Staff.jpg](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQC7iQLmvYPtTbfcmzmx53ATAXawWEUUdM3vmYbBZTRKLvA?e=0Wffd5)       |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current About IPMI page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 4 approved replacement files from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Preserve individual staff headshots, staff profile links, advisor biographies, and the page's gallery links. Do not infer a person's identity or staff role from the destination name; alternative text must describe the actual selected photo.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [02 Institute statistics](02-institute-statistics.md) and [31 About gallery images](31-about-gallery-images.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P16: the approved asset is visible at the destination specified in the mapping table.
- [x] P17: the approved asset is visible at the destination specified in the mapping table.
- [x] P18: the approved asset is visible at the destination specified in the mapping table.
- [x] P19: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Applied implementation and evidence

Editor: Codex task 10 worker, using the observed Webflow account **IPMI Webmaster**. Verification date: September 24, 2026 UTC.

Staging: [About IPMI](https://ipmi.webflow.io/about), page `63c500748ec2645bc65e5f9b`. Source screenshots [P16–P18](evidence/task10/source-p16-p18.png) and [P19](evidence/task10/source-p19.png) establish the mapping: P16 is the lower-left front hero bubble, P17 the upper-right back bubble, and P18/P19 are the left/right **Our Mission** photos. These are not replacements for individual staff headshots.

### Files and exact alternative descriptions

Each approved SharePoint image was opened separately in Chrome, visually inspected, and downloaded using its preview image's native media download. These are clean official JPEG preview derivatives, not claimed original-file bytes and not screenshots used as photos. The downloaded previews remain in ignored `.webflow/task10-photos/`. Evidence: [P16](evidence/task10/approved-p16.png), [P17](evidence/task10/approved-p17.png), [P18](evidence/task10/approved-p18.png), [P19](evidence/task10/approved-p19.png).

| Row | Downloaded preview filename        | Dimensions / bytes   | Exact applied alternative description                                                |
| --- | ---------------------------------- | -------------------- | ------------------------------------------------------------------------------------ |
| P16 | `P16-HCHR-Mar-2025-Session-16.jpg` | 2560 × 2560 / 347717 | A speaker holding a microphone and notes during an IPMI session                      |
| P17 | `P17-HCHR-March-2024-Staff-1.jpg`  | 2560 × 2560 / 276092 | A smiling participant wearing a striped shirt and event lanyard at an IPMI gathering |
| P18 | `P18-HRMI-Apr-2025-Staff-1.jpg`    | 2560 × 1706 / 258742 | Two participants smiling together at an IPMI event                                   |
| P19 | `P19-HFI-2026-Staff.jpg`           | 2560 × 1706 / 304366 | Four IPMI team members smiling together at an outdoor event                          |

The existing CMS Gallery Image field enforces a maximum width of 1920. P18/P19 therefore use deterministic full-frame resized JPEGs, prepared with Pillow LANCZOS and JPEG quality 95: `P18-HRMI-Apr-2025-Staff-1-1920.jpg` (1920 × 1280, 610259 bytes) and `P19-HFI-2026-Staff-1920.jpg` (1920 × 1280, 671029 bytes). Aspect ratio is preserved to whole-pixel rounding; no crop, generated content, or subject alterations. The 2560px sources are retained. The four previews were initially uploaded as new Assets; the unused 2560px P18/P19 Assets are retained as well. Existing assets and metadata were not overwritten.

### Static hero bindings

Both hero images retain their 400 × 400 HTML dimensions, eager loading, responsive-image behavior, circle mask, centered `object-position`, `object-fit: fill`, shadows and breakpoint layouts. The front retains z-index 2; the back remains auto. No class, crop, position, size, style or interaction edits were required. Webflow enabled its normal HiDPI treatment for the large replacement assets. New alternative descriptions are element-level Custom values, leaving the old assets' alt metadata intact.

| Row | Existing element / class                                                                  | Previous asset and asset alt                                                | New asset                                                                                                                                                           |
| --- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P16 | `45fc8c33-bacb-f7cf-8979-02789931e0b8`; `bubble-photo bottom left circle front shadow-xl` | `63ca01e6be845aa977244d2c_About-Bubble-11.webp`; `IPMI Staff - Ted & Jenny` | [P16 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4bc33655ed43be069d72e_P16-HCHR-Mar-2025-Session-16.jpg), asset `6ab4bc33655ed43be069d72e` |
| P17 | `45fc8c33-bacb-f7cf-8979-02789931e0b7`; `bubble-photo top right circle shadow-xl`         | `63ca01e67a50875f1ebaa5b5_About-Bubble-10.webp`; `IPMI Staff - Omeed`       | [P17 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4bc32bce50bba4e943d27_P17-HCHR-March-2024-Staff-1.jpg), asset `6ab4bc32bce50bba4e943d27`  |

Previous hero files use CDN collection prefix `https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/`. [Original hero settings](evidence/task10/original-hero-settings.png) and [original DOM](evidence/task10/original-page.json) record the baseline.

### Mission CMS binding and isolation

The Mission pair uses the **About Photos Wrap** Collection List from Gallery Photos. Its existing image template is `b3836ce5-974d-2426-d808-3f99f4073cb6`, class `recap-photo hover-scale aspect-4-3`. Image source and lightbox media both remain bound to **Gallery Image**, alt remains bound to **Gallery Image Caption**, and lightbox group remains **About**. Existing 1920 × 1080 HTML attributes, lazy loading, 4:3 display aspect, centered cover crop, wrapper rounding, hover and lightbox behavior are preserved.

The previous list used Dynamic items, filter **Feature on 'About IPMI' Page is on**, **Sort Order smallest to largest**, limit 2, skip 0; full-width layout and exclusion from site search. Its old left image was `63c532ea013d5a4ff526d725_Heathcare%20Law%20and%20Compliance%20Institute%20Feb%202022%20-%20Katrina%20and%20Nas.webp`, alt `Healthcare Law and Compliance Institute February 2022`. Old right was `63d30d8097cf0c8ef3fb741b_EHS%202023%20Josh.webp`, alt `EHS Management Institute 2023`. Both use CDN prefix `https://cdn.prod.website-files.com/6312ee46f4c52faf21ee8ab5/`.

Rather than change those shared records, two native CMS records were added and queued for the next site publish. Only this Mission list was switched from Dynamic to **Selected**, ordered P18 then P19. The native conversion removes the original dynamic filter/sort settings; their rollback values are recorded above. The selected list retains the same template and bindings. [Original list settings](evidence/task10/original-list-settings.png), [selected records](evidence/task10/selected-mission-records.png).

| Row | New record name / ID / slug                                                                                          | Gallery Image                                                                                                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P18 | `P18 - HRMI Apr 2025 Staff 1 - About Mission`; `6ab4bd3aeae4404f8477c276`; `p18-hrmi-apr-2025-staff-1-about-mission` | [P18 1920px JPEG](https://cdn.prod.website-files.com/6312ee46f4c52faf21ee8ab5/6ab4bd1fbf52ddc3481af066_P18-HRMI-Apr-2025-Staff-1-1920.jpg), image ID `6ab4bd1fbf52ddc3481af066` |
| P19 | `P19 - HFI 2026 Staff - About Mission`; `6ab4bd83211dc7575394d8e2`; `p19-hfi-2026-staff-about-mission`               | [P19 1920px JPEG](https://cdn.prod.website-files.com/6312ee46f4c52faf21ee8ab5/6ab4bd741859cfc75a33edf7_P19-HFI-2026-Staff-1920.jpg), image ID `6ab4bd741859cfc75a33edf7`        |

Both captions equal the exact alternative descriptions in the first table. **Gallery Category** and **Attend an Institute Page Category** are blank, **Feature on 'About IPMI' Page** is false, Sort Order and accent color are blank. No collection or field was added or altered. Gallery Photos count increased from 77 to 79. [P18 record](evidence/task10/p18-cms-record.png), [P19 record](evidence/task10/p19-cms-record.png).

Read-only dependency inspection found all four Gallery lists filter by an exact Gallery Category option; blank categories exclude these records. The false About feature flag excludes them from the existing four-image About carousel. This keeps task 31's additional gallery content separate. No shared Gallery record was rewritten, and no event association was invented.

### Verification

Only `ipmi.webflow.io` was selected in the publish dialog; the custom domain was unchecked. [Domain selection](evidence/task10/staging-only-publish.png), [publish completion](evidence/task10/publish-completed.png). CMS **Publish now** was not used.

| Viewport           | Evidence and result                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop 1912 × 970 | [Hero](evidence/task10/desktop-hero.png), [Mission](evidence/task10/desktop-mission.png): correct layering, faces visible, two-column Mission photos, no horizontal overflow.                                                                           |
| Tablet 768 × 1024  | [Hero](evidence/task10/tablet-hero.png), [Mission](evidence/task10/tablet-mission.png): intended overlap and side-by-side Mission pair preserved; all faces visible. Existing shared navigation overflow is 790px at 768px, already tracked in task 37. |
| Mobile 390 × 844   | [Hero](evidence/task10/mobile-hero.png), [Mission](evidence/task10/mobile-mission.png): existing mobile hero pair and stacked Mission photos fit; all faces visible; document width 390px.                                                              |

- [Original desktop hero](evidence/task10/original-desktop-hero.png), [original Mission](evidence/task10/original-desktop-mission.png), [original mobile hero](evidence/task10/original-mobile-hero.png); DOM captures [before](evidence/task10/original-page.json), [after](evidence/task10/staged-page.json), [tablet](evidence/task10/tablet-page.json), [mobile](evidence/task10/mobile-page.json).
- Both Mission thumbnails open their matching 1920 × 1280 full-size images: [P18](evidence/task10/lightbox-p18.png), [P19](evidence/task10/lightbox-p19.png), [mobile P19](evidence/task10/mobile-lightbox.png). Six lightbox items retain group **About**. Next from P19 reaches the original HR July 2022 Session Room photo; Previous returns to P19. The other four full-size URLs are unchanged.
- Existing four-photo carousel Next advances to the original HCHR speaker photo and Previous returns to the first photo: [mobile carousel](evidence/task10/mobile-carousel-next.png). Existing hero anchor still reaches Mission at tablet and mobile sizes. No form submission was needed.
- Independent read-only HTTP comparison: About remains 20 images with the other 16 image tags byte-identical; all 94 anchor opening tags identical; all 40 Gallery `gallery-image hover-scale` tags identical; all four carousel image URLs unchanged. Normalized visible-source text is identical (3321 characters), including task 02's count of 20. Production retains all 20 baseline image tags and contains none of the four replacement assets.
- The Staff Section was already hidden. Its eight original headshots, staff profile links and modal hooks remain intact; hidden profiles were not exposed or claimed as interactively tested. No staff biography, link, shared modal, existing asset metadata, custom code, provider configuration or stylesheet was changed.
- All four replacements use Webflow CDN URLs. Main-photo loading, alt descriptions and crops passed. No remaining task-10 blocker. Task 37 retains the baseline tablet-navigation issue and later integrated checks.
- Documentation validation: `vp fmt --check docs/web-refresh/10-about-ipmi-photos.md docs/web-refresh/README.md` and `git diff --check` passed. This was a native Webflow photo/CMS change; no local runtime code changed, so a build was not required. Temporary viewport overrides were cleared, the staging tab returned to 1912 × 970, source tabs closed, and Designer left on About at Desktop with no dialog open.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.

For this implementation, restore the two hero sources above and change their alt mode back to **Use alt text from asset**. Restore only Mission **About Photos Wrap** to Dynamic, reapply the recorded About feature filter, ascending Sort Order, limit 2 and skip 0. Preserve Gallery Image / Caption bindings and group About. The two new records can remain unselected with their categories blank and feature flag false; do not delete them or modify the original shared records. Republish staging only with custom domains unchecked, then recheck the original Mission pair, all six lightbox entries, four carousel entries and unchanged Gallery.
