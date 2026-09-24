# 23 — Chatbot human handoff and inquiry routing

[Back to master](README.md)

- **Owner:** IPMI names the receiving team/person; Bryan configures and verifies the provider flow.
- **Status:** Blocked on confirmed recipients, provider access and an agreed test destination. Documentation is complete; no messages have been sent or routing changed.
- **Sources:** [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), chatbot request; [Chatbot feedback](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQA1MDBRp2t9TrR2Y7DpU2W9AdjD13l41gLegMHfs3xM9ms?e=GFhegT), page 5 (“Talk to a person”/cost), page 9 (additional Health IT attendee and HGC contact destination).
- **Depends on:** Provider access/test configuration from [21](21-chatbot-appearance-and-installation.md) and confirmed destinations, including [34 — HIT inquiries to Sam](34-hit-2027-sam-routing.md) for HIT-specific routing. Coordinate answer wording and regression cases with [22](22-chatbot-knowledge-and-training.md); general routing setup does not wait for all knowledge work. Verify through [37](37-staging-verification.md).

## Target and current evidence

Target the existing chatbot's **Talk to a person** flow, human fallback for cost/attendance eligibility, and event-specific contact links. The source asks whether inquiries go to its author, Sam or the webmaster; it does not supply a confirmed routing answer. No receiving inbox/team or successful delivery has been verified.

The existing Lyro account is inferred from screenshots and must be inspected. A contact link, email notification and live-agent assignment are different routes; document and test the actual configured route. Do not infer chatbot routing from the site's displayed public email address.

## Required routing specification

| Inquiry                               | Intended handling                                                                                             | Input required before configuration                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `Talk to a person` / general question | Existing provider-supported human inbox/team handoff, or approved contact form when no live team is available | Named owner, precise inbox/team/destination URL, availability and offline behavior |
| Cost or attendance eligibility        | Relevant attendance contact receives the event and question context                                           | Approved ownership/routing rule for each relevant event/audience                   |
| Additional Health IT attendee         | Contact path for eligibility review, without granting attendance automatically                                | Confirmed Health IT owner and destination                                          |
| HIT 2027 attendee inquiry             | Sam only after the exact destination and route are supplied in task 34                                        | Sam's exact approved address/team ID/form route; test destination                  |
| Event-specific HGC inquiry            | Matching HGC event/contact path                                                                               | Confirmed HGC event owner and contact destination                                  |

Preserve useful context through the supported handoff mechanism: selected event/audience, visitor question and the contact details required by the approved existing flow. Collect only what that flow needs. Show the provider's truthful sent/queued/offline status; never promise a live conversation or delivery that has not occurred.

Use the existing provider's native routing and inbox settings. No new custom messaging service is required. If the provider cannot provide the required routing, use an approved event-specific contact form/link and clearly identify that behavior in the acceptance record.

## Ordered browser implementation checklist

1. [ ] Through task 21, verify the provider workspace and establish a staging/test configuration. Capture current handoff flows, recipients, notifications and fallback messages.
2. [ ] Fill every applicable recipient/destination cell above using IPMI confirmation. Record the confirming owner and date; resolve Sam through task 34.
3. [ ] In the provider UI in Chrome, inspect the existing Talk to a person action and its online/offline behavior. Determine whether it assigns an inbox, sends a notification or opens a contact destination.
4. [ ] Configure the confirmed routes in the isolated test configuration. Preserve existing unrelated routing and ensure event-specific rules do not override the general route accidentally.
5. [ ] In Webflow Chrome UI, adjust only any contact/form targets explicitly required for this flow. Keep staff routing separate from a public contact-email text update.
6. [ ] Update knowledge answers from task 22 to invoke the verified flow for cost, eligibility and additional-attendee questions.
7. [ ] Run non-sending preview checks first. Use an agreed test destination and explicit test-message authorization for any actual delivery test; this documentation task itself authorizes no external messages.
8. [ ] Record the actual receiving destination, payload/context, confirmation state and offline result. Publish any Webflow change only to **ipmi.webflow.io** and add the result to task 37.

## Acceptance checks

- [ ] The exact general recipient and each event-specific destination are documented and confirmed by IPMI.
- [ ] `Talk to a person` produces the advertised action, including a useful offline path.
- [ ] Cost/eligibility and additional-attendee questions route correctly without claiming automatic approval.
- [ ] HIT 2027 inquiries reach Sam's confirmed route; HGC inquiries never route via unrelated HCHR content.
- [ ] An authorized test shows delivery/assignment and preserves useful event/question context.
- [ ] The widget reports failure or an unavailable handoff truthfully and offers the approved contact fallback.
- [ ] Desktop and mobile flows work with keyboard navigation; contact links have clear labels.
- [ ] Test settings and notifications do not affect the production widget or real recipients during staging review.

## Rollback

Restore captured provider routing rules, recipient settings and fallback messages in the test configuration, plus any changed Webflow contact targets. Disable only newly introduced test routing. Keep the confirmation record and test results; do not mark a route complete until it can be demonstrated using the approved destination.
