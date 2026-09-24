# 33 — IPMI dependency: approved testimonial updates and CMS handoff

[Back to master](README.md)

**Owner:** IPMI approves quotations and attribution; BWC enters approved content and documents the CMS handoff. **Status:** Awaiting approved testimonial content; no CMS updates performed.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 2, **On our end**: update testimonials.
- Existing **Testimonials** CMS collection (68 records in the research snapshot), [Testimonials](https://ipmi.webflow.io/testimonials), and components/pages displaying referenced testimonial items.
- [11](11-testimonials-photos.md) separately covers the provided page-photo swaps.

## Current state and intended result

Update approved quotations, attributions, and associated references using the existing collection. No new testimonial wording is supplied by this task; do not invent quotes, silently paraphrase them, attach a quote to a guessed person/event, or delete existing content without a specific replacement/removal instruction.

## Required IPMI inputs

| Field group | Required detail                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| Quote       | Exact approved quote, whether new or replacement, and existing record/quote identifier if replacing.                      |
| Attribution | Approved speaker name, role/title, organization, and any anonymity requirement.                                           |
| Permission  | Confirmation that the quote, attribution, and optional headshot/logo are approved for website publication.                |
| References  | Intended Institute/event, audience/category, relevant existing CMS references, and pages/placements/order where required. |
| Media       | Approved headshot/logo asset links and alt context, only when the current testimonial design uses them.                   |
| Retirement  | Any explicit old items to retire and whether replacements preserve current page references.                               |

## Chrome / Webflow implementation checklist

1. Match approved content to current Testimonials records in Chrome. Record current fields and all known page/Institute references before editing or retiring an item.
2. Update matched records; create only explicitly new testimonials. Preserve exact approved wording and attribution, using existing field types and reference relationships.
3. Review the rendered quote on the Testimonials page and any referenced homepage/Institute components. Avoid broken references when retiring content; keep uncertain items unchanged.
4. Prepare a short CMS handoff in this task's implementation notes: how to locate the collection, edit the quote/attribution/reference fields, preview, and publish to staging. Use the live field labels in that handoff, not guessed schema names.
5. Complete media accessibility under [19](19-photo-accessibility.md) where applicable and stage the approved updates through [37](37-staging-verification.md).

## Acceptance checks

- [ ] Every changed quote and attribution exactly matches approved content and publication permission.
- [ ] Institute/person/category references and page placements are correct; no broken or duplicate testimonial references appear.
- [ ] Long quotations, optional media, and mobile card/carousel layouts remain readable.
- [ ] IPMI receives usable CMS edit/preview guidance without credentials or unsupplied claims.
- [ ] Task 11's page imagery is tracked separately, and unsupplied testimonials remain pending.

## Rollback

Record original quote/attribution/media/references and publication state. Restore those fields for replaced items; unpublish new items if required. Preserve referenced records until their consumers are checked.
