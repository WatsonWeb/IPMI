# 34 — HIT 2027 attendee inquiry routing

[Back to master](README.md)

**Owner:** BWC implements routing; IPMI confirms destination ownership and approval. **Status:** Provisional canonical routing staged September 24, 2026; Sam ownership, approval and delivery verification pending.

The source master requests all HIT 2027 Attend inquiries go to Sam. The earlier claim that the HIT attendee recipient was blank was incorrect. Existing CMS item `6a062fba0e49a14badf21c95`, slug `hit-2027`, already contained `scolquhoun@ipmievents.com` in `test` (Form - Attendee Request E-mail Address), and direct HIT staging/production rendered it in both attendee and Recipient fields before this work. No recipient was invented or added to that item.

## Staged implementation

The direct [HIT page](https://ipmi.webflow.io/institutes/hit-2027#invite) remains unchanged. [Horizon](https://ipmi.webflow.io/institutes-on-the-horizon?i=hit-2027#invite) and [Attend](https://ipmi.webflow.io/attend#invite) now bind native event identity and the existing canonical attendee recipient into their hidden CMS rows. An isolated immutable supplement selects that route only for HIT + Attend; it preserves the live legacy initializer and restores category baselines on other-event, empty and category transitions. Missing canonical HIT routing or inconsistent generic option identity blocks submission instead of guessing a fallback.

Only `ipmi.webflow.io` was published; every custom domain was unchecked. Production remains unchanged. See [evidence, precise bindings, verification and rollback](evidence/task34/README.md).

## Acceptance and remaining handoff

- [x] Direct HIT canonical baseline corrected and preserved; no public-email substitution.
- [x] Applicable Horizon query/card/dropdown and generic Attend selection/category paths staged and tested offline with actual published initializers.
- [x] Other-event/category restoration, optional Phone payload, native form IDs and CAPTCHA preserved; responsive/keyboard checks performed without submission.
- [ ] IPMI confirms that the existing canonical address belongs to the intended Sam and approves scope, copies and backup recipients. Official IPMI recaps identify Sam Colquhoun, but do not establish his mailbox or routing approval.
- [ ] Confirm native notification recipients, deployed backend revision and provider configuration, then agree a controlled verification destination and explicitly authorize delivery tests.
- [ ] Actual webhook/provider delivery verified for direct HIT, Horizon and Attend. Hidden-field and offline FormData results do not establish delivery.

Task 15's backend phone patch remains undeployed; task 18's exact HIT pre-registration wording and task 16's public contact email remain separate. Documentation-only interim status is `Pending Sam ownership, routing approval and controlled delivery verification`; no placeholder address is installed as a live route.
