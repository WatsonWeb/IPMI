# 28 — IPMI dependency: ActiveCampaign domain verification

[Back to master](README.md)

**Owner:** IPMI account/domain administrator; BWC records the result and checks affected forms. **Status:** Read-only investigation complete; account/domain acceptance pending authenticated evidence. No domain or integration changes performed.

## Source and target

- [Web Refresh Master To-Do](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQDcMcTdU_t5RrSMF4cpizzbAYhFRwKUScDDaC1bx0vQCBI), page 2, **On our end**: double-check the ActiveCampaign domain.
- The IPMI ActiveCampaign account's relevant domain/authentication settings and any website forms that actually integrate with it. The exact configured domain and account status are not verified by the planning research.

## Current state and intended result

This is a client verification dependency, not evidence of a broken domain. IPMI must identify the intended domain and provide the account's current verification/authentication result. The public address change to `info@ipmievents.com` in [16](16-public-contact-email.md) does not establish which ActiveCampaign domain is configured or authorize blanket DNS or sender changes.

## Required IPMI inputs

| Input                 | Required detail                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account/context       | Account identifier or UI URL, responsible administrator, and which domain function is being checked.                                                |
| Domain                | Exact configured domain and intended domain; distinguish a website domain, sender domain, and any tracking domain.                                  |
| Verification evidence | Dated screenshot/status from the relevant ActiveCampaign settings, including any unresolved requirement. No passwords or API keys in this document. |
| Affected integrations | Website form names/URLs and intended list, automation, or notification behavior, if any.                                                            |
| Remediation outcome   | If verification fails, administrator-provided completion status and retest result rather than assumed success.                                      |

## Chrome / implementation handoff checklist

1. Record IPMI's evidence against the inputs above. Use read-only account settings inspection if access is supplied; do not infer account status from an email address on the website.
2. Have the domain/account administrator resolve any provider-reported domain issue using the actual account requirements. Record the change and verified outcome without copying secrets.
3. In Chrome, inspect the affected Webflow forms and their actual current integrations. Preserve existing hidden recipients and field mappings while assessing whether the domain change requires a website adjustment.
4. If an explicit website mapping change is required, record it in [15](15-optional-phone-fields.md) or the relevant routing task and validate with the agreed test destination.
5. Hand the evidence to [37](37-staging-verification.md). No external message or campaign send is part of this documentation pass.

## Acceptance checks

- [ ] Exact intended domain, verification context, administrator, and dated status are recorded.
- [ ] Any reported account/domain requirement has an evidenced resolution or remains explicitly pending.
- [ ] Affected Webflow integrations have been identified; unrelated forms are not changed speculatively.
- [ ] Agreed form test evidence is available where an actual integration was affected.

## September 24, 2026 investigation and pending replacement

Fresh Chrome inspection of [the account admin](https://ipmionline81168.activehosted.com/admin/) displayed `IPMIONLINE81168 Email Marketing` with username/password inputs, Remember my username, Forgot? and Login. No authenticated settings were accessible. No credential entry, login attempt, account creation, DNS change, sender change, campaign, email or form submission occurred. This establishes an access limit, not a failed domain verification.

[DORN Think Tank on staging](https://ipmi.webflow.io/thinktanks/dorn-vtt-2026) currently renders the Request Invite form with Full Name, Company Name and Email. Its live DOM confirms script `https://ipmionline81168.activehosted.com/f/embed.php?id=412`, POST action `https://ipmionline81168.activehosted.com/proc.php`, and field names `fullname`, `customer_account`, `email`. The account hostname identifies the observed integration; it does not establish the intended sender or tracking domain, verification status, list/automation destination, or delivery. Form 412's optional Phone gap remains owned by [task 15](evidence/task15/README.md).

The four native inquiry sources (Contact, Attend, Horizon and Institutes template) use Webflow, email notifications and `https://ipmi-express-server.vercel.app/webhooks/webflow/forms`, as captured in task 15. That backend uses Resend downstream; it is separate from the observed ActiveCampaign embed. Task 16's public `info@ipmievents.com` is not evidence of ActiveCampaign sender authentication. No website mapping change was demonstrated necessary, so no Webflow edit or publication was made.

The exact interim record is **`Pending account/domain verification`**. It is documentation-only; no public placeholder or substitute credential/domain was installed. Replace this record using the checklist below, retaining the dated evidence. Both owned research tabs were closed; no viewport override was applied and existing tabs were preserved.

| Required replacement / verification | Current evidence or missing value | Responsible owner |
| --- | --- | --- |
| Confirm account and responsible administrator | Observed account admin URL above; administrator name/role pending | IPMI account administrator |
| Identify the requested domain function | Pending: sender authentication, tracking/link domain, or another named function; do not infer from public website/email | IPMI account administrator |
| Record exact configured and intended domains | Both pending, with the associated settings page name/URL | IPMI account/domain administrator |
| Capture dated provider status | Pending authenticated screenshot/export showing the relevant domain and exact status/requirements; redact secrets | IPMI account administrator |
| Resolve only an evidenced requirement | Pending only if provider reports one; capture administrator's before/after status and retest date, without inventing DNS records | IPMI domain administrator |
| Confirm integration scope | Form 412 observed; account-side list, automation, notification, additional form IDs and affected domains pending | IPMI account administrator + implementation |
| Verify any affected path safely | Establish isolated form/test routing and agreed recipient before a controlled test; record receipt and unchanged unrelated mappings if remediation affects integration | IPMI + implementation; coordinate 15/37 |

Acceptance remains open. The observed integration is identified for the sampled page, but account-wide inventory and any affected-path delivery remain unverified. No unresolved account status is represented as a staging pass.

## Rollback

No rollback is needed for collecting evidence. Any later domain/DNS remediation must retain its prior settings and be reversible by IPMI's domain administrator; website mappings must have their own recorded baseline.
