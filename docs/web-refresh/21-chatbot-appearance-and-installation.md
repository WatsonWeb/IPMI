# 21 — Chatbot appearance and Webflow installation

[Back to master](README.md)

- **Owner:** Bryan / Webflow implementation; IPMI chatbot account owner supplies access and approves the brand image.
- **Status:** Provider access and real widget identity verified; appearance package prepared, installation blocked by missing safe staging isolation. No provider or Webflow settings changed. [September 24 evidence and exact handoff](evidence/task21/README.md).
- **Sources:** [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), chatbot request; [Chatbot feedback](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQA1MDBRp2t9TrR2Y7DpU2W9AdjD13l41gLegMHfs3xM9ms?e=GFhegT), page 1 and screenshots bearing “POWERED BY LYRO AI AGENT”.
- **Depends on:** Verified isolated provider configuration, final branding approval and live widget acceptance. Authorized local placeholder asset/copy are prepared; account access is available. Coordinate with [22 — chatbot knowledge](22-chatbot-knowledge-and-training.md), [23 — human handoff](23-chatbot-handoff.md), [19 — accessibility](19-photo-accessibility.md) and [37 — staging verification](37-staging-verification.md).

## Target and current evidence

Target the sitewide chatbot launcher/conversation widget and its installation in the IPMI Webflow site. Source screenshots show a speaker photograph and identify Lyro. September 24 Chrome inspection verified the existing Tidio/Lyro project `https://www.ipmievents.com` under IPMI Webmaster, public widget ID `gzt0sc2vqea7hesgtoe4ga0or8kdk8lr`. Only one existing project was visible. Its trusted-domain setting is Show on every domain; no isolated staging project/configuration was established.

Native sitewide, Home, Contact and Institutes Template code contained no Tidio/Lyro embed; Chrome runtime samples on staging Home/Contact/GCI and production Home also found no provider markup. The provider nevertheless displays installed/activated labels, which may reflect a previous installation. Treat the discrepancy as unresolved rather than proof of a working live widget. Current welcome logo is IPMI, while Advanced → Background image (Home tab) still displays the speaker photo. Prepared repair disables that background in isolated staging; actual Lyro reply-avatar remains unverified.

The [exact configuration/placeholder register](evidence/task21/appearance-handoff.json), [neutral SVG fallback](evidence/task21/ipmi-chat-avatar-placeholder.svg), native code prestate, screenshots and staging installation/rollback procedure are complete local artifacts. None was installed or published. Do not reuse the shared project's real embed as a staging placeholder. Appearance, keyboard/mobile acceptance and installation remain open until isolation is verified.

## Requested result and interfaces

- Replace the speaker photograph with an IPMI-approved brand avatar. No exact replacement asset URL was supplied; record the approved file/URL here before upload. Do not select an unrelated speaker or invent a spokesperson.
- Confirm the existing provider, workspace and widget ID, then restore or complete the intended sitewide installation. Reuse the existing workspace; do not create a second chatbot or duplicate an existing embed.
- Use provider appearance settings where available. Keep the launcher and close control usable on mobile, with readable text, sufficient contrast and a clear accessible name.
- Apply any changed provider configuration only to an isolated preview/test workspace or provider-supported staging configuration until review. Webflow staging publication alone does not isolate a provider workspace already used by production.
- Install the provider's own approved embed through Webflow's native settings/Designer UI. Do not expose secret account credentials in page code. Knowledge and handoff behavior belong to tasks 22 and 23.

## Ordered browser implementation checklist

1. [x] In Chrome, inspect sitewide and Home/Contact/Institutes Template code; exact prestate captured in evidence, no embed found in these areas.
2. [x] Open the existing provider session; verify account/project/widget, installation instructions and targeting. Speaker image mapped to Advanced Home background, distinct from welcome logo; actual AI reply-avatar check remains open.
3. [ ] Check whether the same configuration serves production. Establish the provider-supported staging/test configuration before changing shared appearance or behavior; mark this task blocked if safe staging isolation is unavailable.
4. [ ] Obtain the approved IPMI brand image and record its asset URL/name. Upload it through provider appearance settings, retaining a copy/reference of the old avatar and settings.
5. [ ] Configure the staging widget's launcher, display name and responsive placement using existing site typography/colors where supported. Preserve page interactions and avoid covering navigation, form submit controls or consent controls.
6. [ ] In Webflow **Chrome UI**, add or repair the single provider embed as required. Restrict new installation to the staging hostname or isolated staging configuration; preserve any existing production installation.
7. [ ] Publish Webflow only to **ipmi.webflow.io**. Inspect a representative homepage, Institute page and contact page in Chrome, including fresh-load and consent states.
8. [ ] Record verified provider details, embed location, appearance screenshot, staging targeting and unresolved account limits. Continue to knowledge and handoff checks before marking the full chatbot ready.

## Required inputs and dependencies

| Input                                     | Owner                   | Blocking condition                                                               |
| ----------------------------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| Existing chatbot account/workspace access | IPMI account owner      | Verified September 24 via existing IPMI Webmaster session; no new account.                     |
| Approved brand avatar file/URL            | IPMI marketing          | Existing welcome logo retained; neutral fallback prepared. Speaker Home background removal awaits isolation.         |
| Provider staging/test isolation           | Bryan and account owner | Shared production configuration must not be changed during staging review.       |
| Approved greeting/display name if changed | IPMI marketing          | Exact placeholder copy prepared in JSON; apply only after isolation, then obtain final approval. |

## Acceptance checks

- [ ] Provider and workspace are verified from the account; exactly one intended widget loads.
- [ ] Approved brand avatar replaces the speaker image without stretching or clipping.
- [ ] Launcher, conversation and close controls are keyboard accessible; focus behavior is usable.
- [ ] Desktop, tablet and mobile layouts have readable content and no control obstruction.
- [ ] The staging installation and configuration do not alter the production widget.
- [ ] Knowledge and handoff are separately recorded against tasks 22 and 23; successful installation alone is not marked as chatbot completion.

## Rollback

Restore the captured avatar/appearance settings in the staging provider configuration and the prior Webflow embed/targeting configuration. Remove only a newly added duplicate or staging embed if necessary. Republish only staging and confirm the previous production installation remains unchanged.
