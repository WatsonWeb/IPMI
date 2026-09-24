# 04 FAQ answers for Institutes Think Tanks and business meetings

Owner: Webflow implementer. Content owner: IPMI.

Status: Staged for review. Three existing CMS answer bodies updated and verified on staging September 24, 2026 UTC; production was not published.

[Back to master](README.md)

## Source and targets

- [Copy to Edit.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQB-J292Wk3bSr5qa-ma4XvjAWwp5nq2sYY9Gg1g6ZAA6Zk?e=Z5tEbC): page 3, Think Tank answer; page 4, Institute and one-on-one business-meeting answers.
- Web Refresh Master To-Do: copy updates across all pages; source attachment is recorded in the master.
- [FAQ page](https://www.ipmievents.com/faq): the three existing questions about what an Institute is, what Virtual Think Tanks are, and one-on-one business meetings. Match question labels and source screenshots in Chrome before editing. Actual CMS item names/IDs and current answer values are not asserted here.

## Approved replacement answers

### Institute definition

> An IPMI Institute is a curated, executive-level event that brings together senior leaders from across industries to share insights, exchange best practices, and collaborate on real world challenges in a focused, immersive setting.

### Virtual Think Tanks

> IPMI's Virtual Think Tanks are online bespoke gatherings for sharing insights, tools, and resources to help drive organizational success, and are the go-to outlet for dealing with changing priorities and perspectives, as well as continued challenges at the macroeconomic and organizational levels.

### One-on-one business meetings

> An integral part of your event agenda is the one-on-one business meetings with leading Service Providers. These private, pre-selected meetings provide an opportunity to engage with senior-level specialists who can address your current business challenges and priorities during a 30-minute strategic conversation. Prior to the Institute, you will be able to assess the Service Providers who will be attending and select those that offer solutions to match your priorities and initiatives.

## Current state and required result

The source supplies these three replacement answers, not a complete FAQ rewrite. The legacy FAQ footer contains an accordion and URL-fragment behavior, but its selectors must not be treated as authoritative for the current site. Confirm each current answer and its actual static/CMS binding in Designer. Preserve existing question headings, order, anchor identifiers, images, and accordion semantics while replacing only the three answer bodies.

## Chrome and Webflow implementation checklist

1. Open the FAQ page in Chrome. Locate the three questions using their subject matter and the source screenshots. Record the exact page URL, displayed question, existing answer, deep link, and associated component/CMS item.
2. Open the corresponding Webflow Designer or CMS entry for each answer. Record current values and screenshots before replacing content.
3. Paste the matching approved answer into the existing answer field. Keep each answer as a paragraph and preserve its wording, capitalization, and punctuation. Retain any separate existing link or image unless its own task changes it.
4. Check each edited answer's accordion open/close behavior, keyboard access, and actual deep link. Confirm URL fragments still reveal the intended answer and no duplicate question was created.
5. Preview desktop, tablet, and mobile for clipping and spacing. Publish only to staging, then capture the expanded answers and deep-link results.
6. Give the three accepted FAQ answers to the chatbot knowledge task as authoritative content after staging verification.

## Required fields and dependencies

No new FAQ fields or records are required for these replacements. Requires access to the existing answer fields. [12 FAQ photos](12-faq-photos.md) covers supplied feature-photo swaps; [30 Additional FAQ content](30-faq-content-supply.md) covers IPMI's separate pending content/gallery contribution. [22 Chatbot knowledge](22-chatbot-knowledge-and-training.md) depends on these corrected definitions.

## Acceptance checks

- [x] Exactly the three identified answer bodies match the approved text.
- [x] Question headings, order, deep links, and unrelated answers remain intact.
- [x] Answers open and close using the existing keyboard/pointer controls with correct expanded state.
- [x] Canonical direct links still target and reveal the intended answers; inherited footer mismatch recorded below.
- [x] Long business-meeting text is readable without clipping at desktop, tablet, and mobile widths.
- [x] Edited item/field identifiers and staging evidence are recorded for [37 Integrated verification](37-staging-verification.md).

## Implementation evidence — September 24, 2026 UTC

Editor: Codex task 04 worker through Chrome, signed in as IPMI Webmaster on site IPMI. Only the existing `FAQ Answer` rich text field (`faq-answer`, editor attribute `data-automation-id="dyn-item-faq-answer-input"`) was changed in each record. Text selection replaced the prose while preserving the existing trailing links and all gallery references. No placeholders, schema changes, runtime changes, or asset changes were needed.

| CMS label / displayed question                                                     | Item ID                    | Preserved slug / fragment                 | Sort Order | Preserved gallery references |
| ---------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------- | ---------- | ---------------------------- |
| What is an Institute / What is an Institute?                                       | `63c105510d96681c49d7b93a` | `what-is-an-institute`                    | 1          | 5                            |
| What is a Think Tank / What is a Think Tank?                                       | `63c246da17b0ed6758030c71` | `what-is-a-think-tank`                    | 2          | 3                            |
| What do the business meetings look like / What do the business meetings look like? | `63c4d3b39bcbb478d8954342` | `what-do-the-business-meetings-look-like` | 7          | 5                            |

The seven-record collection initially showed all records Published. Each edited field autosaved as Changes in draft, then was explicitly queued for the next site publish. The item-level Publish now action was not used. The site publish panel was verified with `ipmi.webflow.io` checked and the sole listed custom target `www.ipmievents.com` unchecked. Publication succeeded around 04:47 UTC; staging showed Published a few seconds ago while production remained Published an hour ago. No unrelated record was edited or requeued.

### Captured original values for rollback

Institute prose:

> Institutes feature dynamic panel discussions, thought provoking keynote presentations, practical case studies and interactive think tanks that compliment pre-scheduled, private business meetings, all of which provide critical information exchange and knowledge sharing to improve the performance of your organizations.

The same paragraph retains two line breaks followed by bold `View Upcoming Institutes ➜`, linked to `/institutes`.

Think Tank prose:

> Created at a time of crisis when the Covid-19 pandemic caused us to postpone our in-person Institutes and pivot our physical event model towards virtual bespoke gatherings, IPMI‘s Virtual Think Tanks provide a platform for sharing insights, tools and resources to help drive organizational success, and are the go-to outlet for dealing with changing priorities and perspectives, and continued challenges at the macroeconomic and organizational levels.

The same paragraph retains two line breaks followed by bold `View Upcoming Think Tanks ➜`, linked to `/thinktanks`.

Business-meeting prose (single paragraph, no separate link):

> An integral part of your event agenda is the one-on-one business meetings with leading Service Providers. Prior to the Institute, you will be able to assess the Service Providers who will be attending and select 3-5 that offer solutions to match your initiatives, interests, and priorities. Your selections are then incorporated into your customized agenda. These private, one-on-one meetings provide an opportunity to engage with senior-level specialists who can address your current business challenges and priorities during a 30-minute strategic conversation.

### Staging checks and handoff

- [Institute direct link](https://ipmi.webflow.io/faq#what-is-an-institute), [Think Tank direct link](https://ipmi.webflow.io/faq#what-is-a-think-tank), and [business-meeting direct link](https://ipmi.webflow.io/faq#what-do-the-business-meetings-look-like) each reveal the intended answer on a fresh page load. Same-document fragment navigation was followed by reload to test arrival behavior.
- Browser DOM comparison before/after confirmed exactly three answer HTML values changed. All seven question labels, order, fragment IDs, and gallery image URLs were identical. The other four answer HTML values were identical. Both separate CTA links retained their label, destination, and bold formatting.
- Enter opens and Space closes each of the three focusable `role="button"` headers, with `aria-expanded` changing true/false. Pointer open/close also passed. A fast batch encountered animation timing; settled individual checks confirmed the result.
- Expanded answers visually inspected at desktop 1912 × 970, tablet 768 × 1024, and mobile 390 × 844. All prose wraps within its answer panel, including the full business-meeting paragraph. Its panel client/scroll heights matched at tablet (516px) and mobile (629px). Mobile document width equals viewport width. Browser viewport override was reset after testing.
- Lead independent read-only comparison confirmed all three approved strings on staging and absent from the production FAQ. No application tests were needed because the task changed CMS text and documentation only.
- Task 22 can use the three approved answers above as authoritative staged knowledge. Tasks 12 and 30 remain separate photo/additional-content work.

### Existing issues for task 37

The shared desktop footer's **What is a Think Tank?** link points to `/faq#what-is-a-virtual-think-tank`, while the existing record and desktop/mobile navigation use `/faq#what-is-a-think-tank`. The old footer destination has no matching target and leaves all answers closed on reload. This mismatch existed before the copy changes; preserve the canonical record slug and correct the footer link during integrated verification.

At tablet width 768px, document scroll width was 790px. DOM geometry attributes the extra width to the existing `.desktop-menu.w-nav-menu` / `.nav-button.button.w-button` extending to approximately x=790; the FAQ answer text itself fits. This navigation layout observation is a task 37 follow-up, not a claim that the whole page passed an overflow audit. Neither inherited issue was changed by this answer-only task.

## Rollback

Restore each answer's captured original text in its original field and republish staging. Leave question slugs, anchors, ordering, photos, and unrelated FAQ entries untouched. Recheck direct links and accordion behavior after restoration.
