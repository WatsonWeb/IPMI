# 27 — KBYG MeetMax links

> **Current task 37 handoff — September 24, 2026:** Use task 37 current-destinations.json for current slugs, flags and body values. The 54-page / 81-purpose requirement remains pending; concurrent EHS Delegate copy removed its earlier appended pending paragraph. Existing email fallback is still not a verified MeetMax URL. Earlier staging-only exposure is historical. See [final evidence](evidence/task37/README.md) and [current replacement guide](PLACEHOLDERS.md).

[Back to master](README.md)

- **Owner:** IPMI Operations supplies verified destinations; Bryan applies native CMS field/link updates.
- **Status:** Provisionally staged for review September 24, 2026. All 54 page/audience rows have safe pending destination states. Four example URLs were removed; two useful Operations email links have truthful labels. Final event/audience-specific MeetMax URLs and separate Sponsor Support purposes remain IPMI inputs.
- **Sources:** [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), KBYG MeetMax request; [KBYG example folder](https://ipmionline.sharepoint.com/:f:/s/IPMIExternal/IgDMJTaH9TtpSKYjyVlP6hzHATZ9JieE2KQImFfNSV6rGhc?e=xLcQz9).
- **Depends on:** Confirmed event/audience URL rows supplied through [36 — Operations input](36-kbyg-operations-content.md). Apply confirmed rows to existing pages independently; coordinate new records with [25](25-kbyg-page-coverage.md) and agenda destinations with [26](26-kbyg-agenda-links.md). Verify in [37](37-staging-verification.md).

## Target and current evidence

Target the existing **KBYG Pages** records and their independently bound **Hub URL** and Sponsor **Support URL** fields, plus any approved content-block CTA that specifically needs a MeetMax destination. The template uses separate native `href` bindings. **Agenda Link** and the Institute's **KBYG Reservation URL** are separate destinations and must not be overwritten merely because they also lead to event resources.

The local [CMS-rendering release notes](../KBYG-CMS-Rendering-Release.md), consolidated into this checkout on `master`, confirm that each CTA retains its own `href`; a root `data-kbyg-hub-url` must not override both Hub and Support. The source template contains historical email/example destinations, which are not evidence of current live CMS values. Inspect and capture actual field values in Chrome before changing them.

## Destination mapping to complete before edits

Each row needs IPMI's supplied URL, event/audience identity, intended purpose and confirmation date. Missing URLs now have labeled, noninteractive staging placeholders under Bryan's later instruction; no destination is borrowed or invented. The [54-row exact destination register](evidence/task27/destination-register.json) supersedes this original six-purpose input table and covers 54 Hub purposes plus 27 independent Sponsor Support purposes.

| Existing record / slug                             | Field and visible destination     | Approved URL                                                                             |
| -------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| HCHR Sep 2026 Delegate / `hchr-sept-2026-delegate` | Hub URL → Attendee Hub            | Awaiting IPMI                                                                            |
| HCHR Sep 2026 Sponsor / `hchr-sept-2026-sponsor`   | Hub URL → Sponsor Hub             | Awaiting IPMI                                                                            |
| HCHR Sep 2026 Sponsor / `hchr-sept-2026-sponsor`   | Support URL → Sponsor Support CTA | Awaiting IPMI; confirm whether this is a MeetMax link or a different support destination |
| EHS Jan 2027 Delegate / `ehs-jan-2027-delegate`    | Hub URL → Attendee Hub            | Awaiting IPMI                                                                            |
| EHS Jan 2027 Sponsor / `ehs-jan-2027-sponsor`      | Hub URL → Sponsor Hub             | Awaiting IPMI                                                                            |
| EHS Jan 2027 Sponsor / `ehs-jan-2027-sponsor`      | Support URL → Sponsor Support CTA | Awaiting IPMI; confirm whether this is a MeetMax link or a different support destination |

Add corresponding rows for every approved new event/audience pair from task 25 and for any explicitly supplied block-specific destination. Hub and Support may share a URL only when IPMI confirms that the same URL is correct for both; still retain separate native fields.

## Requested result and interfaces

- Reuse existing URL fields and native CTA bindings; no new MeetMax integration, account system or public API is required.
- Copy each supplied full URL exactly, including necessary query parameters. Do not derive event IDs or participant/audience paths from another link.
- Keep the destination purpose and visible/accessible label aligned. When a link changes from email support to a web Hub, remove any outdated “Email [person]” accessible label without altering unrelated staff links.
- Preserve the existing empty-link suppression for unsupplied optional CTAs. Do not publish a placeholder `https://example.com` or dead `#` link.
- Preserve destination-specific new-tab behavior; external links opening a new tab must keep appropriate `rel` protections. Do not log in as an attendee or submit registration data to validate a link.

## Ordered Chrome implementation checklist

1. [ ] In Chrome, open the existing KBYG Pages collection. Capture each target record's current Hub URL, Support URL, CTA labels and relevant link bindings before edits.
2. [ ] Fill the destination mapping above with URLs supplied and confirmed by IPMI Operations through [36](36-kbyg-operations-content.md). Confirm the event, audience and purpose for each URL; keep non-MeetMax support/reservation links when appropriate.
3. [ ] Open each supplied URL read-only in Chrome and verify that its landing/login page identifies the correct event or otherwise matches the supplied ownership evidence. Do not submit attendee data or send external messages.
4. [ ] Update the appropriate native CMS URL field through Webflow Chrome UI. Set Hub and Sponsor Support independently; add approved block-specific URLs only to their intended block fields.
5. [ ] In Designer, verify native bindings on both audience branches. Remove any obsolete root-level override if it defeats independent destinations, using the maintained source only if a code change is necessary.
6. [ ] Align CTA labels and accessible names with the confirmed destination. Preserve existing optional-link hiding and unrelated agenda/reservation/staff-contact links.
7. [ ] Publish only to **ipmi.webflow.io**. Check the actual rendered `href` and landing page for every mapped link, then record the results in [37](37-staging-verification.md).

## Acceptance checks

- [ ] Each approved event/audience/purpose row has its own verified URL, recorded owner and confirmation date.
- [ ] Attendee Hub, Sponsor Hub and Sponsor Support links resolve to their intended destinations; no event/audience cross-link occurs.
- [ ] Changing a Sponsor Hub URL does not change its Support CTA, agenda URL, reservation URL or Operations Lead contact.
- [ ] Full query strings are preserved. No placeholder/example URLs or nonfunctional `#` links are left in visible CTAs.
- [ ] Missing optional destinations hide their links according to the existing empty-content behavior.
- [ ] Visible and accessible labels describe the destination accurately; keyboard activation and mobile tapping work.
- [ ] New-tab links retain their safety attributes, and no registration or other external transaction was performed merely for QA.
- [ ] Both Sponsor and Delegate staging pages are verified after publication; CMS Published status alone is not treated as proof of the staging result.

## Rollback

Restore captured URLs, CTA labels and native bindings for only the affected records. Restore the prior versioned runtime pin if a root-override fix required code changes. Republish only staging and verify that every destination has returned to its recorded previous value.

## September 24, 2026 provisional implementation

Native Chrome CMS edits changed exactly 12 fields on the four original pages. Both Sponsor `hub-url` and `support-url` values were cleared independently. Original Hub/Support copy was retained, followed by explicit pending paragraphs. Both Delegate `hub-url` mailtos were retained; `hub-cta-label` became `EMAIL OPERATIONS`, with a pending MeetMax paragraph explaining the email purpose. Existing native optional-link conditions suppress empty CTAs. The 50 new records already have appropriate labeled pending copy and empty destinations and were left unchanged.

[Evidence and replacement/rollback procedure](evidence/task27/README.md), [exact native deltas](evidence/task27/native-deltas.json), [all 54 HTTP checks](evidence/task27/root-task27-http-verification.json), and [12 desktop/mobile browser samples](evidence/task27/browser-qa.json) record the result. Staging published at `2026-09-24T13:02:25.687Z`; all four custom domains remain at `2026-09-24T03:17:26.557Z`. No template, runtime, CSS or asset pin changed.

Implementation checks passed: 54 pages return HTTP 200; no active example or dead Hub/Support CTA; accurate visible/accessible email names; independent Hub/Support bindings; noindex, Agenda, reservation/staff links, images and all 43 blocks preserved; original and sparse new pairs checked at 1912px and 390px. Email focus and in-page keyboard navigation passed without launching mail or submitting data. Hidden empty anchors still exist in native HTML as `href="#"`, with computed `display:none`; they are neither visible nor keyboard targets. These are not active dead links.

Final URL verification, actual MeetMax landing/login identity, full supplied query-string validation and Operations approval remain pending because no MeetMax URL was supplied. No attendee login/account creation occurred. On receipt, replace each exact page/purpose field independently. For the two Delegate email fallbacks, update `hub-url` **and** its Hub-purpose `hub-cta-label` together, remove the pending/email-explanation paragraph, preserve staff contact links, and repeat staging/mobile/keyboard/landing checks. Do not treat Sponsor Support as a Hub synonym without separate confirmation.
