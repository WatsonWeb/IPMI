# Task 17 — optional Institute chair

Implemented through native Chrome Webflow Designer/CMS and published only to `ipmi.webflow.io` on September 24, 2026. Production remained visibly unchecked. Root independently reviewed schema, CMS and canonical staging pages. Final sponsor approval remains pending.

## Baseline and exact changes

Site `62f30d583ebbed2d6d47f9a5`; Institutes collection `6392772fccd80e5128026020`; Institutes template `6392772fccd80e6d0e02600d`; Partners collection `6392772fccd80ee9e5026021`. Original Institutes schema had 44 fields, no chair equivalent. Partners had 571 records and five fields. No existing Partner was changed; count is now 572.

Added only these optional Institute fields:

| Field / slug                                            | ID                                 | Native configuration                                       |
| ------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| Chair Sponsor / `chair-sponsor`                         | `50b3a207d074fed13bcec045b63970bc` | Single Reference → Partners; not required                  |
| Chair Sponsor Description / `chair-sponsor-description` | `bb7c2227d1f02e5d3392a6275478868d` | Multiline PlainText; not required; maximum 200; no minimum |

Help text is respectively `Optional chair for this Institute. Select an approved Partner; leave empty to hide the chair block.` and `Optional Institute-specific chair description. Maximum 200 characters including spaces. Leave empty to show the logo only.` Root confirmed all 44 original field definitions unchanged.

Native wrapper is inside Partners Section → Container, after Section Headings and before both existing Slider branches. It inherits the section's original Horizon condition. Current `#partners-swiper-new` and legacy `#partners-swiper`, their links, references, filters and order were preserved.

| Element                                | Native element ID                      | Binding / style                                                                                                   |
| -------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Div `.chair-sponsor`                   | `06ed5f80-2e24-99aa-b833-ef5455f33fad` | Chair Sponsor is set → Visible; Else Hidden. Center text, 40px bottom margin                                      |
| H3 `.chair-sponsor-heading`            | `b6a03960-7343-3d6e-045d-9e7c3a6acf1e` | `INSTITUTE CHAIR SPONSOR`; 1.25rem; existing inherited Avenir typography                                          |
| Unlinked Image                         | `85ec0d71-37a5-de19-12d1-0dc6723cdbd1` | Chair Sponsor → Partner Logo; alt = Chair Sponsor → Partner Name. Width 200, height Auto, responsive              |
| Paragraph `.chair-sponsor-description` | `4302d2f4-019f-3a1d-20d4-bca9fd941419` | Institute Chair Sponsor Description; is set → Visible, Else Hidden; max width 640px, automatic horizontal margins |

All four elements and three classes are new. No shared class was edited. Keep in HTML when hidden remains off. No custom CSS/JS asset was added. Protected `ipmi-custom-styles.css` SHA256 remains `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496`.

## Exact provisional content and replacement

The user authorized labeled placeholders for missing content. This supersedes the earlier keep-empty instruction; it does not approve a real sponsor.

- New Partner ID `6ab4fe478e6d517d534aac7c`, name `PLACEHOLDER - Chair Sponsor (approval pending)`, slug `placeholder-chair-sponsor-approval-pending`.
- Required `partner-logo`: [transparent neutral 200×200 PNG](chair-sponsor-placeholder.png), asset ID `6ab4fe40d56d16fa62095af1`, CDN URL `https://cdn.prod.website-files.com/6312ee46f4c52faf21ee8ab5/6ab4fe40d56d16fa62095af1_chair-sponsor-placeholder.png`. Graphic says `PLACEHOLDER`, `CHAIR LOGO`, `Awaiting approval`; it is deliberately provisional artwork, not supplied sponsor artwork.
- Required `partner-url`: `https://example.invalid/chair-sponsor-placeholder`. It satisfies the required field only. The chair has no anchor/CTA and never renders this URL.
- `institutes---appear-as-partner` remains empty. No ordinary sponsor assignment was made.
- Sitemap Indexing Off applies only to this new item's **Item details**, next to its exact Item ID. No Partners collection/template SEO, indexing or access setting changed. Partners template `6392772fccd80ecd2902600e` still requires authentication; the placeholder route returned 401, no bypass attempted.
- GCI item `689a4db462964a1e231e1fbb`, label `15. HGC Oct 2026`, slug `healthcare-gci-oct-2026`: new chair reference points to the placeholder; description is the exact 165-character value below. Both fields were previously absent/blank. All original GCI fields, flags, and every other Institute's original fields/flags remain unchanged. All other chair fields are empty.

> PLACEHOLDER: Chair sponsor approval pending. Replace this example with the approved Partner logo and an Institute-specific description before production publication.

Review destination: [GCI October 2026](https://ipmi.webflow.io/institutes/healthcare-gci-oct-2026), above ordinary sponsors. Both modified records were queued for next site publish; item-level Publish now was never used.

IPMI must supply the real Institute slug(s), exact approved existing Partner ID or approved new Partner name/slug/logo/website, logo rights and identity confirmation, optional Institute-specific description of at most 200 characters, approval owner/date, and retain/replace/remove decision. In native CMS, change GCI's Chair Sponsor to that approved Partner and replace its Chair Sponsor Description; clearing only description intentionally leaves logo/heading. Verify Partner Name is an appropriate accessible identity because alt follows it. Do not silently rename this demonstration as a real sponsor without the explicit approval record. Clear every Institute reference to the placeholder, then archive the placeholder Partner when unused; do not delete or alter other Partners. Its required invalid URL must never become a CTA or ordinary sponsor assignment. Preserve its item indexing Off until retirement. Recheck staging, then resolve the separate production-publication approval.

## Verification

- [Native boundary evidence](description-native-boundary.json): attempted 201 characters; native textarea `maxlength=200` retained exactly 200. [393px Designer screenshot](chair-mobile-200-char-designer.png) shows the 200-character copy wrapping within 353px, no overflow. Final 165-character copy restored before publication.
- [Empty-description evidence](empty-description-designer.json): saved empty value renders description `display:none`, 0×0 rectangle; wrapper and logo remain. Test used GCI only; no other Institute test assignments.
- [Desktop staging](chair-desktop-staging.png), 1912×970; [mobile staging](chair-mobile-staging.png), 390×844. Actual PNG dimensions inspected. Transparent image displays clearly on the existing light section; actual image is 200×200. At 390px, chair/paragraph width 350px and body scroll width 390px. Logo has meaningful Partner identity alt and no link.
- EHS `6a46ac429cad4c03adc65259` / `ehs-jan-2027` and HIT `6a062fba0e49a14badf21c95` / `hit-2027`: published DOM contains zero chair wrappers. HIT's pre-registration heading and `#invitation` route remain. [EHS DOM](ehs-no-chair-dom.txt), [HIT DOM](hit-no-chair-dom.txt).
- [Independent root verification](root-verification.json): all 103 Institute IDs/flags and original fields unchanged; exactly the two intended GCI values added, 204 other new values null. GCI/EHS/HIT/HRMI October original image arrays (119/20/20/91), link arrays (104/74/74/100), forms and external script pins preserved. Only GCI adds chair artwork. Existing ordinary sponsor order remains intact; GCI retains 28 sponsors. HRMI verifies the released absent-chair regression alongside Horizon cases.
- [Publish selection](publish-staging-only.png), [publish result](publish-success.txt): staging published, production unchecked and unchanged. No submissions or external messages.
- Before-state evidence: [schema UI](institute-schema-ui-before.txt), [GCI CMS](gci-cms-before.txt), [ordinary sponsors HTML](gci-sponsors-before.html), [ordinary sponsor screenshot](gci-sponsors-before.png). [Final CMS](gci-cms-final.txt), [native element HTML](chair-native-template.html).
- Native-only implementation; no runtime build needed. Changed documentation formatted with `vp fmt`; targeted format/link/evidence checks recorded in `validation.txt`. Full `vp run verify` is not claimed: accumulated documentation had pre-existing formatting failures recorded by task 34; normalization remains task 37.

## Rollback

In Designer remove or hide only wrapper `06ed5f80-2e24-99aa-b833-ef5455f33fad` and its three new children. Preserve the Section Headings, both Slider branches and all existing IDs. Clear GCI's two new fields to their prior blank state, queue it for next site publish, and publish staging only. Archive the unused placeholder Partner after checking references; retain original Partner data. Optional field additions can remain empty for a non-destructive rollback. Remove schema fields only after a reviewed reference/content audit; do not remove other fields or shared data. No CSS/JS rollback is needed.
