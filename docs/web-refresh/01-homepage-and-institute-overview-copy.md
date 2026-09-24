# 01 Homepage and repeated Institute overview copy

Owner: Webflow implementer. Content owner: IPMI.

Status: Staged for review. Five static text values updated in Webflow on September 23, 2026 (September 24 UTC); production publication remains separate.

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

- [x] Both known overview occurrences exactly match the approved text and contain no “a a”.
- [x] Get Practical and Engage & Connect match the table, with Finance and Technology present and Sales & Marketing removed from that card.
- [x] Additional repeated-overview occurrences, if discovered, are listed and reconciled.
- [x] Existing headings, CTA destinations, component behavior, and event-specific copy remain correct.
- [x] No clipped or overlapping copy at desktop, tablet, and mobile widths.
- [x] Staging evidence is recorded for [37 Integrated verification](37-staging-verification.md).

## Rollback

Restore each saved original text value in its original component/CMS/static location, then republish staging. Recheck both known overview occurrences after restoring any shared component. Do not replace a complete page or unrelated component version for a text-only rollback.

## Implementation and staging evidence

**Date/editor:** September 23, 2026 America/Chicago (September 24 UTC), task 01 agent through Chrome Webflow Designer, active account **IPMI Webmaster**, site **IPMI**. The task agent held exclusive Designer/CMS control. No CMS item, stylesheet, script, asset, heading, link, or style setting was edited.

### Exact locations and rollback values

All five targets are independent static paragraph elements named **Content**, not CMS fields or shared component properties. Each overview is under `Feature Section > Container > Home - What We Do Wrap > Home - What We Do > Home - What We Do Content > Content`. Home retains `Content Margin-Bottom-0 450`; Upcoming and Recent Institutes retain `Content 450`.

| Page/target                                                                                           | Prior value                                                                                                                                                                                                                                                                                                                                 | Saved replacement                                                        |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Home `/`, overview                                                                                    | Institutes bring together CxOs from organizations across North America in an intimate and luxury setting for two-and-a-half days of collaborative exchange and leadership development. Our Institutes are executed with an unwavering commitment to quality and excellence, allowing you to make the most of a productive event experience. | Exact approved Institute overview above                                  |
| Upcoming Institutes `/institutes`, overview                                                           | Same prior overview as Home                                                                                                                                                                                                                                                                                                                 | Exact approved Institute overview above                                  |
| Recent Institutes `/recent-institutes`, overview, discovered during the required repeated-copy search | Same prior overview as Home                                                                                                                                                                                                                                                                                                                 | Exact approved Institute overview above                                  |
| Home, Get Practical                                                                                   | Institutes deliver strategies and tactics that can be implemented upon returning to work, impacting your business next-day.                                                                                                                                                                                                                 | Exact approved Get Practical copy above                                  |
| Home, Engage & Connect                                                                                | Interact with industry leaders in Environmental Health & Safety, Healthcare, Human Resources, Legal, Sales & Marketing.                                                                                                                                                                                                                     | Exact approved Engage & Connect copy above, with no terminal punctuation |

The two card paragraphs are under `Feature Section > Container > Home - Icon Boxes > Slider > Cards Wrapper > Cards > Card Wrapper > Card > Card Content Wrap > Content`, distinguished by their existing card headings. Their existing `Bottom Card Link` siblings remain separate: Get Practical links to `#stats`, Engage & Connect to `#institutes`. The overview CTA on both Institutes pages remains `/attend`. The paragraph elements contain plain text; existing heading emphasis, icons, video thumbnails, Learn & Grow copy, and event content were retained.

The initial inline edit inserted at the caret rather than replacing the paragraph. This was corrected before publication by activating text-edit mode, explicitly selecting all paragraph text, and replacing it. Exact final text was checked in the Designer and independently in staging HTML; no intermediate malformed text was published.

### Publish safeguards and scope

- The initial Publish dialog selected both `ipmi.webflow.io` and `www.ipmievents.com`. Production was deselected before editing; each of the two staging publications was preceded by a fresh check that only `ipmi.webflow.io` was selected. The second publication added the discovered Recent Institutes occurrence.
- Initial CMS review found all four KBYG Pages marked Published; queued-to-publish filters returned no records in Institutes and Recaps. No CMS records or draft states were changed. This was a targeted review, not an audit of every collection's drafts. The existing publish UI reported an audit issue before the edits; no audit settings were changed.
- After publication, Webflow showed staging “Published a few seconds ago” while production retained its earlier timestamp. Independent public HTML checks returned HTTP 200 for all three production pages, with the original overview still present and the approved replacement absent.
- Only browser content changes and this evidence record belong to task 01. The Git commit records evidence; it does not contain or deploy the Webflow state. No production-connected unversioned asset was modified.

### Repeated-copy search and checks

The lead's read-only crawl of all 15 top-level public sitemap URLs returned HTTP 200 and found the distinctive old overview only on `/`, `/institutes`, and `/recent-institutes`. No match appeared on `/recaps`, `/thinktanks`, `/gallery`, `/faq`, `/testimonials`, `/privacy`, `/contact`, `/attend`, `/about`, `/terms`, `/download`, or `/insights`. Chrome Designer inspection additionally found no matching overview on **Upcoming Institutes - Agents** or **Institutes on the Horizon**. The additional Recent Institutes paragraph was independently inspected and updated through Chrome.

| Staging URL                                                    | Exact copy and links                                              | Desktop 1280 × 1000 | Tablet 820 × 1000 | Mobile 393 × 1000                                    |
| -------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------- | ----------------- | ---------------------------------------------------- |
| [Home](https://ipmi.webflow.io/)                               | Approved overview and both cards; `#stats`/`#institutes` retained | Pass                | Pass              | Pass; Next slide displays Engage & Connect correctly |
| [Upcoming Institutes](https://ipmi.webflow.io/institutes)      | Approved overview; `/attend` CTA retained                         | Pass                | Pass              | Pass                                                 |
| [Recent Institutes](https://ipmi.webflow.io/recent-institutes) | Approved overview; `/attend` CTA retained                         | Pass                | Pass              | Pass                                                 |

All nine staging viewport checks used Chrome with published custom code active. Copy fit without clipping or overlapping its heading, image, adjacent card, or CTA. The existing mobile carousel remained functional. Desktop and mobile before-edit Designer screenshots, and the staging viewport screenshots, were captured and visually reviewed in the task conversation; they are not separate committed image files. The temporary browser viewport override was reset after verification.

Independent staging HTML verification also confirmed HTTP 200 and the exact approved overview on all three pages, with distinctive old wording absent; both homepage card strings matched exactly. No new automated tests were needed for these static text edits. Task 02 statistics, tasks 05–07 imagery, and task 22 chatbot refresh remain separate. There are no unresolved task 01 content dependencies or placeholders.
