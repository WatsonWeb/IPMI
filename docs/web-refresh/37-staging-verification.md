# 37 Integrated Staging Verification and Review Handoff

[Back to master](README.md)

**Owner:** Implementation team; IPMI reviews staged content. **Status:** After dependencies — no staging acceptance has been performed for this refresh. **Source:** Approved documentation plan and [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI). **Target:** [IPMI staging](https://ipmi.webflow.io/) and every affected page/template listed below.

## Outcome and dependencies

Deliver a staged refresh whose copy, imagery, forms, event behavior, and responsive presentation pass the task-specific checks. All 01–36 outcomes included in the review batch must have evidence. IPMI dependencies remain open until supplied; any deferred item must be listed with its owner, reason, and affected user experience. Do not describe a partial batch as the completed refresh.

Read the [master workflow and safeguards](README.md#browser-implementation-workflow) before any publish. Browser observations during documentation are a baseline, not post-implementation QA. No form submission, chatbot handoff, production publish, or client communication was performed to create these docs.

## Review targets

| Surface             | Staging path or target                                                                         | Primary coverage                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Home                | `/`                                                                                            | Copy, stats ending at 20, photo pairs, mobile Learn More, shared footer            |
| Upcoming Institutes | `/institutes`                                                                                  | Copy/photos, filters/pagination, complete month-grid calendar                      |
| Recent Institutes   | `/recent-institutes`                                                                           | Correct back-bubble replacement                                                    |
| Gallery             | `/gallery`                                                                                     | Four feature swaps and any approved new Gallery Photos records                     |
| Think Tanks         | `/thinktanks` and affected CMS template pages                                                  | Photo, applicable inquiry forms, terminology preserved outside scoped changes      |
| About               | `/about`                                                                                       | Photo placements, Institute counter where present, staff card/modal regression     |
| Testimonials        | `/testimonials` and homepage carousel                                                          | Hero photos, approved quotes, attribution, ordering                                |
| FAQ                 | `/faq`                                                                                         | Three approved answers, any additional approved content, photos and anchors        |
| Attend              | `/attend`, `/attend#speak`, `/attend#partner`                                                  | Attendee copy, photos, applicable forms and section links                          |
| Contact             | `/contact`                                                                                     | Retained front/replaced back image, public email, optional phone and form behavior |
| HIT 2027            | `/institutes/hit-2027`                                                                         | Exact pre-registration wording, optional phone, confirmed Sam routing              |
| Ordinary Institute  | Existing non-Horizon event with sponsor content                                                | Chair sponsor present/absent cases and ordinary sponsors unaffected                |
| Horizon             | `/institutes-on-the-horizon` plus calendar shell entries                                       | Existing inquiry selection preserved; calendar shells have no registration action  |
| KBYG HCHR           | `/know-before-you-go/hchr-sept-2026-delegate` and `/know-before-you-go/hchr-sept-2026-sponsor` | Audience isolation, agenda link, current event data, optional content              |
| KBYG EHS            | `/know-before-you-go/ehs-jan-2027-delegate` and `/know-before-you-go/ehs-jan-2027-sponsor`     | Same coverage using a different event; no inherited HCHR destinations              |
| New KBYG pairs      | Every approved pair from task 36                                                               | Unique audience records, complete content, correct links                           |
| Chatbot             | Staging widget/provider test environment                                                       | All task 22 prompts, approved avatar, task 23 handoff destinations                 |

Paths are appended to `https://ipmi.webflow.io`. Verify existence/current availability when implementing; an existing CMS Published badge is not proof of a staging or custom-domain response.

## Browser execution checklist

1. Reconcile the task catalog and client-input register. Record the exact batch, unresolved items, original values, prior asset URLs, and unrelated queued site changes before publishing.
2. Validate saved changes in Designer preview, including native CMS conditions and breakpoints. For scoped runtime changes, run the maintained project's appropriate `vp` checks/build and relevant behavior tests. Documentation-only changes do not require an application build.
3. Confirm staging assets are isolated/versioned and production's unversioned CSS bytes will not be overwritten. Check provider-side chatbot changes for cross-domain effects before applying them.
4. In Chrome's Webflow site publish menu, select only `ipmi.webflow.io`. Deselect every custom domain and avoid item-level Publish now controls. Verify the publish result and open staging directly; a preview alone cannot validate all custom code.
5. Exercise the review targets at desktop 1440px, tablet 768px, and mobile 390px and 375px, then inspect affected layouts at 992/991, 768/767, and 480/479 boundaries. Verify the viewport actually changed before calling a check mobile QA; reset temporary browser overrides afterward.
6. Run the behavior matrix below. Use agreed non-production test destinations and synthetic test data for form/integration checks. If reCAPTCHA or external routing prevents a safe test, record the exact unverified behavior and use the required human/provider test flow; do not claim delivery from a success screen alone.
7. Compare representative public Home, Contact, Institute, and KBYG pages against baseline to detect accidental production or shared-asset effects. This is read-only verification, not a production publication step.
8. Attach evidence to each affected task and update the master. Provide the staging URLs and remaining inputs for review without publishing to production or sending external messages automatically.

## Acceptance matrix

| Area              | Required scenarios and pass criteria                                                                                                                                                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Copy              | All eight supplied rows appear in the intended locations; repeated overview text agrees; only the approved duplicate-word correction changes supplied prose; rendered count and animation both finish at 20.                                                                                                                                                       |
| Photos            | All 27 source rows have a recorded outcome (26 replacements, one retained Contact front image). Front/back and repeated pairs match source screenshots. No broken image, distortion, accidental reuse on unrelated pages, or unapproved stock substitution.                                                                                                        |
| Accessibility     | Informative photos have contextual alt text; decorative images are silent. Labels, focus indication, keyboard operation, contrast, and 200% zoom/reflow remain usable.                                                                                                                                                                                             |
| Phone             | Submit with blank phone and with an international number through an agreed test route. Phone is included in the actual payload/notification when supplied. Existing mandatory fields, CAPTCHA, success/failure states, hidden recipients, and integrations still work.                                                                                             |
| Email and routing | General-contact text and mailto target are `info@ipmievents.com`. Existing staff addresses remain scoped. Verify actual HIT recipient against task 34; do not assume changing visible text changes delivery.                                                                                                                                                       |
| Chair sponsor     | Configured Institute shows the correct Partner logo and no more than 200 characters above ordinary sponsors. Unconfigured Institute has no empty gap. Existing sponsor filtering, logos, and links remain intact.                                                                                                                                                  |
| HIT wording       | Requested event/year and pre-registration wording match task 18. Another Institute retains its own wording. Existing HIT page can still pre-register while its calendar shell has no registration action.                                                                                                                                                          |
| Mobile button     | Learn More About IPMI is visible, unobscured, keyboard/touch usable, and opens `/about` at verified mobile sizes; check any separate mobile element as well as the desktop version.                                                                                                                                                                                |
| Calendar          | Opens/closes with focus return; month navigation is bounded through Dec 2027; empty months, multiple same-day events, multi-day/month-boundary events, ongoing events, and local date display are correct. Every approved event appears despite listing pagination. Horizon shells expose no registration link. Existing filters and list interactions still work. |
| KBYG              | Test both audiences for HCHR, EHS, and added events; direct `#agenda`, jump navigation, mobile select, event-specific agenda/MeetMax links, missing optional data, and no incorrect audience content. Existing noindex behavior remains. Old agenda data is retained without rendering the removed grid.                                                           |
| Chatbot           | Run every prompt in task 22, including shorthand variants and ambiguous HRMI geography. Require correct event/date/destination, no unrelated discipline recommendations, appropriate contact handoff, no redundant citation links, and approved appearance. Record answer and actual destination, not just a pass label.                                           |
| Regression        | Representative filters, carousels, staff/speaker modals, existing Horizon selection links, and shared navigation/footer work; no new relevant console errors or failed assets.                                                                                                                                                                                     |
| Publication       | Staging shows the batch with custom code active. Production content and shared assets remain unchanged by this batch.                                                                                                                                                                                                                                              |

- [ ] All included task acceptance checkboxes have evidence.
- [ ] Input-dependent outcomes are resolved or explicitly deferred; no placeholder data is presented as approved.
- [ ] Staging publish destination and deployed asset references are recorded.
- [ ] Browser viewport overrides have been reset.
- [ ] Review handoff includes working URLs, screenshots, test results, owners, and remaining items.

## Evidence and review record

Populate this record during website implementation; the empty fields below are intentional future QA entries.

| Field          | Value to record                                                                           |
| -------------- | ----------------------------------------------------------------------------------------- |
| Batch and date | Included task IDs, editor, timestamp/timezone                                             |
| Webflow state  | Site, pages/templates, CMS item IDs, publish target and result                            |
| Code/assets    | Previous/new immutable asset URLs and matching source revision                            |
| Coverage       | URLs, actual viewport dimensions, browser, scenarios and results                          |
| Forms/chatbot  | Test route/provider environment, synthetic data description, verified receipt/destination |
| Evidence       | Screenshot/report links and per-task evidence locations                                   |
| Deferred items | Task ID, owner, reason, affected behavior, required input                                 |
| Review outcome | Staged for review, changes requested, or accepted for a later production task             |

## Task 15 partial verification record — September 24, 2026

Four native inquiry forms have optional Phone fields staged; [task 15 evidence](evidence/task15/README.md) records form IDs, schema/HTTP comparison, responsive/category checks, serialization limits and screenshots. Production fields and original inline scripts are unchanged. The 768px document-width 790 navbar overflow is inherited; new fields fit. Task 37 must still verify actual blank/international submissions through a controlled destination, CAPTCHA and success/error states, downstream webhook/notification mapping after safe backend deployment, and the isolated ActiveCampaign form. No delivery is claimed from local renderer or standard FormData tests. Viewport was reset after task 15.

## Rollback

Restore only the failed batch's saved page/component/CMS values and original asset bindings, then republish to staging only and repeat the relevant checks. Retain original assets and CMS data until review is complete. Coordinate shared-template changes with other active work; never overwrite newer unrelated edits with a whole-site restore. If a provider-side chatbot change affected a production instance, restore that recorded provider configuration first and document the incident. Production publication remains outside this task.

## Task 20 verification record — September 24, 2026

[Task 20 evidence](evidence/task20/README.md) records the reproduced mobile link defect and native destination correction. Repeat Home mobile Learn More pointer/keyboard activation after opening and closing the menu in integrated acceptance. 375/390/767px checks passed; desktop/tablet variant preserved. The inherited 768px navbar document width of 790 remains separate from this corrected link. Production mobile href remains '#'.
