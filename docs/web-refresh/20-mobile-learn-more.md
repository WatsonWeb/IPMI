# 20 — Mobile “Learn More About IPMI” button

[Back to master](README.md)

**Owner:** BWC / Webflow implementer. **Status:** Reported defect; not yet reproduced at a verified mobile viewport.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 1, mobile “Learn More About IPMI” button issue.
- [Homepage](https://ipmi.webflow.io/), the **Learn More About IPMI** link/button and its surrounding section; intended About IPMI destination [About](https://ipmi.webflow.io/about).

## Current state and intended result

The mobile failure is reported by the source. Earlier viewport inspection did not establish an actual mobile-width viewport, so do not claim reproduction or prescribe a guessed CSS fix. The button must remain visible, legible, reachable by touch and keyboard, and navigate to About IPMI without an overlay intercepting it.

## Chrome / Webflow implementation checklist

1. In Chrome, establish and verify an actual mobile CSS viewport (record width, height, URL, and whether navigation is open). Reproduce at 375px and 390px plus the relevant Webflow breakpoint boundary; capture the exact failing behavior.
2. In Webflow Designer, locate the button and its inherited classes/link destination. Check wrapping, width, overflow, z-index/overlays, pointer events, mobile visibility, and interactions against the observed failure.
3. Apply the smallest scoped correction to that element/section at the affected breakpoint. Preserve the desktop appearance and destination. If the defect cannot be reproduced, document the tested conditions and leave code unchanged rather than inventing a repair.
4. If custom code is genuinely required, identify the maintained source matching live markup first. Do not edit the globally served unversioned stylesheet for staging; use a scoped isolated/versioned staging asset.
5. Verify the button again with the mobile menu closed and after opening/closing it, then check tablet and desktop. Publish only through [37](37-staging-verification.md).

## Inputs and dependencies

No new copy or asset is needed. If verified mobile testing cannot reproduce the defect, retain the failure as an unresolved reproduction item with actual test evidence; the source's device/browser details would then be useful. Do not mark it fixed solely because Desktop Designer preview works.

## Acceptance checks

- [ ] Mobile viewport dimensions and original failure/reproduction outcome are recorded.
- [ ] Button text remains visible without clipping or horizontal page overflow.
- [ ] Touch/click and keyboard activation reach `/about`; focus is visible and no overlay blocks input.
- [ ] Mobile-menu interaction does not disable the button after the menu closes.
- [ ] Tablet/desktop appearance and shared buttons remain intact; task 37 includes the regression.

## Rollback

Save the original class values, link destination, and relevant interactions. Restore only the scoped change or staging asset reference if regression appears; leave unrelated shared styles unchanged.
