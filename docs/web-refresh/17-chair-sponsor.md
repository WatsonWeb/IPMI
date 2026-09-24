# 17 — Institute chair-sponsor logo and description

[Back to master](README.md)

**Owner:** BWC / Webflow implementer; IPMI supplies sponsor assignment and approved description. **Status:** Native feature staged for review September 24, 2026, with an explicitly labeled neutral placeholder. Final sponsor identity, artwork and copy approval remain pending. [Implementation evidence and exact replacement procedure](evidence/task17/README.md).

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 1, chair logo above sponsors with a 200-character description.
- Webflow **Institutes** collection (103 records in the research snapshot) and its detail-page template, above the existing ordinary sponsor list. Reuse the existing **Partners** collection (571 records) for the sponsor entity/logo; do not create a competing sponsor collection.

## Current state and intended result

Add a single optional chair sponsor per Institute. Show the referenced Partner's logo and an Institute-specific description above ordinary sponsors, with the whole chair block hidden when no chair reference is set. Existing ordinary sponsor ordering and content remain unchanged.

Proposed fields below are implementation additions, not claims that they already exist. First inspect the live schema and reuse equivalent fields if present.

| Collection | Proposed field            | Type / constraint                           | Purpose                                              |
| ---------- | ------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Institutes | Chair Sponsor             | Optional single Reference → Partners        | Select the chair for this event.                     |
| Institutes | Chair Sponsor Description | Optional Plain text, maximum 200 characters | Event-specific description, not global Partner copy. |

## Chrome / Webflow implementation checklist

1. Inspect the live Institutes and Partners schemas in Chrome. Record the existing sponsor references, logo field, template structure, and any equivalent chair fields.
2. Add only missing fields above. Enforce the 200-character limit in Webflow; if the field UI cannot enforce it, require the same limit in the documented pre-publish check.
3. In the Institute template, add a scoped chair wrapper immediately before the ordinary sponsor group. Bind its logo to the referenced Partner and description to the current Institute. Use existing sponsor typography/spacing.
4. Apply conditional visibility to the entire wrapper when Chair Sponsor is set; hide the description element when empty. Do not leave an empty heading or spacing when no chair is configured.
5. Per the user's missing-content override, demonstrate the feature with a clearly labeled neutral placeholder on staging. Do not identify a real organization as chair without approval; replace or remove the example before production publication.
6. Preview configured and unconfigured cases, including long descriptions and transparent logos; publish only to staging through [37](37-staging-verification.md).

## Required inputs and dependencies

IPMI must identify each affected Institute slug, matching Partner record or approved new Partner details/logo, and approved description of at most 200 characters. Confirm logo rights/identity and use [19](19-photo-accessibility.md) for meaningful logo alternative text. The user explicitly superseded the original keep-empty instruction: the GCI October 2026 example uses a neutral placeholder Partner, with exact applied values in [PLACEHOLDERS](PLACEHOLDERS.md) and the evidence. It is not an approved sponsor assignment.

## Acceptance checks

- [x] One optional chair can be selected from Partners per Institute; no new collection.
- [x] Clearly labeled provisional logo/description appear above both ordinary sponsor branches.
- [x] Native 200-character limit enforced; blank description has zero layout size.
- [x] Unconfigured Institutes omit the whole chair block.
- [x] Mobile layout and dynamic Partner-name logo alt verified; ordinary sponsor preservation independently reviewed in the evidence.
- [ ] IPMI-approved real sponsor assignment, logo rights and final description.

## Rollback

Record schema and template baselines, then disable/remove only the new chair wrapper if required. Preserve populated fields and existing Partner data until rollback is reviewed; do not delete shared Partner records.
