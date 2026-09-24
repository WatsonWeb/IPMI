# 01 Homepage and repeated Institute overview copy

Owner: Webflow implementer. Content owner: IPMI.

Status: Ready for implementation. Documentation only; no website edits performed.

[Back to master](README.md)

## Source and targets

- [Copy to Edit.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQB-J292Wk3bSr5qa-ma4XvjAWwp5nq2sYY9Gg1g6ZAA6Zk?e=Z5tEbC): page 1, overview and Get Practical rows; page 2, Engage & Connect row.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Homepage](https://www.ipmievents.com/): Institute overview, Get Practical card, and Engage & Connect card.
- [Upcoming Institutes](https://www.ipmievents.com/institutes): repeated Institute overview. Preserve each page's existing heading, links, and layout.

## Current state and required result

Chrome research found the old overview on both the homepage and `/institutes`, including “collaborative exchange and leadership development” and “make the most of a productive event experience.” The homepage's old Get Practical text begins “Institutes deliver strategies and tactics that can be implemented upon returning to work”; its Engage & Connect list includes Sales & Marketing and omits Finance and Technology. These are copy changes, not a new section design.

The exact Designer element names and whether each occurrence is a component property, static text, or CMS binding must be recorded during implementation. Do not assume that changing one occurrence updates the other.

## Approved replacement copy

| Destination                                 | Replacement                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Institute overview on `/` and `/institutes` | Institutes bring together CxOs from organizations across North America in an intimate and luxury setting for two-and-a-half days of networking, information exchange, and collaboration. Institutes are executed with an unwavering commitment to quality and excellence, allowing you to curate a valuable and productive experience. |
| Homepage — Get Practical                    | Institutes deliver insights, strategies, and tactics that can be leveraged to positively impact your team and organization.                                                                                                                                                                                                            |
| Homepage — Engage & Connect                 | Interact with industry leaders in Healthcare, Human Resources, Environmental Health & Safety, Legal, Finance, and Technology                                                                                                                                                                                                           |

The overview corrects the supplied document's duplicated “a a” to “a”; all other wording is preserved. Keep the source's absence of terminal punctuation in Engage & Connect.

## Chrome and Webflow implementation checklist

1. Open the IPMI Webflow project in Chrome; follow the master document's staging and asset rules. Capture the existing text and screenshots of each target at desktop and mobile widths.
2. Open Home in Designer, select the existing overview text, and inspect its binding. Replace only its copy with the table's overview; preserve rich-text structure and existing links if present.
3. Replace the body copy in the existing Get Practical and Engage & Connect cards. Preserve their titles, icons, and card links.
4. Open Institutes and replace the repeated overview. If it is shared through a component, verify both page instances after changing the shared value; avoid duplicate overrides.
5. Search the live site and available Designer pages for the distinctive old overview wording. Record any additional real occurrences and apply the same approved replacement where it is the same Institute overview; do not alter event-specific descriptions.
6. Preview the affected sections at desktop, tablet, and mobile breakpoints. Confirm the longer overview fits without clipping, overlap, or unintended type/style changes.
7. Publish the changed pages to Webflow staging only and record URLs, screenshots, date, and checked occurrences in this task.

## Required fields and dependencies

No new fields or collections. Requires editable text/component/CMS access to the existing target sections. Coordinate with [02 Institute statistics](02-institute-statistics.md), [05 Homepage photos](05-homepage-photos.md), and [06 Upcoming Institutes photos](06-upcoming-institutes-photos.md). Refresh the chatbot's source content after staging acceptance through [22 Chatbot knowledge](22-chatbot-knowledge-and-training.md).

## Acceptance checks

- [ ] Both known overview occurrences exactly match the approved text and contain no “a a”.
- [ ] Get Practical and Engage & Connect match the table, with Finance and Technology present and Sales & Marketing removed from that card.
- [ ] Additional repeated-overview occurrences, if discovered, are listed and reconciled.
- [ ] Existing headings, CTA destinations, component behavior, and event-specific copy remain correct.
- [ ] No clipped or overlapping copy at desktop, tablet, and mobile widths.
- [ ] Staging evidence is recorded for [37 Integrated verification](37-staging-verification.md).

## Rollback

Restore each saved original text value in its original component/CMS/static location, then republish staging. Recheck both known overview occurrences after restoring any shared component. Do not replace a complete page or unrelated component version for a text-only rollback.
