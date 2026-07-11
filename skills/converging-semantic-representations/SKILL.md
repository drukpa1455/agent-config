---
name: converging-semantic-representations
description: Use only when the user explicitly asks to converge duplicated graph, plan, operation, instruction, or DTO semantics in a compiler, runtime, workflow, or data pipeline.
disable-model-invocation: true
license: MIT
---

# Converging Semantic Representations

Converge ownership, not every shape. Each semantic fact has one canonical
owner; another representation earns its existence only by introducing a real
target, authority, durability, effect, or consumer boundary.

## 1. Find the duplicated fact

Trace each candidate representation through its producer, validators,
identity, serialization, consumers, and mutations.

| Evidence                                                                  | Classification    | Action                                           |
| ------------------------------------------------------------------------- | ----------------- | ------------------------------------------------ |
| Same facts, mirror validators, independent mutation, or lossless rebuild  | Duplicate carrier | Delete it or make it a one-way projection        |
| New target semantics, authority, durability, effect, or consumer contract | Distinct phase    | Keep only the fields introduced at that boundary |

Rendered packets are projections. Durable receipts are new facts. Neither
becomes semantic input to the stable core.

## 2. Choose the owner from the domain

Do not assume the canonical form is a graph or instruction stream. It may be a
document, event log, relational fact set, immutable observation set, state
machine, or compiler IR. Choose the form that already owns the complete stable
semantics and can rebuild the others one way.

For a compiler-shaped system, one possible flow is:

```text
IR -> lower(IR, target) -> Program(order, target facts)
   -> execute(Program, bindings) -> Result or Receipt
```

This is an example, not a universal architecture. `Program` owns only facts
introduced by lowering. Runtime values belong in bindings; values consulted
during construction belong in semantic identity.

## 3. Migrate one direction

1. Characterize current outputs, failures, identities, and stable serialized contracts.
2. Establish one complete canonical owner and deterministic identity.
3. Make downstream phases reference that owner instead of copying its facts.
4. Keep compatibility at the documented boundary. Temporary dual paths require an explicit migration invariant, bounded lifetime, and deletion condition.
5. Migrate consumers, then delete duplicate producers, validators, hashes, imports, and tests.

## 4. Verify convergence

- Canonical identity is stable across fresh processes.
- Each retained phase introduces named semantics of its own.
- Execution consumes validated order rather than reconstructing hidden dependencies.
- Edge fixtures preserve approved external contracts.
- Repository search finds no legacy semantic producer, reverse adapter, fallback, or independently mutable mirror outside an explicitly bounded migration.

Do not mistake renaming for convergence, collapse distinct authority or receipt
boundaries, or preserve a carrier merely because tests reference its class
name.
