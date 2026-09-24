# 02 Institute statistics changed to 20

Owner: Webflow implementer. Content owner: IPMI.

Status: Ready for implementation. Documentation only; no website edits performed.

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

- [ ] Home and About show 20 before and after the animation.
- [ ] A reload and repeat scroll do not restore 17.
- [ ] Static/reduced-motion presentation gives a correct readable count.
- [ ] Other statistic values, labels, and animation behavior remain correct.
- [ ] Desktop, tablet, and mobile text fits the original statistic layout.
- [ ] Actual live controller and staging evidence are recorded for [37 Integrated verification](37-staging-verification.md).

## Rollback

Restore the captured static text and original animation endpoint together. Restore only the versioned staging asset or affected Webflow interaction/code field where applicable; do not modify the unversioned shared production asset. Republish staging and verify both pages use the restored matching values.
