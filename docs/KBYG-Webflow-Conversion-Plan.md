# KBYG Webflow CMS and Frontend Plan

## Summary

- Build one reusable `KBYG Pages` CMS template serving both audiences through separate items and URLs:
  - `/know-before-you-go/hchr-sept-2026-delegate`
  - `/know-before-you-go/hchr-sept-2026-sponsor`
- Use the existing Institute record for shared event data, shared CMS blocks for reusable content, and audience conditions for sections that differ.
- Reuse the existing Desktop Navigation, Mobile Navigation, Footer, Curve Left/Right, typography, buttons, cards, textures, and event color variables.
- Deliver a production-ready implementation to `ipmi.webflow.io` only. No Webflow production domains will be published.

## CMS and Public Interfaces

### Collections

| Entity | Changes |
|---|---|
| `Institutes` | Reuse title, dates, venue, address, colors, map query, agenda link, thumbnail, and venue gallery. Add `KBYG Hotel Intro` (Rich text), `KBYG Reservation Details` (Rich text), `KBYG Reservation URL` (Link), and `KBYG Transportation Details` (Rich text). |
| `Staff` | Add `Phone` and `Email`; populate Katrina Brightling’s contact details and reference her rather than duplicating contact content. |
| `KBYG Content Blocks` | Add Name, Slug, Institute reference, Audience Scope (`Shared`, `Delegate`, `Sponsor`), Block Type (`Preparation`, `Key Date`, `Agenda Day`, `Experience`, `FAQ`), Eyebrow, Title, Body, Icon, Calendar Start/End, All-day switch, and Initially Expanded switch. |
| `KBYG Pages` | Add Institute reference, Audience (`Delegate` or `Sponsor`), Operations Lead reference, Hero/Hub images and alt text, audience-specific section copy and links, plus ordered multi-reference fields for Preparation, Key Dates, Agenda Days, Experience, and FAQs. |

The five multi-reference fields preserve display order. Shared agenda or other identical blocks will be selected on both pages; audience-specific blocks will exist once and be selected only on the relevant page. A pre-publish validator will reject incorrect block types, mismatched audiences, missing required fields, or anything other than one Delegate and one Sponsor page per Institute.

### Template contract

- Root selector and audience hook: `.kbyg-page[data-audience="delegate|sponsor"]`.
- Stable section anchors: `welcome`, `prepare`, `key-dates`, `agenda`, `hub`, `hotel-travel`, `experience`, `faq` or `sponsor-support`, and `contact`.
- Script hooks: `data-kbyg-jump`, `data-kbyg-section`, `data-kbyg-accordion`, and `data-kbyg-calendar`.
- Bind the referenced Institute’s accent and dark colors to scoped CSS custom properties.
- Set SEO title to `{Institute title} Know Before You Go — {Audience}`, use Hero Intro for the description, and use the Institute thumbnail for Open Graph.
- Exclude KBYG items from the sitemap and emit `noindex,follow`. URLs are treated as unlisted, not authenticated.

## Template and Frontend Implementation

- First retrieve section-level design context and original assets for all six Figma frames: Delegate `6:81821`, `6:82537`, `6:83195`; Sponsor `2036:4`, `2036:694`, `2036:1326`. Automatically retry Figma rate limits; do not infer missing details from scaled screenshots.
- Recreate the complete shared structure once. Webflow conditional visibility will render:
  - Delegate: preparation, delegate dates/content, Attendee Hub, Delegate Experience, and FAQ.
  - Sponsor: sponsor preparation/dates/content, Sponsor Hub, Business Meetings & Onsite Experience, and Sponsor Support.
  - Hidden audience wrappers will not be retained in published HTML.
- Use existing shared Webflow components without changing their global behavior. Apply KBYG-only overrides so Desktop Navigation appears at `>=992px` and Mobile Navigation at `<=991px`, matching the Figma tablet design.
- Implement the desktop sticky jump navigation and an accessible labeled select at tablet/mobile widths. Track the active section and respect reduced-motion preferences.
- Build repeated CMS cards for preparation, dates, agenda days, experience, and FAQ. The FAQ will be keyboard-operable, single-open, correctly labeled with ARIA, and use the CMS initial-open state.
- Generate standards-compliant downloadable `.ics` files from Key Date fields; deadlines will be all-day events to avoid timezone ambiguity.
- Use the existing curved SVG dividers and Safari scaling fix. Preserve the Figma section sequence, alternating backgrounds, dotted textures, grid behavior, spacing, and image ratios across Webflow’s `992`, `768`, and `480` breakpoint boundaries.
- Export icons as SVG and photos/screens as optimized WebP/AVIF, deduplicating by asset hash. Populate Webflow alt text and use empty alt text for decorative assets.

## GitHub Styling and Delivery

- Work from a clean isolated worktree based on current `origin/master`, preserving the six unrelated EOL-only changes in the existing worktree.
- Leave the globally loaded `ipmi-custom-styles.css` unchanged because production currently consumes it.
- Add a dedicated, fully scoped `ipmi-kbyg-styles.scss` build producing `ipmi-kbyg-styles.css` and a dependency-free `ipmi-kbyg.js`. No selector may escape `.kbyg-page`.
- Add a pinned Vite+-invoked Sass/PostCSS build and scoped checks so compilation does not depend on CodeKit.
- Commit only KBYG/build files with `feat(kbyg): add staging template assets`, fast-forward and push to `origin/master`, then verify the GitHub Pages CSS/JS status, MIME types, and hashes.
- Link the assets once from the KBYG collection template using commit-SHA cache busting:
  - `https://watsonweb.github.io/IPMI/ipmi-kbyg-styles.css?v={sha}`
  - `https://watsonweb.github.io/IPMI/ipmi-kbyg.js?v={sha}`
- Create schemas, assets, content, conditions, and template changes idempotently: reuse matching slugs/assets and keep all new CMS items Draft or Queued until validation passes.

## Validation and Staging Rollout

- Compare full-page screenshots against all six Figma frames at `1920px`, `768px`, and `375px`, then test `992/991`, `768/767`, `480/479`, and `374px` boundary widths.
- Test both audience URLs for correct content, ordering, anchors, sticky navigation, select navigation, accordions, calendar downloads, agenda links, Hub links, map, reservation link, `tel:`/`mailto:`, image loading, and absence of the other audience’s hidden content.
- Verify keyboard navigation, focus visibility, semantic headings, ARIA state, alt text, WCAG AA contrast, reduced motion, and zoom/reflow. Require no console or failed-network errors, CLS below `0.1`, Lighthouse Accessibility at least `95`, and no material performance regression against the existing Institute template.
- Confirm shared Institute, Staff, and Content Block edits flow to both pages while audience-specific edits remain isolated.
- Publish site ID `62f30d583ebbed2d6d47f9a5` with `publishToWebflowSubdomain: true` and no custom-domain IDs. If the tooling cannot enforce that target, fail closed without publishing.
- Verify both new URLs return `200` on `ipmi.webflow.io`, remain absent from custom domains, and retain staging’s search-engine blocking. Compare representative production URLs and asset hashes before and after publishing to confirm production is unchanged.

## Assumptions and Defaults

- The initial event is the existing `hchr-sept-2026` Institute record.
- Figma is the source of truth for copy, assets, order, and responsive presentation; existing Webflow components take precedence only where they are visually compatible.
- No visible Delegate/Sponsor switch is added; the audience is determined by the unique CMS item URL.
- No production-domain publish, redirect, authentication system, or unrelated shared-component redesign is included.
- Execution requires no human confirmations. Transient service limits are retried automatically; any failed content, visual, or publish-safety gate is repaired and retested before staging publication.
