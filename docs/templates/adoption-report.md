# Adoption Report

- **Target:** repository/workspace package inspected (no private remote URLs or secrets)
- **Mode proposed:** new | existing | limited compatibility
- **Evidence:** files inspected, declared vs installed versions, representative patterns
- **Not inspected / unknown:** facts still unresolved
- **Changes made:** none during diagnosis

## Findings and proposal

| Classification | Area | Evidence | Proposed decision / reason |
|---|---|---|---|
| Apply | | | |
| Preserve | | | |
| Defer | | | |
| Not applicable now | | | |
| Confirm | | | |

Distinguish a preference mismatch from a security/correctness defect. An inactive capability does not prove absence of an existing attack surface.

## Questions

Ask at most five initial decision questions with recommended defaults. Gather facts from files yourself. Ask a further focused round only when answers reveal a blocking decision.

## Baseline and risk

List known checks without running unknown scripts in the diagnostic phase. Record pre-existing failures from available evidence; unexecuted checks are unknown, not green. Highlight sensitive data/auth and irreversible migrations.

## Incorporation plan for approval

List exact files to add, sections to merge, configurations/dependencies to preserve, and any proposed tool/config changes. State the knowledge root, contract path, existing instruction entry point, and first normalization area.

Explicitly separate:
- documentation incorporation;
- installing/configuring a new app;
- running approved checks;
- later migrations and external services.

**Approval requested:** identify which steps the owner is approving. Stop before writes. Do not save this report into the target until approval; show it in conversation first.

## After approval

Record approval in the project contract, reconcile instructions, apply the approved diff, run the agreed checks, and report failures/limitations. Re-adoption updates these artifacts rather than making another parallel policy.
