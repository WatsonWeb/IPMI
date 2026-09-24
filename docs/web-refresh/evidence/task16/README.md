# Task 16 — Public general-contact email evidence

Implemented September 24, 2026 in Chrome Webflow Designer as IPMI Webmaster; staging only. This commit records browser changes and is not an export of Webflow state.

## Exact delta and rollback

| Unique source                                                                                                                                                                 | Previous text / href                                 | New text / href                                      | Scope                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Footer main component, Base variant → Footer Contact List → first Footer List Item → Footer Contact Link                                                                      | `Info@IPMIOnline.com` / `mailto:Info@IPMIOnline.com` | `info@ipmievents.com` / `mailto:info@ipmievents.com` | Designer warns 23 component instances; edit performed in main component, no new overrides |
| Contact Us page `63c3829b2405e78449d8cae5` → Contact Section → Contact Columns → Contact Column Left → Tab Body → Contact Info → first Footer List Item → Footer Contact Link | `Info@IPMIOnline.com` / `mailto:Info@IPMIOnline.com` | `info@ipmievents.com` / `mailto:info@ipmievents.com` | Page-local static link, outside component                                                 |

Both Link Settings were type Email, Subject blank; original hrefs contained no subject/body query parameters. No custom attributes or alternate accessible labels appeared on either selected link. The Footer has an unrelated Image property, preserved. No element IDs, classes, CMS records, component instances, form settings, embeds or runtime assets changed. Restore only the two sources' exact old Email and Text values through Designer if rollback is needed; publish staging only. Do not restore whole pages or pre-task-15 form snapshots.

## Publication and preservation

[Publication result](publish-result.png) shows staging selected and published recently, with `www.ipmievents.com` unchecked and its prior four-hours-ago publication retained. The same choices were visibly checked before publication. No CMS Publish now used. Existing unrelated draft records were not edited.

[Independent HTTP verification](task16-root-verification.json) checks 23 routes after publication. Every inventoried old general-contact link is replaced by the exact new visible text and href. Contact has two links; most consumers have one. Privacy has two current-domain links because its body link was already correct before this task. The scan covers static pages, Institute/Think Tank/Recap templates, all four sampled KBYG pages, Privacy and Terms. This is sampled public coverage, not a claim that every CMS record was opened. The main Footer edit applies to all its component instances.

The four entire inquiry form blocks are byte-identical to the post-task-15 baseline. Contact hidden `Recipient` remains `info@ipmionline.com`; Attend category routing remains `tpui@ipmionline.com`, `npanwar@ipmionline.com`, `jgray@ipmionline.com`; Horizon retains `jgray@ipmionline.com`; HIT retains `scolquhoun@ipmievents.com`. Optional Phone fields remain intact. Staff contacts, notification configuration, provider integrations and editor account were not edited. Sampled production Home/Contact/Attend/HIT retain old public links and no new general-contact links. Tasks 28/34 retain their separate requirements.

## Browser QA

- [Contact desktop 1440px](contact-desktop.png): approved email readable, existing Contact form and optional Phone retained.
- [Contact mobile card 390px](contact-mobile-card.png) and [mobile footer](contact-mobile-footer.png): both emails fit and resolve to `mailto:info@ipmievents.com`; document width equals 390. Existing mobile ordering puts the form before the contact card.
- [Home desktop shared footer](home-desktop-footer.png): visible exact new address and correct href.
- [HIT 2027 mobile shared footer at 375px](hit-mobile-footer.png): exact new address, unclipped. [DOM dimensions](hit-mobile-check.json).
- Contact desktop link keyboard focus advances with Tab to the adjacent telephone link. Both email accessible names match their visible new text; no stale `aria-label` or `title`. Email client launch and actual delivery were intentionally not exercised.

No placeholders applied. Inherited tablet navbar overflow remains task 37; no global CSS changes made. Temporary viewport overrides reset, owned QA tab closed, existing Designer left on Contact with no modal. Chrome control released to the orchestrator.
