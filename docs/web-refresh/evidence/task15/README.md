# Task 15 implementation record

September 24, 2026, America/Chicago. Native fields implemented through Chrome Webflow Designer and published only to `ipmi.webflow.io`. No production publication, form submission, CAPTCHA interaction, provider mutation, webhook change, backend deployment or content placeholder.

## Native form inventory

| Source / staging URL                                                                                                                                                    | Existing form / API ID                          | New input ID / Designer element                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| [Contact](https://ipmi.webflow.io/contact)                                                                                                                              | Contact Form / `64c83d5744b22dac34abfae4`       | `field-phone-contact` / `f8a042ac-1071-4606-99e6-e557fd137a6d`   |
| [Attend](https://ipmi.webflow.io/attend)                                                                                                                                | Attend Request / `64c83d5744b22dac34abfae8`     | `field-phone-attend` / `82f7858a-a668-7aab-713c-f6660b19ce6d`    |
| [Horizon](https://ipmi.webflow.io/institutes-on-the-horizon)                                                                                                            | Attend Request / `683f99b1b3d511f4b0e9f6f7`     | `field-phone-horizon` / `a1a5c448-f080-0f6b-2a74-2c8d57e84d3a`   |
| Institutes Template, [HIT 2027](https://ipmi.webflow.io/institutes/hit-2027), [Healthcare GCI October 2026](https://ipmi.webflow.io/institutes/healthcare-gci-oct-2026) | Invitation Request / `64c83d5744b22dac34abfad0` | `field-phone-institute` / `bb51b11a-4601-4ee3-617d-bae49b01b9a6` |

The Institutes template is page `6392772fccd80e6d0e02600d`; its new icon preserves the existing CMS accent-color binding. The template was edited with HR Canada 2027 item `6a735ad6e34946d6f730bc28` selected. No CMS item values, draft status or publishing flags were changed.

Each new wrapper is directly after the Email wrapper. Label: `Phone number (optional)`. Input: `type="tel"`, `name="Phone"`, `data-name="Phone"`, `autocomplete="tel"`, placeholder `Phone number`; no required or pattern constraint. Existing field classes/typography reused. Its own icon text uses the site's existing Font Awesome phone glyph U+F095; shared classes and other icons unchanged. `for` matches the input ID. No custom CSS or runtime JavaScript added.

The nine native form definitions contain four inquiry sources above, three listing filters and two KBYG jump forms. Filters/jump forms do not collect inquiries and were left unchanged. The sampled recap detail `/recaps/healthcare-hrmi-sept-2025` has no inquiry form. This is not a claim that every CMS item was individually opened.

## Preserved routing and integrations

All four Designer form settings still show Webflow, Email Notifications and `https://ipmi-express-server.vercel.app/webhooks/webflow/forms`; redirect None. Read-only forms API confirms original IDs, a recognized visible Phone field and unchanged response settings (`sendEmailConfirmation=false`, no redirect). No submission records were retrieved.

Contact hidden recipient remains `info@ipmionline.com`. Attend category addresses remain Attend `tpui@ipmionline.com`, Speak `npanwar@ipmionline.com`, Partner `jgray@ipmionline.com`. Horizon retains `jgray@ipmionline.com` for all three category addresses. HIT 2027's pre-existing `scolquhoun@ipmievents.com` attendee/recipient value is preserved; the original planning document's blank-field claim was erroneous. Task 34 owns identity/approval/all-entry-point/delivery confirmation. Task 16 public email work must not change these hidden recipients.

Independent [HTTP comparison](task15-root-http-verification.json) confirms exactly one added input per source, no removed/changed old input/select/textarea tags, correct label/ordering/optionality/icon, and byte-identical inline scripts. Production has zero Phone inputs on the four sampled pages and retains its previous fields. [Native schema comparison](task15-root-native-schema-verification.json) separately confirms Webflow recognition. These checks do not establish delivery.

## Browser and local verification

- Desktop 1440px (Contact additionally at normal 1912px), tablet 768px, mobile 390px and 375px inspected. [Breakpoint dimensions](breakpoint-checks.json) cover 1440/992/991/768/767/480/479/390/375 for each native source, using the Healthcare GCI instance for the template. Phone controls and labels fit every measured viewport. HIT additionally inspected desktop/tablet/mobile.
- Attend and the non-Horizon Healthcare GCI instance: Attend/Speak/Partner visited on desktop and mobile; Phone remains visible and entered international text survives category changes. Existing company-size conditional visibility remains. Horizon and HIT render their existing pre-registration variant without visible category selectors; no artificial states were introduced. Horizon's existing HIT option selection was exercised without sending.
- `+44 20 7946 0958 ext 12` is visibly retained. Blank phone confirmed on HIT and Attend, with native validity true. Required fields still report missing values when blank. Tab moves from Phone to Message on Contact, and to Title on inquiry forms; focus styling is visible. Label association is checked in the raw HTML and DOM.
- Read-only browser value properties are sanitized by this tool, so they were not treated as payload evidence. [Offline standard FormData check](check-native-serialization.mjs) parses saved published form markup without scripts/network and verifies blank, UK extension and North American parentheses/extension values unchanged in all four forms. [Results](native-serialization-results.json). This does not exercise Webflow AJAX, CAPTCHA, actual webhook receipt or email delivery.
- Inherited document width 790 at a 768px viewport appears on all four samples; the new phone controls remain within 768px. The existing navbar overflow is deferred under task 37. No unrelated global CSS fix was attempted.
- Viewport reset and owned QA/provider tabs closed. Existing Designer tab preserved.

Final screenshots: [Contact mobile](contact-mobile.png), [Attend Partner mobile](attend-partner-mobile.png), [Attend Speak desktop](attend-speak-desktop.png), [Horizon mobile](horizon-mobile.png), [HIT mobile](hit-mobile.png), [HIT desktop blank phone](hit-desktop-blank.png), [Institute Speak mobile](institute-speak-mobile.png). Phone glyphs are visible and the 1Password tooltip was dismissed by tabbing onward. [Staging-only destination](publish-staging-only.png) and [publication result](publish-completed.png) show the custom domain unchecked and its earlier publication time retained.

## Pending provider field

[DORN Think Tank](https://ipmi.webflow.io/thinktanks/dorn-vtt-2026) loads ActiveCampaign form 412 from `https://ipmionline81168.activehosted.com/f/embed.php?id=412`. Its provider script has fullname/company/email fields. The provider admin URL was opened in Chrome and presented a login screen; no authenticated account or isolated staging configuration was available. No login or provider edit was attempted. Provider changes could affect production immediately. Its telephone serializer expects an intl-tel dropdown beside the field, so a synthetic DOM-injected telephone input would be unsafe and is not a working substitute.

Needed: authorized account access, a verified isolated provider test form/embed, native Phone field configuration and mapping, then controlled payload/delivery verification. Inventory any additional provider form IDs while completing that account review. The current embed remains unchanged.

## Pending backend deployment and actual delivery

Read-only sibling repository `WatsonWeb/ipmi-express-server`, revision `ee1239b6cd175befd2d8e567006eacf636707d6b`, has webhook handling in `server/app.js` and explicit email mappings in `email/index.js`. That local revision drops Phone from notification rendering. The deployed revision and any safe preview environment were not established.

[Backend patch](backend-phone-mapping.patch) adds a common optional Phone mapping and an optional escaped row to Contact, Attend and Invitation email templates. It preserves international formatting and existing mappings/routing. It is an artifact only: the sibling repository stayed clean, and no branch or live service was changed. `git apply --check` passed against the recorded revision.

[Pure renderer test](test-backend-phone.cjs) passes 18 combinations: all three templates × missing, empty, whitespace, UK international, North American parentheses/extension, and HTML-special-character input. [Results](backend-render-results.json). Tests import only a copied email renderer, never the server or sending service. Rerun against an isolated checkout after applying the patch using `vp node docs/web-refresh/evidence/task15/test-backend-phone.cjs <patched-email-directory>` from this frontend repository.

Before full acceptance: review/apply the patch in an authorized backend workflow, establish safe staging deployment/routing, and send controlled blank/international tests through the actual Webflow path. Verify stored field, webhook payload, notification Phone row, unchanged recipient selection and reachable success/error states. No staff inbox should be used by default. Production and actual delivery are still unverified.

## Rollback

Remove only the four newly identified Phone wrappers through Designer and publish staging only. Original fields, IDs, handlers and routes were not changed. Do not restore a whole page/site over other tasks. The backend patch needs no live rollback because it was not applied or deployed. Local pre-task captures remain under `.webflow/web-refresh-2026-09-23-baseline/*before-task15*`.
