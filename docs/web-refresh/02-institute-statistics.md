# 02 Institute statistics changed to 20

Owner: Webflow implementer. Content owner: IPMI.

Status: Staged for review. Home and About static values and active counter endpoints are 20; production remains unchanged.

[Back to master](README.md)

## Source and targets

- [Copy to Edit.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQB-J292Wk3bSr5qa-ma4XvjAWwp5nq2sYY9Gg1g6ZAA6Zk?e=Z5tEbC): page 2, Institute-count row, requesting **20**.
- Web Refresh Master To-Do: copy updates across all pages; source attachment is recorded in the master.
- [Homepage](https://www.ipmievents.com/) and [About IPMI](https://www.ipmievents.com/about) annual Institute statistic: visible fallback text and the animation's destination value.

## Current state and required result

The homepage's Designer text and published animation were observed displaying **17** during Chrome research. The local legacy Home and About footer files each contain `new countUp.CountUp("stat-institutes", 17, { duration: 1 })`. Those files identify a possible cause but are not proof that the live site executes the same code. The About page's current static value, current live animation controller, and any shared component must be verified in Chrome before editing.

The approved value is **20** everywhere this annual Institute statistic appears. Both static text and the actual live animation target must agree; changing text alone must not permit JavaScript to restore 17. Other statistics are outside this task.

## Implementation values

| Target                                                  | Required value                                             |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| Annual Institute count on Home                          | `20` in static text and animation endpoint                 |
| Same statistic on About IPMI                            | `20` in static text and animation endpoint                 |
| Other discovered instances of the same shared statistic | `20`, after confirming they describe the same annual count |

## Chrome and Webflow implementation checklist

1. Open Home and About IPMI in Chrome and capture the existing statistic before and after scrolling it into view. Record each page URL and whether both use a shared component.
2. In Webflow Designer, record the actual element, static value, relevant attributes, and controlling interaction/custom-code location. Treat the legacy `stat-institutes` identifier only as a search lead.
3. Change the visible fallback text to `20` in each independent instance or the appropriate shared source. Preserve its existing descriptive label.
4. Locate the active counter destination in Designer interactions, page/site custom code, or the verified deployed custom-code source. Change that destination to `20`. If source files are needed, first identify the maintained source that matches the live site; apply the master's isolated/versioned staging-asset rule.
5. Preview and publish to staging only. Reload, scroll the statistic into view, leave and revisit the page, and confirm the endpoint remains 20. Check reduced-motion behavior and static fallback where animation does not run.
6. Record the actual binding/controller edited, the previous value, staging URLs, and verification screenshots. Report any additional same-statistic occurrence in the task evidence.

## Required fields and dependencies

No new fields or collection changes. Requires access to the existing static statistic and its actual animation source. Coordinate with [01 Overview copy](01-homepage-and-institute-overview-copy.md) and [10 About IPMI photos](10-about-ipmi-photos.md). If current code is externally hosted, source reconciliation and staging asset isolation are prerequisites before changing its animation endpoint.

## Acceptance checks

- [x] Home and About static fallback and completed animation show 20 (the existing animated sequence begins at 0).
- [x] A reload and repeat scroll do not restore 17.
- [x] Static/reduced-motion presentation gives a correct readable count.
- [x] Other statistic values, labels, and animation behavior remain correct.
- [x] Desktop, tablet, and mobile text fits the original statistic layout.
- [x] Actual live controller and staging evidence are recorded for [37 Integrated verification](37-staging-verification.md).

## Implementation evidence — September 23, 2026 CDT / September 24 UTC

Editor: Codex task 02 worker, through Chrome Webflow Designer as **IPMI Webmaster**, site **IPMI**. Task 01's staged copy was retained. No CMS records, draft statuses, shared components, or shared CSS assets were edited. The initial Git worktree was clean at `3c602a9`.

| Location                                                                                                                                                                         | Previous                                                      | Staged result            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------ |
| Home, Stats Section → Stats Cards → first Stat Card → Stat Number, `#stat-institutes.stat-number.countup`                                                                        | Static `17`                                                   | Static `20`              |
| About IPMI (`63c500748ec2645bc65e5f9b`), About Section → Stats Cards → first Stat Card → Stat Number, `#stat-institutes`, Webflow element `d960841e-a36d-f224-876e-ac1494b9d83f` | Static `17`                                                   | Static `20`              |
| Home page settings → Custom code → Before `</body>`                                                                                                                              | `new countUp.CountUp("stat-institutes", 17, { duration: 1 })` | Endpoint `20`            |
| About IPMI page settings → Custom code → Before `</body>`                                                                                                                        | Same endpoint `17`                                            | Endpoint `20`            |
| Maintained `src/site/statistics.ts`, existing Home/About assertions in `tests/site-behaviors.test.ts`                                                                            | Institute target `17`                                         | Target/expectations `20` |

These are two independent page elements, not a shared component. Chrome inspection and UI clipboard capture verified the actual page-specific footer scripts before editing. They load CountUp 2.3.2 from jsDelivr and run inline; the maintained TypeScript bundles are **not** the controller currently bound to these pages. Each footer edit replaced only its single Institute endpoint string, retaining all other code, including the one-second counter duration, circular progress, observer thresholds (Home 0.75 / About 0.3), sliders, and About profile modal. No script URLs were changed and no rebuilt bundle was deployed. Existing public baseline HTML is retained locally in ignored `.webflow/web-refresh-2026-09-23-baseline/home.html` and `about.html`.

Staging URLs: [Home](https://ipmi.webflow.io/) and [About IPMI](https://ipmi.webflow.io/about).

- Both staging publish operations explicitly showed **ipmi.webflow.io checked** and **www.ipmievents.com unchecked**. The second corrected an About text-selection insertion caught during static HTML verification; final Designer DOM, script-disabled browser, and published HTML all verify exact `20`. No custom-domain publication was performed; the lead's independent production read still found `17` in both static and animated targets.
- With custom code active, Home was observed at `0` before intersection, intermediate animation values, then `20`. Home and About finished at `20` after reload and revisit. Other endpoints remain `2,000`, `300`, and `200`, with their existing plus signs and labels CXOs, Speakers, Partners.
- Script execution disabled before loading each staging page: exact static counts `20`, `2000`, `300`, `200`. Reduced-motion media emulation: both pages remained readable and finished at `20`. The existing script still animates under that preference; this change does not add a reduced-motion branch. Script execution and media emulation were restored afterward.
- Chrome screenshots inspected at desktop 1912px, tablet 768×1024, and mobile 390×844. All count text fits the original cards: Home uses four columns at desktop and two on smaller screens; About uses its sidebar stack at desktop, two columns at tablet, and one column at mobile. Temporary viewport overrides were reset.
- `vp run verify` passed: formatting, lint/type checks, build, unchanged-global-CSS and KBYG safeguards, **229 tests across 14 files**, and KBYG model validation. Built output was not deployed.
- No placeholders or new content dependencies. Task 37's integrated review and separate production approval remain outstanding.

Handoff: Chrome Designer left on About IPMI at its desktop 1279px canvas, no dialogs open. Browser control released. For future text edits, activate the inline editor, capture its AX state, issue select-all against the focused element in a separate call, then type and inspect the exact DOM text before leaving; combining those steps or using `fill` caused caret insertion in this session.

## Rollback

Restore the captured static text and original animation endpoint together. Restore only the versioned staging asset or affected Webflow interaction/code field where applicable; do not modify the unversioned shared production asset. Republish staging and verify both pages use the restored matching values.
