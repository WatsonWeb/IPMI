# Task 31 — provisional About gallery handoff

September 24, 2026. Editor: Codex, read-only Chrome staging verification. [About staging](https://ipmi.webflow.io/about#about). Content/destination owner: IPMI.

## Retained content

No additional approved images or destination manifest was supplied. The [exact manifest](retained-about-manifest.json) captures all six placements, actual asset URLs, full CMS field sets from the September 24 baseline, and current Chrome-observed wrappers/links. CMS asset URLs may use the older uploads hostname; the rendered CDN URL has the same file ID and filename. No website field, asset, binding, ordering, runtime file, or publishing state was changed.

| Register row | About position | Gallery Photos item ID | Retained image / CMS sort |
| --- | --- | --- | --- |
| 31-01 | Our Mission 1 | `6ab4bd3aeae4404f8477c276` | Approved P18 HRMI Apr 2025 Staff 1 / null |
| 31-02 | Our Mission 2 | `6ab4bd83211dc7575394d8e2` | Approved P19 HFI 2026 Staff / null |
| 31-03 | Carousel 1 | `63bf5bdc10f3fdd73323cc02` | HR July 2022 - Session Room / 4 |
| 31-04 | Carousel 2 | `63c9bbce840fddd0ef67c52a` | HCHR 2022 - Nas / 4 |
| 31-05 | Carousel 3 | `63c532de3b2b766fcec071e4` | HCHR 2022 - Networking / 5 |
| 31-06 | Carousel 4 | `63c9bca7764ce25d9543c712` | SOI 2022 Jenny / 6 |

Mission selects the two task 10 records explicitly, with About feature flags false, categories blank and sort null. The supplemental carousel retains its featured-flag filter and skip-two selection. Do not enable the Mission feature flags, repurpose shared categories/sort, or duplicate records to simulate final content. The hidden eight-profile Staff section remains untouched. Task 10 P16/P17 hero imagery also remains unchanged.

All six anchors retain `href="#"`, Webflow lightbox behavior and group `About`. Each thumbnail maps to the identical full-size image URL. They open a shared six-image overlay, not a Gallery page/record URL. No broken mapping requiring a correction was found. IPMI must specify whether final photos should continue opening this viewer or navigate to a particular approved Gallery destination.

## Verification and limits

- Chrome loaded all six thumbnails and all six full-size images. The [viewer observations](lightbox-checks.json) capture each selected item and loaded image; because transitions are asynchronous, each observation is the settled preceding selection, covering all six. [Exact live wrappers and lightbox JSON](live-about-links.json) verify the thumbnail/full-size mapping.
- Enter opened Mission and carousel lightboxes; Right advanced to P19; Escape closed the viewer and returned focus to the originating anchor. Carousel Next responded to Enter, Previous to Space, and slide-4 pagination to Enter, with the active slide and disabled end control verified.
- Zero nested anchors/buttons inside the six wrappers. Inherited accessibility defects remain task 19: all six use generic `open lightbox` names, four carousel thumbnails have empty alt, generated full-size images omit alt, and carousel anchors override link semantics with `role="listitem"`. This is a functional keyboard check, not a complete accessibility pass or focus-trap audit.
- 1440px and 390px document widths matched their viewports. At 768px the document is 790px wide, matching the inherited shared-navigation issue owned by task 37. Mission crops and carousel content remain usable. Visible Swiper status text is also already assigned to task 37.
- [Root preservation check](root-verification.json): all 20 image tags, 94 anchor tags and 22 script tags match the before-content-tasks staging snapshot. Root independently inspected corrected Mission desktop/mobile screenshots and confirmed approved P18/P19 crops and Institutes 20.
- No publish performed. Production stylesheet SHA256 remains `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496`.
- Owned QA tab closed; viewport override reset; original tabs left untouched and Chrome released.

Screenshots: [desktop Mission](desktop-mission.png), [desktop carousel](desktop-carousel.png), [tablet Mission](tablet-mission.png), [mobile Mission](mobile-mission.png), [mobile lightbox](mobile-lightbox.png), [mobile carousel](mobile-carousel.png). Mission screenshots were recaptured after scroll settled and visually checked.

## Exact replacement and rollback instructions

For each manifest row, IPMI must approve retention or supply: original file/download, usage/attribution rights, verified event/subject, exact named replacement position, caption/descriptive alt, intended gallery URL or lightbox grouping, and final display order. Identify additions separately and mark the manifest complete or partial. P18/P19 are already approved assets; do not replace them without explicit superseding instructions. The four carousel rows remain provisional.

Implement final mappings through Chrome Designer using the existing wrapper and CMS item where appropriate, preserving other references to shared items; test the actual destination and responsive/keyboard behavior, then follow staging-only publishing safeguards. Record any future field delta separately. Task 31 has no website delta to roll back: previous values equal retained values in every row. Preserve task 10 and all unrelated website work. Final content/destination approval and task 19 accessibility acceptance remain outstanding.
