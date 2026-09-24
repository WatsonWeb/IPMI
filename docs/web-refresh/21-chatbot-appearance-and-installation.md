# 21 — Chatbot appearance and Webflow installation

[Back to master](README.md)

- **Owner:** Bryan / Webflow implementation; IPMI chatbot account owner supplies access and approves the brand image.
- **Status:** Documented; installation and provider access remain unverified. No provider or Webflow settings were changed in this documentation pass.
- **Sources:** [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), chatbot request; [Chatbot feedback](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQA1MDBRp2t9TrR2Y7DpU2W9AdjD13l41gLegMHfs3xM9ms?e=GFhegT), page 1 and screenshots bearing “POWERED BY LYRO AI AGENT”.
- **Depends on:** Approved avatar and provider access. Coordinate with [22 — chatbot knowledge](22-chatbot-knowledge-and-training.md), [23 — human handoff](23-chatbot-handoff.md), [19 — accessibility](19-photo-accessibility.md) and [37 — staging verification](37-staging-verification.md).

## Target and current evidence

Target the sitewide chatbot launcher/conversation widget and its installation in the IPMI Webflow site. Source screenshots show a speaker photograph as the avatar and identify Lyro. **Lyro is the intended existing setup, inferred from those screenshots; the provider account has not been inspected.**

During the Chrome homepage inspection, no visible widget or Tidio/Lyro script tag was observed. That observation does not establish that there is no installation: loading rules, consent, page targeting or an inactive configuration could explain it. Verify the account and Webflow custom code before adding any script.

## Requested result and interfaces

- Replace the speaker photograph with an IPMI-approved brand avatar. No exact replacement asset URL was supplied; record the approved file/URL here before upload. Do not select an unrelated speaker or invent a spokesperson.
- Confirm the existing provider, workspace and widget ID, then restore or complete the intended sitewide installation. Reuse the existing workspace; do not create a second chatbot or duplicate an existing embed.
- Use provider appearance settings where available. Keep the launcher and close control usable on mobile, with readable text, sufficient contrast and a clear accessible name.
- Apply any changed provider configuration only to an isolated preview/test workspace or provider-supported staging configuration until review. Webflow staging publication alone does not isolate a provider workspace already used by production.
- Install the provider's own approved embed through Webflow's native settings/Designer UI. Do not expose secret account credentials in page code. Knowledge and handoff behavior belong to tasks 22 and 23.

## Ordered browser implementation checklist

1. [ ] In Chrome, open the IPMI Webflow Designer/settings and inspect sitewide and relevant page custom-code areas for an existing chatbot embed. Record the placement and configuration without changing unrelated code.
2. [ ] Open the existing provider account in Chrome with authorized access. Confirm Lyro/Tidio ownership, current installation instructions, widget/workspace identity, targeting rules and the source of the speaker avatar.
3. [ ] Check whether the same configuration serves production. Establish the provider-supported staging/test configuration before changing shared appearance or behavior; mark this task blocked if safe staging isolation is unavailable.
4. [ ] Obtain the approved IPMI brand image and record its asset URL/name. Upload it through provider appearance settings, retaining a copy/reference of the old avatar and settings.
5. [ ] Configure the staging widget's launcher, display name and responsive placement using existing site typography/colors where supported. Preserve page interactions and avoid covering navigation, form submit controls or consent controls.
6. [ ] In Webflow **Chrome UI**, add or repair the single provider embed as required. Restrict new installation to the staging hostname or isolated staging configuration; preserve any existing production installation.
7. [ ] Publish Webflow only to **ipmi.webflow.io**. Inspect a representative homepage, Institute page and contact page in Chrome, including fresh-load and consent states.
8. [ ] Record verified provider details, embed location, appearance screenshot, staging targeting and unresolved account limits. Continue to knowledge and handoff checks before marking the full chatbot ready.

## Required inputs and dependencies

| Input                                     | Owner                   | Blocking condition                                                               |
| ----------------------------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| Existing chatbot account/workspace access | IPMI account owner      | Cannot verify provider, settings or installation without it.                     |
| Approved brand avatar file/URL            | IPMI marketing          | Speaker image replacement cannot be finalized without an approved asset.         |
| Provider staging/test isolation           | Bryan and account owner | Shared production configuration must not be changed during staging review.       |
| Approved greeting/display name if changed | IPMI marketing          | Preserve existing approved text until supplied; content corrections are task 22. |

## Acceptance checks

- [ ] Provider and workspace are verified from the account; exactly one intended widget loads.
- [ ] Approved brand avatar replaces the speaker image without stretching or clipping.
- [ ] Launcher, conversation and close controls are keyboard accessible; focus behavior is usable.
- [ ] Desktop, tablet and mobile layouts have readable content and no control obstruction.
- [ ] The staging installation and configuration do not alter the production widget.
- [ ] Knowledge and handoff are separately recorded against tasks 22 and 23; successful installation alone is not marked as chatbot completion.

## Rollback

Restore the captured avatar/appearance settings in the staging provider configuration and the prior Webflow embed/targeting configuration. Remove only a newly added duplicate or staging embed if necessary. Republish only staging and confirm the previous production installation remains unchanged.
