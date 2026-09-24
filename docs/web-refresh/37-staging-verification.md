# 37 Integrated Staging Verification and Review Handoff

[Back to master](README.md)

**Owner:** Implementation team; IPMI content/provider owners approve deferred outcomes. **Status:** All 37 tasks processed; integrated website verification complete with explicit deferred acceptance. **Date:** September 24, 2026. **Review:** [IPMI staging](https://ipmi.webflow.io/).

The implemented batch is ready for review. It includes the eight supplied copy rows, 27 photo outcomes, optional native phone fields, public contact email, chair display, HIT wording/routing supplement, photo accessibility, mobile link, 26-event calendar, 54 KBYG pages / 27 pairs and current agenda/destination handling. Native agenda day cards and full-PDF links coexist. Content approvals, provider integrations, actual delivery and actual 200% zoom are not represented as passed.

## Evidence and results

The [complete task 37 evidence](evidence/task37/README.md) records changes, native IDs, immutable pins, publication timestamps, responsive/behavior results, limitations, owners and rollback. [Independent final audit](evidence/task37/final-independent-summary.json) covers 88 successful HTTP routes, production preservation against the fresh resume baseline, native preservation, copy/photos and metadata. [Browser matrix](evidence/task37/browser-matrix.json) and [hash navigation](evidence/task37/hash-navigation.json) record actual viewport/scenario values; [verification log](evidence/task37/verify.log) records repository checks.

| Area                     | Final disposition                                                                                                                                                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Copy/photos              | Eight source rows at 11 placements and all 27 photo outcomes verified; later native EHS image descriptions corrected without replacing assets.                                                                                                                                                                     |
| Responsive/accessibility | 13 surfaces at representative desktop/tablet/mobile sizes; ten breakpoint widths across key surfaces fit. Navbar, live announcements, sparse notice contrast, venue viewer labels/alt/focus corrected. Actual browser zoom remains unverified.                                                                     |
| Calendar                 | Native independent 26-event dataset; current seven released / 19 Horizon; dates, bounds, multiday, empty-month, focus/Escape and filters checked. Staging hostname gate preserved. Final roster/copy approval pending.                                                                                             |
| KBYG                     | All 54 URLs HTTP 200/noindex; audiences and current destinations retained; 16 agenda links / 38 pending; day cards and PDF coexist. Seven navigation scenarios passed. Four opted-in EHS local all-day dates corrected, 39 legacy records and all timed instants preserved.                                        |
| Forms/HIT                | Optional native phone and category behavior checked without send; current route values/handlers preserved. Backend mapping undeployed; CAPTCHA, success/error and actual recipient/phone receipt remain open.                                                                                                      |
| Chatbot/provider         | Appearance, knowledge and handoff packs prepared; shared Tidio isolation blocks application. 16 stale sources and actual failing/blocked regression evidence retained. ActiveCampaign admin/domain evidence and delivery are open.                                                                                 |
| Regression               | Venue viewer keyboard/focus, EHS speaker modal/carousel, About carousel, industry filters and guarded calendar passed. Staff remains natively hidden; no forced live modal test. Google Maps place-details error observed once; map tiles remained. No page console errors in final checks.                        |
| Publication              | Final supplement staged at 20:13:47.538 UTC, all four production domains remain at separately approved 20:00:26.885 UTC publication. Nineteen production HTML samples unchanged from that fresh baseline. Earlier placeholders are already exposed on production; do not claim task-start production preservation. |

## Current replacement and deferred handoff

[PLACEHOLDERS](PLACEHOLDERS.md) is the replacement guide. Its current [1,232 field records](evidence/task37/current-placeholder-fields.json), [54 agendas](evidence/task37/current-agendas.json) and [54 destination rows](evidence/task37/current-destinations.json) use actual current IDs/slugs/flags/values, with historical values retained. Four earlier EHS placeholders are superseded; 1,228 entries retain interim values. Three current draft flags and concurrent client content remain untouched.

IPMI Operations owns 38 missing agenda URLs, 81 MeetMax/Support purposes, final KBYG copy/staff/deadline/hotel/coverage approval and 2027 roster completeness. IPMI content/design owns final images/rights, FAQ/testimonial/GCI-chair replacements and approvals. Provider/backend owners own task 15 deployment/controlled receipt, tasks 21–23 isolated Tidio application/testing, task 28 authenticated ActiveCampaign domain verification and task 34 Sam ownership/scope/receipt. Sam's roster identity is corroborated as `scolquhoun@ipmievents.com`, not delivery proof. [Exact next actions and owners](evidence/task37/README.md#current-replacements-and-deferred-owners).

- [x] All included tasks have implementation, verification or explicit deferral evidence.
- [x] Current placeholders and superseded historical records are distinguished.
- [x] Final staging target, asset pins and production publication chronology recorded.
- [x] Viewport override reset, zoom reset key sent, owned QA tab closed, Chrome released.
- [x] Review handoff includes URLs, screenshots, repository checks and rollback.
- [ ] IPMI final content/schedule/provider/delivery acceptance and actual 200% zoom remain open.

## Review and rollback

Review [Home](https://ipmi.webflow.io/), [calendar](https://ipmi.webflow.io/institutes), [EHS Institute](https://ipmi.webflow.io/institutes/ehs-jan-2027), [EHS Delegate KBYG](https://ipmi.webflow.io/know-before-you-go/ehs-jan-2027-delegate), and [HCHR Sponsor KBYG](https://ipmi.webflow.io/know-before-you-go/hchr-sept-2026-sponsor). Final venue-only rollback restores refresh-integration JS/CSS pins to `04eca109c5b572080313622df04aeb57fc433bdc` through Chrome and republishes staging only. Preserve the calendar hostname gate, frozen CSS, concurrent Operations content and real EHS chair. [Detailed rollback](evidence/task37/README.md#rollback).

The [original acceptance plan and dated earlier handoffs](evidence/task37/original-acceptance-plan.md) are historical. Their old unverified/navbar/hidden-agenda/14-linked wording is superseded by this record; their source requirements remain the basis for explicit deferred acceptance.
