# 26 — KBYG agenda cards and full-agenda link

> **Current task 37 handoff — September 24, 2026:** User clarification supersedes the earlier compact-only presentation: keep agenda DAY CARDS AND the full PDF link. Current HCHR both audiences and EHS Delegate have three cards each; 16 pages have linked native agendas and 38 remain pending. All 43 blocks are preserved. Task 37 verifies navigation and resolves the old repository check failures. The implementation plan and 14/40 completion record below describe the earlier task 26 state, not current instructions to hide the cards. See [final evidence](evidence/task37/README.md) and [current replacement guide](PLACEHOLDERS.md).

[Back to master](README.md)

## Current requirement — September 24, 2026 clarification

The user clarified that KBYG pages must show the day cards **and** the full-agenda PDF button. This supersedes the compact-only presentation described in the historical implementation below. Do not hide the Agenda Days Collection List Wrapper or reject agenda cards in markup validation.

The shared wrapper `7f80455b-24bc-7078-915e-3ce9d354d889` is Visible again. Its native source remains the current KBYG Page's **Agenda Days** multi-reference; card headings bind to the referenced block's **Title**, and content binds to **Body**. The button retains its native referenced Institute **Agenda Link** binding. Existing CMS content and reference order are preserved.

Live Chrome verification of `ehs-jan-2027-delegate#agenda` after staging publication shows three cards (Sunday, Monday, Tuesday; 3/4/3 schedule rows) and the full-agenda button. The destination opens **EHS Management Institute January 2027.pdf** in SharePoint. Staging publication completed at `2026-09-24T14:06:51.027Z`; all four production-domain publish timestamps remained `2026-09-24T03:17:26.557Z`.

The EHS page currently references **Static - Agenda Day 1/2/3**, all published. Those records retain legacy **HCHR Sept 2026** Institute metadata despite their shared static names and content. This change restores the existing selected cards without retagging shared records or inventing an EHS schedule. Event-specific timing/content approval remains with Operations.

The maintained scaffold and markup check now require cards alongside the full-agenda link. Existing support for sparse pages with no Agenda Days remains. No runtime or stylesheet deployment was needed.

Validation: Chrome at 1912px, 768px, and 390px confirms three populated cards, ten schedule rows, the PDF button, and no horizontal overflow. Desktop cards are side by side; tablet and phone cards stack. The markup check, CMS fixture validation, scoped formatting, and 63 relevant CMS-rendering/validator tests pass.

## Historical compact-only implementation (superseded)

- **Owner:** Bryan / Webflow implementation; IPMI Operations supplies event agenda destinations and approved copy.
- **Status:** Provisionally staged for review — compact presentation and navigation verified September 24, 2026; 20 event agenda destinations remain pending Operations.
- **Sources:** [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), KBYG request to replace Agenda At-A-Glance with agenda links; accepted documentation plan.
- **Depends on:** The existing shared KBYG template and approved event-specific Agenda Link values. Coordinate added-page coverage with [25](25-kbyg-page-coverage.md) and missing content with [36](36-kbyg-operations-content.md); the existing-page presentation change can proceed before new pages are complete. Validate with [37 — staging verification](37-staging-verification.md).

## Target and current evidence

Target the **KBYG Pages Collection Template**, both Delegate and Sponsor variants, at the section `id="agenda"`, `data-kbyg-section="agenda"`. Keep the section heading ID `kbyg-agenda-title` and the existing `#agenda` navigation destination.

The maintained CMS-rendering work, now consolidated into this checkout on `master`, provides implementation evidence in `Page HTML/KBYG Pages/KBYG-Template.html`: an Agenda At-A-Glance heading and `.kbyg-agenda-grid` precede a `VIEW FULL INSTITUTE AGENDA` link. Its native binding points to the referenced Institute's **Agenda Link**. This is repository evidence, not proof that every live record currently has an approved agenda URL; recheck the actual binding in Chrome before editing.

The local `scripts/check-kbyg-markup.ts` currently requires the literal `Agenda At-A-Glance.` and the `agenda` section. Update checks that require the removed grid, heading or nonempty `agendaDays` for the old presentation; retain the section-navigation contract and validation of any retained agenda data. Confirm the deployed template's source revision before changing source files.

## Requested result and interfaces

- Remove the day-by-day Agenda At-A-Glance grid from the rendered template. Keep a compact agenda section and the event-specific full-agenda CTA.
- Use **Institute Agenda** as the concise replacement heading. Keep `VIEW FULL INSTITUTE AGENDA` as the CTA label. Retain approved descriptive copy only if it still makes sense without the grid; do not leave the old grid-specific explanation.
- Preserve native binding to the referenced Institute's Agenda Link; never hard-code one event's document across the template.
- Leave existing **Agenda Days** multi-reference values and **Agenda Day** content-block records in the CMS for rollback. No field deletion or data migration is required.
- When Agenda Link is empty, hide the CTA using the existing empty-link behavior and preserve the existing native empty-content handling. Do not invent a new notice if the current native empty state already handles it; do not publish a dead `#` link or borrow another event's agenda.
- Preserve existing audience logic, `noindex,follow` behavior, curve styling, sticky navigation and section-jump behavior.

## Ordered Chrome implementation checklist

1. [x] Open the correct IPMI site in Webflow Designer in **Chrome**, then the KBYG Pages Collection Template. Capture the agenda section, native binding, old copy and current custom-code pins before editing.
2. [x] Preview a Delegate and Sponsor record. Confirm whether both use this shared agenda section, and verify the actual linked Institute and Agenda Link field on each.
3. [x] Reconcile existing agenda destinations and pending Operations approval against the event/audience matrix in [36](36-kbyg-operations-content.md). Record missing destinations as blocked rows.
4. [x] Remove the rendered Agenda Days Collection List/grid through Designer, leaving its CMS data untouched. Keep the existing section, heading ID, navigation anchor and full-agenda CTA.
5. [x] Set the heading to `Institute Agenda`; remove obsolete At-A-Glance copy. Keep the CTA connected through the native Webflow field selector to the referenced Institute's Agenda Link.
6. [x] Preserve native conditional visibility and the existing empty-content pattern for missing agenda URLs. Verify the empty state is useful and is not duplicated.
7. [x] Synchronize only the maintained source corresponding to the actual template. Adjust markup and content checks to require the compact heading, `#agenda` section and bound full-agenda CTA and to reject the obsolete grid. Remove the old presentation's requirement for nonempty `agendaDays` without deleting CMS data or weakening unrelated assertions.
8. [x] If runtime or CSS changes prove necessary, publish a separate immutable asset version and select that pin in Webflow. Never overwrite the unversioned shared global CSS URL used by production.
9. [x] Publish only to **ipmi.webflow.io**, then complete the checks below. Record staging URLs, screenshots and any unresolved event rows in [37](37-staging-verification.md).

## Required inputs and dependencies

| Input                           | Source / owner                                                      | Handling                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Event-specific agenda URL       | Referenced Institute > Agenda Link; IPMI Operations                 | Reuse approved current URL; block a missing or incorrect event destination.                                        |
| Event/audience coverage         | [25](25-kbyg-page-coverage.md), [36](36-kbyg-operations-content.md) | Apply template behavior to all approved records; do not infer a complete event roster from the initial four pages. |
| Maintained custom-code checkout | Bryan; live pin comparison                                          | Use the source that matches the deployed KBYG template, not legacy files merely present in this checkout.          |

## Acceptance checks

- [x] Both audience variants show the compact Institute Agenda section and the correct event's agenda document.
- [x] Agenda At-A-Glance day cards and obsolete title text are absent from the rendered page.
- [x] Desktop pill navigation, mobile navigation and a direct `#agenda` URL reach the visible agenda heading without overlap.
- [x] A record with no agenda URL preserves its established empty-content behavior and has no dead or unrelated CTA.
- [x] Existing Agenda Days references and records remain available for rollback.
- [x] If maintained code changes, run its configured `vp check`, `vp build`, relevant KBYG tests and markup checks; use `vp run verify` when that is the verified checkout's aggregate gate.
- [x] At desktop, tablet and mobile widths, the shorter section has correct spacing, readable links and no overflow; indexing behavior is unchanged.

## Rollback

Restore the captured agenda section and its native Collection List binding in Designer, along with the previous title/intro and asset pins if changed. Reuse retained Agenda Days references; do not recreate or duplicate records. Republish only staging and verify `#agenda` navigation and the correct event link.

## September 24, 2026 completion

Implemented through native Chrome Designer/CMS as IPMI Webmaster. [Evidence](evidence/task26/README.md) includes original fields, exact applied delta, native binding/visibility, staging publication destinations, all-54 HTTP reconciliation, 54-page/43-block preservation, four-width screenshots and measured navigation.

The shared Agenda Days Collection List Wrapper is now **Hidden**, with **Keep in HTML when hidden off**. This deliberately removes the rendered grid and its duplicate empty notice while retaining the native list binding, all Agenda Days references and all 43 blocks for rollback. The `agenda` section and `kbyg-agenda-title` remain. All 54 headings read **Institute Agenda**. Only six CMS fields changed: four original `agenda-title` values and both HCHR `agenda-intro` values, now `View the full Institute agenda for program details.` Existing pending intros remain unchanged.

The CTA retains the native referenced Institute `targets-section-institute-agenda-link` binding. Seven distinct existing Institute URLs serve 14 pages; 20 Institutes / 40 pages have empty destinations and no visible/focusable CTA. Existing empty-link handling remains; no fake destination was authored. The [54-row agenda register](evidence/task26/agenda-register.json) identifies actual page/event IDs, exact URLs/intro text and pending replacements. Final Operations approval remains separate from presentation acceptance.

A reload after a viewport change reproduced browser scroll restoration overriding initial hash alignment: HCHR Delegate at 768px initially aligned, then returned to the prior mobile scrollY 4014, leaving its heading at -522.516px. The scoped runtime re-aligns the initial hash after `pageshow` in an animation frame, skips persisted history restoration and cancels on visitor wheel/touch/pointer/key/change/hash intent. Eight regression cases cover restoration and noninterference. Immutable runtime pin is `1afeaaadea5b1f0a1e5d87819d2443b224e37a06/dist/ipmi-kbyg.js`; CSS pin remains `0bee9be0be82a5cbd03eab614bada158b88957c1/ipmi-kbyg-styles.css`. The exact reload sequence now settles at heading 186.484px, nav bottom 133px, scrollY 3305, active agenda. Original task25 click symptom did not recur in the settled pointer/keyboard/select matrix.

Staging only was published three times, with every displayed production choice unchecked. Native site metadata confirms all four custom-domain timestamps remain unchanged. No CMS Publish now, production publish, forms, email or messages were used.

Validation: targeted runtime/validator 64 tests pass; lint, TypeScript, build, markup, CMS fixture, scope, global CSS and style baseline pass. Full suite is 249/250: the pre-existing task24 calendar entry inventory failure remains task37. Aggregate `vp run verify` stops on accumulated formatting issues (149 files before final scoped formatting), so no full-gate pass is claimed. Protected global CSS SHA256 remains `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496`.

The obsolete Sponsor tablet agenda minimum height (1222px) is overridden only at 768–991px by the six-line supplement `b469ddcbe2f81466fa450a1d187a68ef0739b10c/ipmi-kbyg-agenda.css`. Frozen base CSS and its baseline remain unchanged. Affected sections now measure 287px pending / 342.594px linked. Eighteen additional measured checks cover all three Sponsor examples at 768/991, boundary preservation at 767/992 and reload/navigation.

Task-specific rollback: remove the supplement link; set only the retained agenda wrapper Visible; restore the four title/two intro values from the native verification delta and, if needed, prior runtime pin `298d6f6925b4c91cb7e35bccae0dd3cd790cbbef`. Do not restore whole-site backups or recreate/delete CMS records. Republish staging only and recheck event-specific links/navigation.
