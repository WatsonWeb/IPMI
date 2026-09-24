# Task 23 — handoff inspection and isolated configuration package

September 24, 2026. **Prepared; isolation and destination approval blocked.** Tidio account access works. No provider setting, notification, routing rule, source, Webflow field, embed or publication changed. No message, ticket, email, test notification or form submission was sent. This is a concrete review package, not an installed handoff.

## Actual prestate

[provider-observations.json](provider-observations.json) contains exact native UI values and source URLs. Chrome tab `1953600993` was task-owned. The intermittent connection banner persisted, but populated settings were inspected. Private unrelated conversations were not opened.

- Existing project `https://www.ipmievents.com`, widget `gzt0sc2vqea7hesgtoe4ga0or8kdk8lr`, remains shared/all-domain per task21. No independent configuration exists in the evidence.
- Handoff transfers to an agent both online and offline; zero handoff guidances and zero selected audiences. The selector exposes transfer, keep conversation, and create ticket. No named destination is shown there.
- Team has IPMI Webmaster (Owner), Sam Colquhoun, Zoe Stefura and Sarah Leung (Admins). All four show operating hours disabled. The three Admin rows expose Resend invitation; invitation acceptance is not established.
- **Sam Colquhoun / `scolquhoun@ipmievents.com` / operator `3931675`** is an observed account roster association. It corroborates the name associated with task34's existing native address. It does not establish mailbox control, event responsibility, approved assignment, notification recipient or receipt.
- Departments: none. Workflows: zero; auto-assign is an offered template, not a configured workflow. Legacy assignment state beyond these inspected settings remains unknown. Actual receiving inbox/assignee has not been observed with a test case.
- Personal notifications for IPMI Webmaster: email/web new-message and new-chat-request enabled; new-ticket email off/web on; forwarded email notifications off. The owner login email is not evidence of the actual alert delivery address. Other agents' personal notifications were not inspected.
- No connected email mailbox. Lyro Channels: active live chat, emails not connected, Messenger/Instagram/WhatsApp off, answers Always, Read more On, follow-up On after 1 minute, live-chat CSAT Disabled. This newly locates task22's previously unobserved Read more setting; no value changed.
- Operating-hours page confirms disabled for the selected Webmaster; project region is America/Toronto. No approved coverage or response time. Visitor email notifications off. Task21 separately observed offline tickets enabled and its existing widget offline message; neither establishes Lyro routing receipt.

[Official Lyro documentation](https://help.tidio.com/hc/en-us/articles/9003475527196-Lyro-the-conversational-AI-agent), checked September 24, describes transferred conversations in the regular/Unassigned inbox and created tickets in Tickets/Unassigned with a transcript. That is a provider behavior description, **not observed delivery in this account**. [Guidance](https://help.tidio.com/hc/en-us/articles/20810956911004-Lyro-Guidance) can express escalation policy. [Flow actions](https://help.tidio.com/hc/en-us/articles/5453966368412-Flow-editor-Actions) distinguish agent transfer and department reassignment. Plan availability and deterministic event-to-owner routing remain to be verified in isolation. Do not treat a prompt containing a person's name/email as a configured destination.

Nothing reviewed guarantees that Playground suppresses human notifications when escalating. Enabled alerts reinforce the need to avoid probing by sending. **Task22 R08 stays blocked; its 15 actual failed cases are unchanged.**

## Exact route and replacement package

[routing-matrix.json](routing-matrix.json) covers seven distinct scopes: general human help, cost, eligibility, additional HIT attendee, HIT 2027 Attend, other HIT years/categories, and unresolved HGC. Each row includes prior values, proposed pending configuration, owner, event/audience, destination type, fallback, offline/no-availability response, consent, minimal payload and fail-closed behavior. Null recipient/agent/department IDs are intentional. Never replace them with guessed values or the public contact/login email.

[replacement-register.json](replacement-register.json) holds ten exact local-only messages. They are not uploaded or rendered to visitors. [build-pack.mjs](build-pack.mjs) reproducibly generates the matrix/register/test plan. Existing useful native routes remain intact; the preserved HIT address is a **form recipient**, not a verified chatbot recipient. Additional managers are potential delegates, not dinner guests. HGC must be clarified; neither HCHR nor Healthcare GCI is an automatic substitute.

The existing public Contact page is a navigation-only fallback; its link never sends this chat or proves event ownership. No site contact-link mutation is needed. No new form or messaging service is proposed.

## Provider-supported implementation after isolation

1. Bryan and the account owner identify an existing independent test project/widget, or obtain separately authorized isolation arrangements. Record exact IDs, domain target, agents, connected channels and every notification path. A staging hostname alone does not isolate shared settings, and Keep conversation alone does not guarantee agents cannot see test conversations. Do not create/activate projects or change this shared widget as part of this package.
2. Capture complete **isolated** prestate: handoff defaults/messages/guidances, audiences, team/department IDs, workflows or legacy assignment, email integrations, notifications, operating hours, sources and active channels. Preserve unrelated rules. Verify no real agent, mailbox, webhook, ticket integration or alert recipient can receive the test.
3. In that isolated configuration only, initially set Handoff → Default rules → Behavior online **and** offline to `Keep conversation (no transfer to agent)`. In Messages, replace Keep message with exact `23-preview`. Use `23-offline` for unavailable preview wording; keep human-sending controls disabled. Keep conversation prevents this human-transfer action only: it does not stop AI answers, follow-ups, provider processing or conversation storage. Merely changing text does not disable delivery.
4. Add bounded Other guidance for clarification and policy copy from the matrix, only after task22's isolation/source approval gates. Do not add escalation-triggering guidance while routes are pending. Disable isolated proactive follow-up during non-sending review (current shared value On/1 minute remains untouched). Review offline widget ticket controls and all independent flows; do not assume Lyro's Keep option neutralizes them.
5. Obtain dated owner approval per route: full event/year/region and role, named contact, exact native agent/department/inbox ID or contact URL, reply channel, backup, coverage/timezone, collection fields and consent/privacy copy. Sam's roster association fills identity evidence only; task34 still owns scope/approval/receipt. Resolve HGC before any routing rule.
6. If native event-specific assignment is supported and entitled in the isolated account, configure the approved assignment mechanism and verify its actual destination. Keep general routing last; HIT Attend must not swallow Sponsor/other years, and ambiguity must not fall through to an unrelated event. If the available handoff only goes to Unassigned, document it as general triage and obtain explicit owner approval; do not claim it routes directly to Sam. A separately approved event-specific contact link is the alternative, with no chat-transfer claim.
7. Choose transfer or ticket only after approving its exact operational behavior. For offline use, verify an asynchronous inbox, reply route, consent, no-availability fallback and coverage. No approved route means Keep conversation plus pending message. Never enable a ticket just because a mailbox field exists. Review what full transcript Tidio includes: request minimal input and do not promise only a summarized question is shared if the provider actually transfers the entire history.
8. Run the controlled checklist below, then replace preview copy only with claims warranted by actual state. A transfer request is not an agent joining; provider acceptance is not mailbox delivery. Do not promise response times. Retain explicit unavailable/failure messages and a navigation-only contact fallback.

## Controlled delivery checklist — not executed

[delivery-test.json](delivery-test.json) supplies a synthetic fixture, 13 cases and required receipt fields. `reviewer@example.invalid` is deliberately nondeliverable; keep it local. No authorization or destination is supplied. Before any real test, replace it with an explicitly approved controlled identity and record the specific send authorization, recipient and purpose. Do not send to existing staff to discover whether they receive it.

- [ ] Verify independent configuration and zero production notification/assignment paths, including follow-up, offline widget tickets and flows. Capture rollback values.
- [ ] Complete each route's approval fields; establish controlled online and offline recipients. Record operator and timezone.
- [ ] Review fixture and consent screen without sending. Cancel/decline must create no conversation transfer/ticket/notification. Unknown recipient and ambiguous HGC must fail closed.
- [ ] Once specifically authorized, send one uniquely marked synthetic case to the isolated controlled destination. Record actual inbox/agent/department, provider case ID, timestamps, notification recipients and receiving observer. Match event, role and question; verify full-transcript handling and no unnecessary contact data.
- [ ] Test online, offline, no-availability, cost/eligibility, additional delegate, HIT category/year boundaries and HGC ambiguity. Never award attendance automatically.
- [ ] Simulate rejected/timeout outcome in the controlled test environment; no success claim or duplicate ticket on retry. Confirm the actual outcome before retrying any uncertain send.
- [ ] Inspect desktop/mobile keyboard order, focus, clear contact-link labels, consent, offline and failure wording after the isolated widget is installed. No current widget/visual pass is claimed.
- [ ] Capture receipt evidence and production-unaffected proof. Run task22 regressions afresh; preserve old actual transcripts and attach a new run, including R08 only when safe.
- [ ] Restore only test deltas, confirm test notifications cease, remove synthetic cases only through approved reversible cleanup, and retain the audit record.

## Task37 exact deferrals and rollback

Task37 must present 21–23 as **prepared, not configured/installed/verified**. Carry forward: independent project/widget and domain/notification isolation; approved general/event recipients and HGC identity; Sam mailbox control/scope/approval; plan-supported deterministic assignment or approved general triage; offline coverage/reply handling; consent/privacy/transcript behavior; real controlled receipt; R08; fresh knowledge ingestion/refresh/regression; installed-widget desktop/mobile accessibility. Do not label account access missing, assume provider Installed badge proves the widget exists, or report any delivery success.

This task has no provider/site rollback. Revert only its local artifact delta if required. Future isolated changes restore captured changed fields/rules only; never restore the shared account wholesale or disable existing useful routes. Protected global CSS and both root CSS files remain unchanged. No build is needed for inert review artifacts. The local verifier checks coverage, null destinations, fail-closed preview and synthetic gates; it is not a provider runtime or receipt test.

Task-owned Chrome tab `1953600993` closed, no viewport override used, all pre-existing tabs preserved. **Chrome released.** The three unrelated dirty KBYG paths are intentionally excluded from this task's commit.
