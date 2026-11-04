# Security Policy

## Supported code

The `main` branch of this source kit receives best-effort security fixes. There is no long-term-support branch and no guaranteed response time or service-level agreement.

Adopted copies are maintained by the consuming project. This repository cannot patch a downstream application or guarantee that an adopted revision follows newer guidance.

## Report privately

**Do not open a public issue for a vulnerability.**

Use GitHub’s private advisory flow:

**https://github.com/Hangtu/agentic-nextjs-template/security/advisories/new**

Include:

- affected file, operation, or script and the repository revision;
- the security impact and who could be affected;
- minimal reproduction steps or a proof of concept;
- commands actually run and observed results;
- a suggested fix, if you have one.

Redact credentials, tokens, personal data, and private application details. Do not attach production data or test against systems you do not own or have permission to assess.

If the private advisory form is unavailable, contact the maintainer privately using the contact information on [@Hangtu’s GitHub profile](https://github.com/Hangtu) and ask for a private channel. Do not include vulnerability details in a public issue.

## Scope

In scope:

- unsafe instructions in scripts, checks, adoption, updates, or operation boundaries;
- a validator that reads or writes outside the intended repository;
- a documented pattern that creates a security defect in generated or adopted code;
- CI or supply-chain weaknesses in this repository.

Usually out of scope here:

- vulnerabilities in a downstream application, even if the project adopted this kit;
- vulnerabilities in third-party frameworks or services, unless this kit’s guidance is the cause;
- reports requiring access to another person’s account, data, or deployment;
- social engineering, denial of service, or destructive testing.

For an application incident, contact that application’s owner through its published security process. If the root cause is an instruction in this kit, report it here without sharing the consumer’s private data.

## Good-faith research

Good-faith, non-destructive research is welcome. Do not access data that is not yours, disrupt services, or test third-party infrastructure. We may ask for clarification, may decline reports outside scope, and will credit useful reports when requested and appropriate.

## Disclosure

Please allow time for triage and a fix before publishing details. If a report involves an actively exploited issue, state that clearly in the advisory so it can be prioritized. This project makes a best-effort response; it does not promise a fixed remediation deadline.
