# 28 — IPMI dependency: ActiveCampaign domain verification

[Back to master](README.md)

**Owner:** IPMI account/domain administrator; BWC records the result and checks affected forms. **Status:** Awaiting IPMI verification evidence; no domain or integration changes performed.

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

## Rollback

No rollback is needed for collecting evidence. Any later domain/DNS remediation must retain its prior settings and be reversible by IPMI's domain administrator; website mappings must have their own recorded baseline.
