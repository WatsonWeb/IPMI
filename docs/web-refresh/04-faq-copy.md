# 04 FAQ answers for Institutes Think Tanks and business meetings

Owner: Webflow implementer. Content owner: IPMI.

Status: Ready for implementation. Documentation only; no website edits performed.

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

- [ ] Exactly the three identified answer bodies match the approved text.
- [ ] Question headings, order, deep links, and unrelated answers remain intact.
- [ ] Answers open and close using the existing keyboard/pointer controls with correct expanded state.
- [ ] Direct links still target and reveal the intended answers.
- [ ] Long business-meeting text is readable without clipping at desktop, tablet, and mobile widths.
- [ ] Edited item/field identifiers and staging evidence are recorded for [37 Integrated verification](37-staging-verification.md).

## Rollback

Restore each answer's captured original text in its original field and republish staging. Leave question slugs, anchors, ordering, photos, and unrelated FAQ entries untouched. Recheck direct links and accordion behavior after restoration.
