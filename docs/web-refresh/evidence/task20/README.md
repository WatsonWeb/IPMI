# Task 20 — Mobile Learn More evidence

Implemented September 24, 2026 in Chrome Webflow Designer as IPMI Webmaster. Staging only.

## Reproduction and smallest correction

Before editing, actual Chrome CSS viewports were verified at 375×812, 390×844 and 767×900. With the mobile menu closed, clicking the visible Learn More About IPMI button left the browser on Home `/#stats` instead of opening About. DOM inspection confirmed its destination was `#`. The text and approximately 301×55.6px button were visible and unclipped; page widths matched all three mobile widths. At 768×900 the separate desktop button appeared with the already-correct `/about` destination, and the mobile button was hidden. The existing 790px document width at tablet belongs to task 37.

Native Designer path: Home → Stats Section → Container → Features Columns → Feature Column Right → Button. Link settings before: URL `#`, This tab, Default preload; text `learn more about ipmi` with existing information icon. Changed only URL to `/about`. Classes remain `button blue-gradient hidden-tablet-up margin-top-30 w-button`. No CSS, interactions, bindings, IDs, text or image edits were needed.

## Publication and preservation

[Publication result](publish-result.png) shows only `ipmi.webflow.io` selected and newly published. `www.ipmievents.com` was visibly unchecked before publication and retained its previous five-hours-ago publication. No CMS Publish now action or CMS record edit occurred; unrelated drafts and prior task changes were preserved.

[Independent HTTP comparison](task20-root-verification.json) confirms the sole expected mobile anchor href change. All other anchors, images, normalized source text and inline scripts match the prior baseline. Home approved photos/copy, count 20 and public email remain. Production still has mobile `href="#"`. No shared unversioned asset or runtime source was changed.

## Acceptance

- [375×812 keyboard focus](mobile375-focus.png): native Tab focus has visible outline; Enter loads `https://ipmi.webflow.io/about`.
- [390×844 after menu open/close](mobile390-after-menu.png): menu opened ([evidence](mobile-menu-open.png)), closed, then button remained keyboard reachable, visibly focused and clickable. Pointer activation loads `/about`. Document width 390.
- 767×900: mobile variant visible, pointer activation loads `/about`, document width 767.
- [768×1024 tablet](tablet768.png): original desktop variant visible, keyboard Enter loads `/about`; mobile variant hidden. Button fits despite inherited navbar document width 790.
- [1440×1000 desktop](desktop1440.png): original desktop button remains visible and pointer activation loads `/about`; document width 1440.
- [Measured breakpoint checks](breakpoint-checks.json). Browser viewport values were verified, not inferred from Designer labels. Native pointer clicks were tested; physical touchscreen hardware was not available.

No placeholders applied. Temporary viewport overrides cleared on QA and Designer tabs; only the owned QA tab was closed. Designer restored to Home, with no publication dialog; Chrome control released.

## Exact rollback

In Home Designer, select Stats Section → Container → Features Columns → Feature Column Right → Button, and restore its URL from `/about` to `#`, preserving This tab, Default preload, text/icon and all classes. Re-publish only `ipmi.webflow.io` with every custom domain unchecked. Do not alter the separate Feature Column Left desktop link, shared styles, or prior task content. Reverting this Git evidence commit alone does not roll back the native Webflow setting.
