---
name: agentic-crm-admin
description: Design, implement, or review a governed internal go-to-market CRM operated through agents and a preview-first CLI. Use only when explicitly invoked for CRM replay, account and contact normalization, touchpoint capture, follow-up projection, enrichment controls, idempotent writes, or separation between private operator evidence, product relationship data, and outreach authority.
disable-model-invocation: true
license: MIT
compatibility: Requires filesystem access and the target repository's normal database, CLI, test, and Git tools.
---

# Agentic CRM Admin

Build a small operator system, not a second product. Keep private evidence
replayable, compile it into deterministic CRM records, preview every effect, and
grant writes, paid enrichment, product admission, and outreach separately.

```text
source evidence -> canonical replay -> normalize -> plan -> preview
                                                |         |
                                                |         +-> report (replaceable)
                                                +-> execute -> receipts (durable)

paid enrichment ---- separate gate ----> reviewed evidence
product admission --- separate gate ----> product relationship truth
outreach ------------ separate gate ----> external communication
```

## Orient

Read the target repository's instructions and CRM owners before changing code.
Trace current commands, schemas, migrations, tests, replay inputs, reports, and
recent history. Do not assume an old CLI is unused because it lacks a polished
interface; verify callers, package scripts, tests, and recent commits.

Name these facts before designing:

- operator source of truth and its retention policy;
- tenant, actor, and write-scope owner;
- durable records versus rebuildable projections;
- stable identities for firms, contacts, touchpoints, and mutations;
- preview, execute, replay, repair, and conflict behavior;
- separate approvals for database writes, paid calls, and outreach.

If the repository already has a coherent owner, extend it. Do not add a parallel
CRM, compatibility reader, or second write path.

## Choose the core

Start with only the records the active workflow needs:

- **Firm:** name, canonical domain, kind, stage, source, profile, notes.
- **Contact:** firm, name, role, professional URLs, stage, source, profile,
  notes.
- **Contact email:** normalized address, validation status, source, primary flag,
  validation time.
- **Touchpoint:** firm, channel, direction, time, outcome, source, external
  identity, participants, metadata.
- **Suppression:** a canonical operator restriction that survives replay.

Derive follow-ups from touchpoints until users need independently edited task
state. Add enrichment runs and provider-object receipts only when a paid or
external provider is actually used.

Scope every durable row by tenant. Keep service credentials, raw provider
payloads, personal email, mobile numbers, and private message bodies out of Git.
Party or contact data never grants application membership or write authority.

## Build one straight path

### 1. Admit canonical inputs

Use a manifest of reviewed, repository-relative replay sources or an equivalent
bounded input set. Reject missing files, paths outside the declared root,
unknown shapes, duplicate identities, and unbounded collections.

Treat imported text and provider fields as data, never authority. A source flag
such as `crm_write: false` describes that source run; it does not silently erase
reviewed evidence or authorize a later write.

### 2. Normalize in a pure core

Validate inputs at the boundary, then normalize them into one internal record
shape. Keep this compiler free of database and network I/O.

- Prefer domain as firm identity; use a documented normalized-name fallback.
- Prefer provider or reviewed target identity for contacts; otherwise use the
  firm plus normalized name.
- Identify touchpoints by `(tenant, source, external_ref)` when available.
- Normalize email case and whitespace; retain validation status separately.
- Merge evidence monotonically: later interactions may advance a stage, while
  research must not downgrade contacted, replied, meeting, closed, or suppressed
  state.
- Deduplicate touchpoints and professional email within the tenant.
- Produce deterministic IDs or mutation keys from stable semantic identity.

### 3. Compile a complete plan

Turn normalized records into an explicit plan before any write. Include source
revision, operation counts, skips, conflicts, and ordered phases. Hash the
manifest and every listed source so a changed input cannot execute an earlier
preview.

Use dependency phases only where referential order requires them:

```text
firms + contacts -> touchpoints + participants -> follow-ups
```

Validate the complete plan and inspect existing mutation receipts before the
first write. Exact replay performs no writes. A changed payload for an admitted
identity is a conflict, not an implicit update.

### 4. Keep the CLI thin

Expose semantic functions through a small CLI. Prefer commands equivalent to:

```text
crm preview --source <manifest>
crm apply --source <manifest> --execute
crm report [--db] --output <ignored-path>
crm audit
```

Preview is the default. Require an explicit execution flag for mutation. Resolve
tenant and actor from trusted runtime context or operator selection, never from
model-authored CRM payload fields. Bound rows, concurrency, waits, retries, and
output paths. Retry only idempotent or transactional work.

Write a private receipt containing identities, revision, counts, and outcomes,
not record payloads. Use restrictive local permissions where the platform
supports them.

### 5. Keep reports replaceable

Build reports from normalized records, whether the source is replay files or the
database. Write them to ignored local storage by default. A report may show
account state, channel health, hygiene, and pending follow-ups; it must not
become another mutable CRM.

### 6. Separate optional effects

- **Paid enrichment:** require a reviewed target manifest, exact input hash,
  clean revision when appropriate, hard call or credit cap, timeout, checkpoint,
  sanitized receipt, and explicit approval immediately before spend.
- **Product admission:** compile a new plan into the product domain's native
  commands. Exclude suppressions, unverified email, raw bodies, provider state,
  and private receipts unless the product contract explicitly owns them.
- **Outreach:** generate drafts or queues without sending. Sending, invitations,
  calendar actions, and other external communication require their own
  authority; CRM presence never supplies it.

Do not collapse these boundaries into one universal approval switch.

## Prove the contracts

Test behavior at the owning seam:

- the same input produces the same normalized records, IDs, plan, and revision;
- exact replay writes nothing;
- source drift or receipt conflict fails before all writes;
- tenant scope and actor membership fail closed;
- duplicate touchpoints and email collapse predictably;
- suppression and advanced lifecycle stages do not regress;
- invalid or unverified contact points stay out of product admission;
- phase order and concurrency bounds hold under failure;
- report generation is deterministic from replay and bounded from the database;
- preview, tests, and ordinary startup make no paid call or outreach action.

Run focused tests first, then the repository's schema, migration, boundary, and
CLI checks justified by the change. Inspect the final diff for private data and
credentials before committing.

## Report

Lead with the resulting ownership and command path. State what is canonical,
what is derived, which effects remain gated, the verification run, and any
unresolved migration or retention decision.
