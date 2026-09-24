# Task 34 staging evidence — September 24, 2026

Provisional reuse of the pre-existing canonical HIT attendee route is staged. Sam ownership, routing approval and actual delivery remain pending. No CMS recipient changed, form submitted, CAPTCHA completed or message sent.

## Baseline and native edits

HIT item `6a062fba0e49a14badf21c95`, slug `hit-2027`, field `test` / Form - Attendee Request E-mail Address (schema `2422d7f29a9b8b165743750407a06d6c`) already contained `scolquhoun@ipmievents.com`. Its prework update/publish dates were May 28/June 2. Both direct-page hidden recipient fields rendered that value on staging and production. The former blank-baseline statement was false.

Chrome Designer edits only:

- Horizon `.event-info` embed inside Horizon Card Inner Wrap: added `data-attend-recipient` bound to that CMS attendee field. Existing native slug and date label retained, including `MMM DD, YYYY` (HIT label `Healthcare IT Institute - Jun 06, 2027`).
- Attend hidden collection `.upcoming-institute`: added `data-slug` bound to URL Slug and `data-attend-recipient` bound to the same attendee field. All 26 native rows retained. HIT is option 16, label `Healthcare IT Institute - Jun 6`.
- Appended one deferred script after each page's existing footer initializer. Final immutable URL: `https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@f7bedcf942dab9ca60a089380e47a6a22fe026ee/dist/hit-inquiry-routing.js`. No full initializer replacement. Intermediate Horizon-only pin `edea0bc67c7f569a668aef0984dac38a1aee1be0` is absent from final pages.
- Published staging only, custom domains unchecked; destination and completion screenshots included.

Generic Attend identification requires native row order/count plus exact option label agreement before using the row's slug. It never infers year or HIT identity from a title substring. Actual published option builder uses name plus `-` plus date. The offline harness executes its actual jQuery initializer and checks category handlers and section CTA ordering; Horizon executes its actual DOMContentLoaded selector. Missing canonical destination or unsafe option mapping clears Recipient and applies custom validity. Known other events and cleared selection restore existing category baselines.

Baselines: Horizon Attend/Speak/Partner `jgray@ipmionline.com`; generic Attend `tpui@ipmionline.com`, Speak `npanwar@ipmionline.com`, Partner `jgray@ipmionline.com`. HIT Speak/Partner remain blank and hidden as before.

## Verification

- Runtime asset commit `f7bedcf942dab9ca60a089380e47a6a22fe026ee`: lint/build, 236 tests in 15 suites and style/KBYG checks passed. Tests cover selection/reset, event/category transition safety, malformed/missing metadata, duplicate labels and actual Horizon timing.
- `offline-routing-results.json`: actual final published HTML and live inline initializers, saved site jQuery and built bundle executed in isolated Happy DOM. Standard FormData assertions cover canonical Recipient and blank/international Phone. No Webflow AJAX, webhook, notification or provider send occurred.
- Reproduce with `vp node docs/web-refresh/evidence/task34/check-published-routing.mjs .webflow/web-refresh-2026-09-23-baseline .webflow/task34-jquery.js`. Inputs are local captured final HTML, plus observed site jQuery URL `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=62f30d583ebbed2d6d47f9a5`; no network code is loaded by the harness.
- `browser-checks.json`: visible query/dropdown/card/category selection, keyboard activation, validity and optional Phone checks. Browser tooling sanitizes hidden values, so blank tool reads are not treated as routing failures. Desktop form captures plus actual mobile innerWidth/clientWidth 390, height 844, viewport meta `width=device-width, initial-scale=1`; mobile screenshots show readable single-column layout. Direct HIT heading remains split across native elements as `Pre-Register for the Healthcare IT Institute 2027`.
- Independent root HTTP checks: Horizon and three Institute pages preserve exact form/anchor/image tag arrays. Attend form is byte-identical after removing exactly two new metadata attributes; inputs/anchors/legacy inline scripts preserved. Nineteen desktop gallery image `sizes` attributes reserialized from `(max-width: 1919px) 100vw, 1920px` to `100vw`; src/srcset/alt/dimensions/loading/class retained. Settled desktop gallery screenshot confirms layout and images render. This is a bounded Webflow serializer delta, not an asset replacement.
- Each selector page has exactly one final pin; direct pages have none. CDN matches local bundle. Production Attend has neither new pin nor metadata. Protected global CSS SHA256 remains `80EF3C254BEF30F97398B63B0888A934085BB9B371CE4EE74E2E6B20BEFE4496` locally and remotely.
- Configured `vp run verify` did **not** pass: its first formatting gate reported 36 existing docs/evidence paths, listed in `configured-check-baseline.txt`. Those files predated task 34 (no docs diff from task-start commit when captured). Scoped changed files are formatted separately; unrelated formatting is assigned to task 37.

## Delivery trace and replacement handoff

Read-only sibling backend at `ee1239b6cd175befd2d8e567006eacf636707d6b`: `server/app.js`419–592 verifies Webflow HMAC, reads `payload.payload.name/data`, uses `Recipient || recipient` directly for Resend with no event override; development skips sends. Webflow form settings expose Webflow, Email Notifications and webhook `https://ipmi-express-server.vercel.app/webhooks/webflow/forms`. This does not establish deployed revision, native notification destinations, provider delivery or safe test isolation. Backend was not run, edited or deployed. Task 15's phone-template mapping patch remains undeployed.

Official IPMI recap bylines establish a Sam Colquhoun identity only (see root identity research JSON). IPMI must confirm ownership of the existing canonical mailbox, approve all three Attend entry points and any copy/backup routes, identify native/provider configuration, and supply an authorized controlled delivery arrangement. Replace the documentation status `Pending Sam ownership, routing approval and controlled delivery verification` with dated approval and controlled receipt evidence. If a replacement destination is approved, edit the existing native HIT attendee CMS field, preview all three paths, stage only and repeat transition/payload checks before any authorized delivery test. Never insert an unknown placeholder into a sending field.

## Exact rollback

Remove only the task 34 comment/script from Horizon and Attend page footer settings. Remove only Horizon's new `data-attend-recipient` binding and Attend's new `data-slug`/`data-attend-recipient` attributes. Keep original Horizon slug/label/date tokens, all legacy footer code, native forms, phone fields, CAPTCHA, direct HIT recipient and task 18 heading. Publish staging only. This returns selector forms to their prior category baselines and reopens the known HIT selector-routing gap; it must not be described as verified Sam delivery. Do not restore whole pages or mutable production CSS.
