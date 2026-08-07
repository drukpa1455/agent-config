# Harness and Storage

This is a reference shape, not a framework requirement. Preserve the ownership
and replay contracts while adapting names and libraries to the target project.

## Contents

- [Choose storage by ownership](#choose-storage-by-ownership)
- [Keep one harness](#keep-one-harness)
- [Use one composite input](#use-one-composite-input)
- [Start with relational constraints](#start-with-relational-constraints)
- [Keep the CLI thin](#keep-the-cli-thin)
- [Delay the UI](#delay-the-ui)
- [Prove the seams](#prove-the-seams)

## Choose storage by ownership

Use different formats for different facts, not as competing databases.

| Concern                             | Preferred owner                      | Semantics                                                 |
| ----------------------------------- | ------------------------------------ | --------------------------------------------------------- |
| Reviewed imports and event evidence | Manifest-listed JSON                 | Canonical evidence; append or replace only through review |
| Current CRM state                   | PostgreSQL or SQLite                 | Canonical queryable operator state                        |
| Reports and dashboards              | Ignored JSON                         | Rebuildable projection                                    |
| Mutation receipts                   | Database or private ignored JSON     | Durable replay identity and outcome                       |
| Provider checkpoints                | Database or private ignored JSON     | Bounded execution and recovery state                      |
| Raw provider payloads               | Private encrypted or ignored storage | Retained only when policy requires it                     |

Prefer **PostgreSQL** when the project already operates it, multiple people or
processes write, row-level access matters, or the CRM may share infrastructure
with product data. Use the existing cluster with a distinct schema unless a real
retention, compliance, or operating boundary requires another database.

Prefer **SQLite** for a single operator, offline or local-first use, and no
existing database service. Keep the database ignored, enable foreign keys, use
transactions, and give one process ownership of writes. Add WAL only when
concurrent readers justify it. SQLite can be canonical operator state; do not
also mutate equivalent current state in JSON.

Use **JSON alone** only while the workflow is append-only evidence plus derived
reports. Move current lifecycle, tasks, suppressions, and provider execution to
a database once they need relational queries, concurrent mutation, or repair.

Do not add SQLite as a cache in front of PostgreSQL without measured pressure.
Pure normalization plus bounded SQL queries is the simpler path.

## Keep one harness

```text
operator_crm/
  input.py       validated source models
  records.py     pure normalization and stable identity
  followups.py   derived work from current touchpoints
  report/        pure report projections

db/
  migrations/    relational owner and constraints
  crm.py         bounded reads, writes, and receipts

scripts/crm/
  cli.py         preview, apply, report, audit
  replay.py      manifest loading and source hashing
  providers/     optional bounded enrichment adapters

ops/crm/replay/  reviewed JSON evidence and manifest
tmp/crm/         ignored reports, checkpoints, and private receipts
```

The semantic package does not import the CLI or database. The CLI composes the
semantic core with concrete storage and trusted runtime identity. Provider
adapters do not write product tables.

Maintain a small machine-readable inventory of migrations, CRM source files,
table readers and writers, and canonical replay roots when the surface grows
beyond a few files. Make the audit fail on unclassified tables, code, direct SQL
access, missing replay files, and unlisted evidence.

## Use one composite input

Normalize source-specific payloads into one account log:

```json
{
  "workspace": { "slug": "internal" },
  "firm": {
    "name": "Example Capital",
    "domain": "example.invalid",
    "kind": "investor",
    "stage": "contacted",
    "source": "reviewed-import"
  },
  "contacts": [
    {
      "name": "Example Person",
      "title": "Partner",
      "email": "person@example.invalid",
      "email_status": "valid",
      "source": "reviewed-import"
    }
  ],
  "touchpoint": {
    "channel": "email",
    "direction": "outbound",
    "occurred_at": "2026-01-01T00:00:00Z",
    "outcome": "sent",
    "source": "mail-provider",
    "external_ref": "message-123",
    "participants": [{ "name": "Example Person", "role": "recipient" }]
  }
}
```

The touchpoint is optional so research can establish a firm and contacts before
an interaction exists. Preserve source-specific extra fields in a bounded
profile or metadata object only when they carry durable evidence.

## Start with relational constraints

Use the smallest schema that enforces identity:

- `firms`: workspace, ID, name, domain, kind, lifecycle stage, source, profile,
  notes; unique active domain per workspace.
- `contacts`: workspace, firm, ID, name, title, professional URL, stage, source,
  profile, notes.
- `contact_emails`: workspace, contact, address, status, source, primary flag,
  validation time; unique address per workspace and at most one primary email
  per contact.
- `touchpoints`: workspace, firm, ID, channel, direction, time, subject, outcome,
  source, external reference, metadata. Enforce uniqueness on
  `(workspace, source, external_ref)` when the reference exists.
- `touchpoint_contacts`: workspace, firm, touchpoint, contact, role; foreign keys
  must prove the firm relationship.
- `mutation_receipts`: workspace, mutation identity, request hash, operation,
  outcome, time.
- `enrichment_runs` and `provider_objects`: add only for real provider execution;
  restrict them to the service boundary.

Derive follow-ups from the latest inbound touchpoint and its outcome. Add a task
table only when users must independently complete, reopen, assign, or reschedule
work.

## Keep the CLI thin

```text
preview: resolve root -> load manifest -> hash inputs -> validate -> normalize
         -> compile complete plan -> print summary

apply:   resolve trusted actor/workspace -> rebuild plan -> preflight receipts
         -> apply dependency phases -> write private receipt

report:  load replay or bounded database rows -> normalize -> build projection
         -> write ignored JSON

audit:   compare schema + source inventory + replay manifest -> fail on gaps
```

The database starts empty. Replay into it only through an explicit command; do
not make startup, migration, or rebuild silently restore operator evidence.

## Delay the UI

Begin with CLI previews and JSON reports. A standalone console duplicates
routing, authentication, build, projection, and browser-test machinery before
it owns mutable workflow. Add a UI only when operators need interactions that a
report and explicit commands cannot carry. The UI remains a projection over the
same compiler and storage commands.

## Prove the seams

Test input validation, deterministic identity, monotonic merge, report shape,
database constraints, tenant or workspace isolation, exact replay, conflict
preflight, phase order, concurrency bounds, private file modes, inventory
coverage, and absence of paid or outreach effects during preview and tests.
