# Task 30 — provisional FAQ content handoff

September 24, 2026. Editor: IPMI Webmaster through Chrome UI. Staging: [FAQ](https://ipmi.webflow.io/faq#placeholder-question-replace-with-approved-faq). Final content owner: IPMI.

## Exact applied delta

Collection `63c103e2bb52da83c427f586`; new item `6ab4dcb7c6fcf3d14c3706d1`:

| Field | New value | Previous value |
| --- | --- | --- |
| FAQ Label / name | `Placeholder question — replace with approved FAQ` | No record |
| slug / anchor | `placeholder-question-replace-with-approved-faq` | No record |
| FAQ Answer / faq-answer | `<p>Placeholder: the approved answer will be added here.</p>` | No record |
| sort-order | `999` | No record |
| slider-images-sourced-from-gallery | `null` | No record |

The misleading CMS label help text says the name is not visible; the actual page binds it to the question and adds `?`. The record is visibly temporary and contains no invented event or policy facts. It follows the original orders 1, 2, 3, 4, 6, 7, 8.

The [before](faq-items-before.json) and [after](faq-items-after.json) snapshots preserve all seven original record IDs, fields and exact approved task 04 answers. The [13-placement manifest](retained-faq-images.json) maps every reference position (Institute 5, Think Tank 3, Business Meetings 5), gallery ID/name/slug, caption, asset, alt and lightbox destination. This includes a repeated photo across two FAQ groups. All imagery is retained provisionally, not newly approved. No gallery records were created.

## Verification

- Real Chrome baseline showed seven collapsed FAQ buttons and the task 12 hero images before mutation. CMS showed seven published FAQs and Gallery Photos 79. A separate unrelated KBYG draft was visible and left untouched.
- Save/queue completed; site publish UI visibly selected only `ipmi.webflow.io`, with `www.ipmievents.com` unchecked. Staging timestamp advanced; production remained five hours old. CMS timestamp for the new item: `2026-09-24T08:18:44.894Z`.
- [Independent root verification](root-verification.json): all seven original CMS field sets unchanged; original seven anchors remain; all 20 image tags and 29 script tags unchanged. Only link-tag addition is the existing template's hidden FAQ-template link for the new item. Production has no placeholder.
- Enter expanded the new example; Space collapsed it; visible answer exact. All seven existing accordions responded to keyboard expansion. Institute and Think Tank canonical anchors still scroll to their existing targets; anchor navigation itself does not automatically expand the accordion.
- At 390px the temporary question wraps cleanly; answer readable; document width 390. At 1440px document width 1440. At 768px new content fits, but document width is 790: inherited shared navigation overflow previously confirmed on production, tracked in task 37.
- Empty gallery contributes zero-size bounds and no empty-state text or blank photo space using existing suppression. No new conditional/code required.
- All 13 FAQ thumbnails loaded. Keyboard Enter opened the retained lightbox containing 13 items; Escape closed it. Generic `open lightbox` names and absent full-size alt are inherited task 19 issues, not claimed fixed here.
- No runtime/style changes. `ipmi-custom-styles.css` SHA256 remains `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496`.
- Owned QA tab closed and all temporary viewport overrides reset; original Designer tab left open and released.

Screenshots: [desktop](desktop-placeholder.png), [390px mobile](mobile-placeholder.png), [768px tablet](tablet-placeholder.png), [existing approved answers](tablet-approved-answers.png).

## Replacement and rollback

IPMI must provide exact additional questions/answers, intended order, approved links and whether the review example should be removed or replaced. For imagery, approve retention or provide original files, usage rights, exact FAQ associations, captions/alt, order and gallery destination. Do not treat the temporary example as production-ready.

To roll back only this task: set item `6ab4dcb7c6fcf3d14c3706d1` to draft/archive through CMS, save, and republish staging only. Preserve all seven original items and all 13 image references. No image rollback is needed because all prior values were retained. Remove the example before production publication unless replaced by approved content.
