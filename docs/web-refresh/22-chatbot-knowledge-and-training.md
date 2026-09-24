# 22 — Chatbot knowledge, terminology, links and training

[Back to master](README.md)

- **Owner:** Bryan / chatbot configuration; IPMI marketing and event owners approve factual answers and event routing.
- **Status:** Documented; provider access, training changes and regression execution are outstanding.
- **Sources:** [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), chatbot request; [Chatbot feedback](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQA1MDBRp2t9TrR2Y7DpU2W9AdjD13l41gLegMHfs3xM9ms?e=GFhegT), pages 1–9.
- **Depends on:** Provider access/test configuration from [21](21-chatbot-appearance-and-installation.md), approved copy from [01](01-homepage-and-institute-overview-copy.md), [03](03-attend-page-copy.md) and [04](04-faq-copy.md), and confirmed event details from [35](35-calendar-content-through-2027.md). Coordinate routing with [23](23-chatbot-handoff.md); only handoff-dependent regression cases await that task. Run final regression in [37](37-staging-verification.md).

## Target and current evidence

Target the existing Lyro knowledge sources, curated answers and any provider-supported response guidance. The source screenshots identify Lyro; account access and current training configuration remain unverified. The feedback documents responses observed by IPMI, not results reproduced in this documentation pass.

The feedback reports unclear brand messaging, irrelevant recommendations, inaccurate event links, stale or contradictory event chronology and repetitive FAQ links. Train against the revised approved website content and event records after their staging updates are ready. Do not infer pricing, eligibility, invitation status or event details from unrelated Institutes.

## Required response behavior and regression set

The prompts below are the supplied examples; preserve them as the minimum regression suite. Record actual answer, links, date of execution and pass/fail for each during implementation.

| Source | Prompt / issue                                                     | Required result                                                                                                                                                                              |
| ------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page 1 | General brand messaging and irrelevant links                       | Concise, accurate IPMI explanation with only links relevant to the question. Avatar is handled by task 21.                                                                                   |
| Page 2 | `Want to attend HR Canada`                                         | Identify the relevant HR Canada Institute and provide its individual event destination and appropriate attendance action.                                                                    |
| Page 2 | `the next HRMI Can`                                                | Recognize the abbreviation in context, choose the next qualifying Canadian event by current date, and link that Institute rather than a generic listing.                                     |
| Page 2 | Institute descriptions refer to “roundtable”                       | Use approved Institute/Think Tank terminology. This does not authorize renaming the site's “Think Tanks & Roundtables” navigation label globally.                                            |
| Page 3 | `How can I attend the EHS institute`                               | Explain the appropriate EHS inquiry path and link the relevant EHS event; do not recommend unrelated CLDI or HCHR events.                                                                    |
| Page 4 | `Where is the next HRMI`                                           | Ask for region clarification when needed, then provide the next matching event's location and individual link without generic/HR Canada contradictions.                                      |
| Page 5 | `What is the cost to attend an institute`                          | Use approved attendance-cost guidance, qualifying the event/audience where needed. Offer the correct human inquiry route when eligibility or pricing requires review; do not invent a price. |
| Page 5 | `Talk to a person`                                                 | Invoke the verified handoff defined in task 23. A destination that has not been confirmed is a failed test.                                                                                  |
| Page 6 | `How do institutes work?`                                          | Answer from approved overview/FAQ copy and use a relevant IPMI page when helpful; do not send the visitor to LinkedIn as the explanation.                                                    |
| Page 7 | `What is a think tank?`                                            | Use the refined, approved Think Tank definition from task 04. The bot and FAQ must agree.                                                                                                    |
| Page 8 | `what should i wear to the Health IT Institute`                    | Give the approved event attire guidance or the confirmed inquiry route; avoid a redundant “read more” link that merely repeats the same FAQ text.                                            |
| Page 8 | `what do the business meetings entail?`                            | Use approved business-meeting details from task 04, with a link only when it adds relevant information.                                                                                      |
| Page 9 | `can i bring my senior manager to the Health IT institute with me` | Route to the relevant attendance/contact owner for approval; do not assert eligibility or send only a generic FAQ link.                                                                      |
| Page 9 | `where is the next HGC institute`                                  | Return the next matching HGC event's verified location and individual event link; do not provide unrelated HCHR links or a generic Institute contact destination.                            |

## Knowledge interfaces and refresh procedure

- Reuse the existing provider's website knowledge/curated-answer mechanisms. No new public application API or second chatbot is required.
- Source title, dates, venue and destination from approved current Institute pages/CMS records. “Next” means the next relevant event according to the current date, considering an event already in progress appropriately rather than sending an already-ended event.
- Use the updated public FAQ and overview content as the canonical descriptions. Resolve contradictory source pages before retraining instead of masking conflicts with an invented answer.
- Store verified event aliases such as HRMI Canada, EHS and HGC with their actual Institute names and regions in the provider-supported knowledge format. Do not claim an acronym expansion that IPMI has not confirmed.
- After an approved website/event update: refresh the relevant source pages, remove or supersede stale curated answers, wait for provider ingestion to finish, then rerun the affected prompts plus the full regression suite before review.
- Record source URLs, refresh date and the account owner responsible for future refreshes. Do not claim the bot automatically knows unpublished staging changes or refreshes continuously unless verified in the provider.

## Ordered browser implementation checklist

1. [ ] Obtain existing provider access and an isolated staging/test configuration through [21](21-chatbot-appearance-and-installation.md). Capture current knowledge sources and curated answers for rollback.
2. [ ] In Chrome, inspect revised website/FAQ content and the current Institute records through Webflow CMS. Resolve conflicting facts and missing event data with the relevant IPMI owner.
3. [ ] Inventory imported URLs, curated answers and guidance in the provider UI. Identify entries responsible for each source-feedback row above.
4. [ ] Refresh approved sources and update provider-supported instructions/curated answers to implement the required behavior. Use event-specific destinations; remove stale, unrelated and redundant links.
5. [ ] Apply the terminology correction only to Institute descriptions. Keep legitimate site navigation/content uses of “Roundtables” intact.
6. [ ] Connect the approved eligibility/cost/additional-attendee answers to the handoff paths in [23](23-chatbot-handoff.md). Keep unresolved routes explicitly blocked.
7. [ ] In provider preview and then **ipmi.webflow.io**, execute every prompt above and record the answers and links. Include ambiguous geography and a past-event trap for “next” queries.
8. [ ] Make corrections from failures and repeat the affected tests. Record the verified refresh workflow and account owner for handoff.

## Required inputs and acceptance

Required IPMI inputs are approved cost/eligibility and attire guidance, current event records, any missing alias/region definitions, provider access and confirmed handoff recipients. These are blockers to the affected answers; they do not justify speculative replacements.

- [ ] Every supplied example is tested and has a recorded result.
- [ ] Event links resolve to the intended Institute, with correct dates/location and no unrelated discipline recommendations.
- [ ] Ambiguous HRMI geography prompts a useful clarification; chronological answers exclude ended events.
- [ ] Think Tank and business-meeting answers agree with the revised FAQ.
- [ ] Pricing, eligibility and additional attendees are handled using approved content and confirmed human routes.
- [ ] Links add value rather than repeating the answer or sending the visitor to LinkedIn.
- [ ] A documented refresh followed by a test-source change proves how updates become available to the bot.
- [ ] Provider test changes have not altered production behavior during staging review.

## Rollback

Restore the captured source list, curated answers and guidance in the isolated test configuration. Re-ingest the previous approved source set if the provider requires it, then rerun the affected prompts. Preserve test transcripts and failed cases so the issue can be corrected before another staging review.
