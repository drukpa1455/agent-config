---
name: converging-semantic-representations
description: Use when a compiler, runtime, workflow, or data pipeline has multiple graph, plan, operation, step, instruction, or DTO forms that may duplicate semantic facts, especially during IR convergence, compatibility migration, or executor redesign.
---

# Converging Semantic Representations

## Overview

Converge ownership, not every shape. Each semantic fact has one canonical owner; another representation earns its existence only by adding a real target, authority, durability, or consumer boundary.

## Boundary Test

| Evidence | Classification | Action |
| --- | --- | --- |
| Same facts, mirror validators, independent mutation, or lossless rebuild | Duplicate carrier | Delete it or make it a one-way edge projection |
| New target semantics, authority, durability, or consumer contract | Distinct phase | Keep a small required-field type and an explicit transition |

Rendered packets are projections. Durable receipts are new facts. Neither becomes the semantic input to the core.

## Canonical Contract

Use the smallest honest pipeline:

```text
Graph(nodes, symbols, inputs)
  -> lower(graph, requested_outputs, target)
  -> Program(graph_id, requested_outputs, order, lowering_version)
  -> execute(graph, program, bindings, operations)
  -> Result
```

- `Graph` owns complete semantics: literals, types, ordered operands, anonymous nodes, and public aliases.
- `Program` owns only facts introduced by lowering. Prefer graph-node references when execution semantics are unchanged; introduce instructions only when the target transformation is real.
- Requested outputs belong in Program identity whenever they select its closure or order. An intentionally all-output Program may leave result selection to the run, but its body must already be complete and closed.
- `Bindings` own typed runtime values. A value, shape, or option consulted during graph construction is specialization input and therefore changes Graph identity.
- `Run` identity adds bindings and every execution determinant.
- Compatibility preserves the documented boundary—often serialized bytes or schema—not undocumented internal class identity.

## Migration Recipe

1. Characterize current outputs, failures, identities, serialized contracts, and execution shape.
2. Establish the complete canonical Graph and deterministic identity.
3. Lower one closed Program and make execution consume its order literally. Reject unknown, duplicate, dangling, cyclic, dependency-inverted, or unmet entries.
4. Switch the principal runtime. Keep compatibility as outbound edge projections only—never aliases, reverse adapters, dual execution, or fallback evaluation.
5. Migrate consumers, then delete duplicate producers, carriers, validators, hashes, imports, and tests.

## Exit Gate

- Canonical identities are stable across fresh processes and hash seeds.
- Operand, literal, specialization, target, and requested-output identity tests match their ownership rules.
- Replay executes the Program it validates; malformed order cannot be repaired recursively.
- Edge fixtures preserve approved contracts.
- Repository search finds no legacy semantic producer, consumer, reader, writer, alias, re-export, or fallback outside an explicitly retained projection.

## Common Mistakes

Treating renamed aliases as convergence; copying graph fields into instructions with no target transformation; preserving Python DTO classes when only JSON is stable; discovering closure during execution; or collapsing graphs, programs, receipts, and views into one optional-field type.
