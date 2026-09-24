# Task 26 — compact Institute Agenda

Completed on staging September 24, 2026. Native template retains `#agenda`, `#kbyg-agenda-title` and referenced Institute Agenda Link CTA. Agenda Days wrapper is Hidden with Keep in HTML off; native binding, retained references and all43 blocks remain available for rollback. All54 pages omit the grid/cards and duplicate empty notice.

## Evidence

- `root-task26-native-verification.json`: exact six-field delta (four original titles, two HCHR intros),54 pages and unchanged43 blocks.
- `agenda-register.json`: actual page/Institute IDs and exact URLs/intro values. Seven distinct retained Institute destinations supply14 pages;40 pages have pending empty links and no CTA. Operations approval remains pending; no URL was invented.
- `root-task26-http-verification.json`: final all54 reconciliation, event-specific links, compact structure, unchanged outside-agenda images/links, indexing and all three asset pins.
- Publication destination/completion captures: three native staging-only publishes. `site-settings-after-task26.json` confirms staging12:38:43.762Z and all four custom domains unchanged03:17:26.557Z. No CMS Publish now.

## Navigation and responsive QA

`navigation-final.json` contains45 settled checks across six populated/sparse/EHS audience examples at320/390/768/1440, desktop pointer/keyboard, mobile Contact-to-Agenda selection and viewport-change reload. All headings remain below navigation, active section agenda, no overflow or grid. Each preceding smooth-scroll target is reached before the next action.

Browser restoration after390-to-768 reload previously replaced correct alignment with prior scrollY4014, leaving HCHR Delegate heading at-522.516px. Runtime `1afeaaadea5b1f0a1e5d87819d2443b224e37a06` adds one pageshow/rAF correction, cancels on visitor intent and skips persisted history. Eight regression tests cover restoration and noninterference. Exact reload now settles heading186.484px below nav133px at scrollY3305.

`tablet-supplement-navigation.json` adds18 checks: all three Sponsors at768/991, boundaries767/992 and reload/navigation. Scoped `b469ddcbe2f81466fa450a1d187a68ef0739b10c/ipmi-kbyg-agenda.css` removes obsolete1222px grid minimum height only at768–991. Linked height342.594px; pending287px. Frozen base CSS pin remains `0bee9be0be82a5cbd03eab614bada158b88957c1`. Supplement CDN/local SHA256 `013CD209FFD025BD9A5CAA7AA887A67A4DCAD7407E426341AA5C8B1374475453`; runtime `127A461E21249AC292736E101FE9869CAC42C0DB28F81E7B2BFC262C85159FA0`.

The24 canonical screenshots use full slugs plus viewport width; `screenshot-dimensions.json` verifies actual dimensions. Browser output is JPEG bytes despite the .png filenames. Sponsor768 captures include final compact spacing; other exploratory captures are historical. Representative final screenshots were visually reviewed by worker/root.

## Validation and limits

Targeted runtime/validator64 passing. Lint, TypeScript, build, markup, fixture validation and scope/global/style-baseline checks pass. Full suite249/250: pre-existing task24 calendar footer inventory integration failure (`full-tests.txt`), assigned task37. Aggregate verify fails accumulated formatting (`full-verify.txt`); no full-gate pass claimed. Protected global CSS SHA256 remains `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496`.

Task27 retains Hub/support destination correction. Task37 retains UTC date shift, sparse Experience spacing, empty-state contrast, shared tablet navbar and accumulated toolchain/format cleanup. Operations owns final agenda/content approval in PLACEHOLDERS.

Rollback: remove supplement link, restore wrapper visibility and six fields from native verification, optionally restore runtime `298d6f6925b4c91cb7e35bccae0dd3cd790cbbef`. Preserve IDs/data; publish staging only and recheck navigation/event links.
