# KBYG section-jump QA — September 5, 2026

## Change

KBYG-owned section links and same-page hero guide buttons now share one scroll
handler. Owned clicks stop before Webflow's delegated smooth-scroll handler can
overwrite their destination. Other links, new-tab/modifier clicks, and downloads
retain native behavior.

The destination centers the sticky pill over the preceding curve, accounting for
responsive transforms and the pill's measured height. A minimum heading clearance
protects short dividers. Date-card reveals retain their separate card destination.
No CSS or global site navigation code changed.

## Verification

- `vp run verify`: passed; 175 tests across 13 files, including 13 new navigation
  regression cases. Formatting, lint, types, production builds, CMS/markup checks,
  stylesheet scope, and all frozen CSS baselines passed.
- Chrome local production preview used staging HTML with Webflow's own runtime
  still present. No Webflow content or published assets were changed.
- All nine section links checked on sponsor desktop (1914px) and delegate desktop
  (1280px); all nine dropdown destinations checked for both audiences at 390px.
  Active navigation state matched each destination, with no heading overlap.
- Sponsor Prepare checked at 320, 390, 479, 480, 767, 768, 991, 992, 1199, 1200,
  1280, and 1914px. No horizontal overflow at these widths.
- Hero guide buttons, smooth scrolling, reduced-motion jumps, direct section URLs,
  and mobile section reloads checked. No application console errors observed;
  browser-extension logger warnings were unrelated.
- Before: desktop Prepare section top was 0px and its header started at 40px,
  behind a pill spanning 30–92px. After: curve and pill centers both 61px;
  the header starts at 143px, leaving 51px clearance.

## Expected exceptions

Welcome's nav can still be in normal flow, and the final Contact section can be
limited by the document's maximum scroll. These destinations keep headings clear
even when exact curve centering is not possible. Narrow layouts prioritize heading
clearance over exact centering. Styling remains byte-identical to the baseline.
