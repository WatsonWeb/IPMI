# September 24 client feedback: calendar and chair sponsor

Status: implemented, published and verified on production and staging. This site rejected Single Page Publishing (`Bad Request: Invalid parameter: pageId`); the user explicitly approved a full-site production publish including the pre-existing staged changes.

## Calendar

Updated only the calendar shell embed `fb696116-7fef-df35-b6c5-6d0d9d78ec13` on Upcoming Institutes page `63ba5ae2944baf57c9a073c8`. Its markup and stylesheet now live in an inert template. The inline loader mounts the template and loads the existing immutable calendar runtime only when `window.location.hostname === "ipmi.webflow.io"`; other hosts remove the inert template and do not load the runtime. Thus a later full-site publish cannot accidentally expose the calendar UI on production. The CMS data source, list filters, pagination and existing initializer remain unchanged.

- Original embed: [calendar-shell-before.html](calendar-shell-before.html)
- Updated exact embed: [calendar-shell-staging-only.html](calendar-shell-staging-only.html)
- Review: https://ipmi.webflow.io/institutes

To release the calendar after copy approval, update approved copy and deliberately remove the hostname gate. Restoring the original embed also restores production eligibility and must not be done before approval.

## Chair sponsor

Institutes template `6392772fccd80e6d0e02600d`, EHS item `6a46ac429cad4c03adc65259`, Partner `6392772fccd80e592f02607e` (Benchmark Gensuite). Existing Partner URL verified as `https://benchmarkgensuite.com/`.

- Existing image `85ec0d71-37a5-de19-12d1-0dc6723cdbd1` now uses new class `chair-sponsor-logo`: width 300px, max-width 100%, height auto. Ordinary sponsors retain their prior sizing.
- Native Link Block `bc3a0dc4-0326-675b-7f7c-09ac63c75b02` wraps the image and binds to Chair Sponsor → Partner URL, opening in a new tab. Image source and alternative text retain their existing CMS bindings.
- Link visibility excludes the existing placeholder Partner `6ab4fe478e6d517d534aac7c`. An unlinked copy of the original 200px image (`ef4be3e8-9f8b-1e6b-f98c-a15e4f4efcee`) is visible only for that placeholder and sits before the description. This preserves the GCI staging example without creating a dummy URL link.
- No CMS field values, sponsor assignments, descriptions or ordinary sponsor order were edited.
- Review: https://ipmi.webflow.io/institutes/ehs-jan-2027

## Verification and publishing

Webflow API published to staging only (`customDomains: []`, `publishToWebflowSubdomain: true`, scope `site`). Independent HTTP/CSS verification is in [independent-staging-http-verification.json](independent-staging-http-verification.json).

Chrome checks confirmed that the guarded calendar opens in September 2026 and advances to October. The EHS chair image renders at 300 × 225px. At a 390px viewport it stays within the page (page scroll width 390px; image left 45px, right 345px), and the mobile screenshot was visually checked. Clicking the chair logo opened `https://benchmarkgensuite.com/` in a new tab with the Benchmark Gensuite website title. Temporary viewport override was reset.

The independent check confirmed exactly one linked EHS chair image, one unlinked original-size GCI placeholder, and no dummy-URL anchors. EHS/GCI visible copy and all 11/28 ordinary sponsor records match production.

After explicit user approval, Webflow API published the full site to production domain `63c8544d81c16882d98c4e42` (`www.ipmievents.com`) and staging. Published HTML reports September 24, 2026, 20:00:22 UTC. Chrome confirmed that production `/institutes` contains no active calendar button, dialog, or loaded calendar runtime. The live EHS chair logo and native website link were checked visually; independent HTTP/CSS checks confirmed the 300px style, correct destination and new-tab target. Staging was refreshed after production publication and the calendar still opened to September 2026 and closed successfully.

See [independent-production-http-verification.json](independent-production-http-verification.json). No Git commit or push was performed, and existing dirty source/build files were preserved.

## Integration handoff

The refresh task resumed after this separate task completed. Its read-only review confirmed the explicit full-site production approval in the task **Update calendar and Chain sponsor**. Webflow's site API reported `2026-09-24T20:00:26.885Z` for staging and all four custom domains; the HTML build timestamp above is a different observation of that publication.

The maintained [calendar supplement](../../../../Page%20HTML/Institutes/Calendar-Supplement.html) now mirrors the native guarded shell, using the standard release placeholder for its immutable assets. The [toolchain contract tests](../../../../tests/toolchain-contract.test.ts) execute the inline gate against staging, all four production hostnames, and a lookalike subdomain. They verify that only staging mounts the dialog and loads the pinned JavaScript/CSS. The native embed was not changed during this reconciliation. This evidence and the source reconciliation are included in task 37's final integration handoff; the earlier statement about no commit describes the original client-feedback task.
