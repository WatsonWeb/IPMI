# Task 32 — retained Attend, Speak and Partner photographs

September 24, 2026. Codex task worker; provisional review content, final IPMI approval pending. Staging page: [Attend](https://ipmi.webflow.io/attend), anchors `#attend`, `#speak`, `#partner`; page ID `63c3cdd3cff81805b2fec9e4`. Gallery Photos collection: `63bf18a0654be0fa16c240ad`.

## Exact replacement register

[retained-attend-manifest.json](retained-attend-manifest.json) is the authoritative 19-row replacement/rollback manifest: `32-01`–`32-06` Attend, `32-07`–`32-12` Speak, `32-13`–`32-19` Partner. Each row records its exact CMS ID, original fields (including image, caption, categories, sort order, name and slug), and both responsive placements with one-based section position, wrapper, rendered alt, asset, link name/href and full lightbox JSON. CMS asset URLs use the legacy `uploads-ssl.webflow.com` host; rendered equivalents use `cdn.prod.website-files.com`. Matching used the exact asset path, uniquely identifying one CMS record per photo. Original CMS values come from the root's read-only pre-task-29 collection capture; live placements were freshly read in Chrome.

The existing photographs are relevant to the three section subjects and are deliberately retained as temporary review content under Bryan's override. No new image/identity/event fact or empty placeholder was invented. There was no CMS, Designer, code, asset, form or publication change. Task 13's approved P24/P25 hero photos are outside these 19 records and remain intact.

For **each register row**, IPMI must provide approval to retain it or an original replacement file/URL, rights and attribution, verified subject/event, caption and descriptive alt, section and exact order, and an explicit destination decision. Current photo destinations are full-size lightboxes; separate View Gallery buttons go to `/gallery`. A requested Gallery record/page destination requires an exact approved item/URL, with any missing content coordinated through task 29. Do not interpret a missing lightbox group as a broken URL: all six desktop Speak photos opened successfully as individual lightboxes. Preserve the current category/sort values unless the approved row explicitly changes them; audit shared uses before altering any global Gallery record.

Apply future approved replacements in Chrome's Webflow Designer/CMS, update both responsive bindings, and repeat the affected link/crop/category checks. Preserve `#attend`, `#speak`, `#partner`, `#invite`, the existing category CTAs, task 03 copy, task 13 heroes, task 15 optional native Phone and task 16 footer email. Any later publish must visibly target only `ipmi.webflow.io` with custom domains unchecked. No publish was needed for this retention-only task.

## Checks and limits

- [browser-placements.json](browser-placements.json): all 38 live links; 6 Attend + 6 Speak + 7 Partner, each rendered twice. The raw `wrapper` field is the generated inner Swiper wrapper; the manifest gives the stable outer wrapper IDs.
- [lightbox-checks.json](lightbox-checks.json): each desktop and mobile placement activated using Enter after selecting its pagination position. All 38 opened the exact intended current asset and reported a loaded image with nonzero natural width. Escape dismissed each lightbox. Focus returned to its originating photo link in sampled checks. Desktop tested at 1440 × 1000, mobile at 390 × 844.
- [category-checks.json](category-checks.json): all three existing inquiry CTAs selected the expected visibly active category at 1440 and 390px. These are UI selection checks, **not** a tested submission payload, recipient or delivery result. No form submission or external message occurred.
- [preservation-checks.json](preservation-checks.json): existing copy, hero URLs/alts, optional `Phone` field, footer `info@ipmievents.com` and six responsive `/gallery` links retained. [root-preservation-verification.json](root-preservation-verification.json) independently compares staging source to the root baseline: all 43 image, 118 anchor, 53 script, 11 input and 1 form opening tags unchanged, and the full form byte-identical.
- [responsive-checks.json](responsive-checks.json): section geometry at 375, 767, 768 and 1024px; 4:3 cropped images retained. Document width matches 375/767/1024; at 768 the inherited navigation makes it 790. This is task 37, not a new section-image regression. Screenshots below visually verify representative crops and layout, not every possible crop at every viewport.
- Task 19 still owns generic `open lightbox` names, full-size lightbox images with empty alt, and missing visible focus outline on the sampled returned photo link (`outline-style: none`). Keyboard activation/return functioning does not establish accessible naming or visible-focus acceptance. Full accessibility acceptance remains open.
- Production unversioned `ipmi-custom-styles.css` was not changed; local SHA256 remains `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496`. No runtime/build changes, so no code test/build was warranted. Chrome viewport reset and only the worker-owned staging tab closed.

## Screenshots

Each saved file was visually inspected after settling its section navigation. Partner's long mobile section requires two frames.

| View                                             | Evidence                                                                                       |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Desktop Attend                                   | [attend-desktop.png](attend-desktop.png)                                                       |
| Desktop Speak                                    | [speak-desktop.png](speak-desktop.png)                                                         |
| Desktop Partner                                  | [partner-desktop.png](partner-desktop.png)                                                     |
| Mobile Attend                                    | [attend-mobile.png](attend-mobile.png)                                                         |
| Mobile Speak                                     | [speak-mobile.png](speak-mobile.png)                                                           |
| Mobile Partner text / photo                      | [partner-mobile.png](partner-mobile.png), [partner-mobile-photo.png](partner-mobile-photo.png) |
| Tablet Speak                                     | [speak-tablet.png](speak-tablet.png)                                                           |
| Mobile selected Partner inquiry / optional Phone | [partner-inquiry-mobile.png](partner-inquiry-mobile.png)                                       |

## Rollback

No site rollback is required: before/after website values are identical. Documentation can be reverted independently. For a later image update, restore only the changed row's captured CMS fields, placement/alt, order and lightbox configuration from the manifest; do not restore an entire site backup or undo approved heroes, copy, footer or forms. Final content approval and any future Gallery mapping remain IPMI inputs.
