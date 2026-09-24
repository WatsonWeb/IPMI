# 26 — KBYG agenda-link presentation

[Back to master](README.md)

- **Owner:** Bryan / Webflow implementation; IPMI Operations supplies event agenda destinations and approved copy.
- **Status:** Documented; Webflow implementation and staging acceptance are not started in this documentation pass.
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

1. [ ] Open the correct IPMI site in Webflow Designer in **Chrome**, then the KBYG Pages Collection Template. Capture the agenda section, native binding, old copy and current custom-code pins before editing.
2. [ ] Preview a Delegate and Sponsor record. Confirm whether both use this shared agenda section, and verify the actual linked Institute and Agenda Link field on each.
3. [ ] Confirm approved agenda destinations against the event/audience matrix in [36](36-kbyg-operations-content.md). Record missing destinations as blocked rows.
4. [ ] Remove the rendered Agenda Days Collection List/grid through Designer, leaving its CMS data untouched. Keep the existing section, heading ID, navigation anchor and full-agenda CTA.
5. [ ] Set the heading to `Institute Agenda`; remove obsolete At-A-Glance copy. Keep the CTA connected through the native Webflow field selector to the referenced Institute's Agenda Link.
6. [ ] Preserve native conditional visibility and the existing empty-content pattern for missing agenda URLs. Verify the empty state is useful and is not duplicated.
7. [ ] Synchronize only the maintained source corresponding to the actual template. Adjust markup and content checks to require the compact heading, `#agenda` section and bound full-agenda CTA and to reject the obsolete grid. Remove the old presentation's requirement for nonempty `agendaDays` without deleting CMS data or weakening unrelated assertions.
8. [ ] If runtime or CSS changes prove necessary, publish a separate immutable asset version and select that pin in Webflow. Never overwrite the unversioned shared global CSS URL used by production.
9. [ ] Publish only to **ipmi.webflow.io**, then complete the checks below. Record staging URLs, screenshots and any unresolved event rows in [37](37-staging-verification.md).

## Required inputs and dependencies

| Input                           | Source / owner                                                      | Handling                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Event-specific agenda URL       | Referenced Institute > Agenda Link; IPMI Operations                 | Reuse approved current URL; block a missing or incorrect event destination.                                        |
| Event/audience coverage         | [25](25-kbyg-page-coverage.md), [36](36-kbyg-operations-content.md) | Apply template behavior to all approved records; do not infer a complete event roster from the initial four pages. |
| Maintained custom-code checkout | Bryan; live pin comparison                                          | Use the source that matches the deployed KBYG template, not legacy files merely present in this checkout.          |

## Acceptance checks

- [ ] Both audience variants show the compact Institute Agenda section and the correct event's agenda document.
- [ ] Agenda At-A-Glance day cards and obsolete title text are absent from the rendered page.
- [ ] Desktop pill navigation, mobile navigation and a direct `#agenda` URL reach the visible agenda heading without overlap.
- [ ] A record with no agenda URL preserves its established empty-content behavior and has no dead or unrelated CTA.
- [ ] Existing Agenda Days references and records remain available for rollback.
- [ ] If maintained code changes, run its configured `vp check`, `vp build`, relevant KBYG tests and markup checks; use `vp run verify` when that is the verified checkout's aggregate gate.
- [ ] At desktop, tablet and mobile widths, the shorter section has correct spacing, readable links and no overflow; indexing behavior is unchanged.

## Rollback

Restore the captured agenda section and its native Collection List binding in Designer, along with the previous title/intro and asset pins if changed. Reuse retained Agenda Days references; do not recreate or duplicate records. Republish only staging and verify `#agenda` navigation and the correct event link.
