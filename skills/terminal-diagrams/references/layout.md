# Topology-First ASCII Layout

A terminal diagram must make the answer visible before it makes the audit
complete. The visual core is not an edge ledger, a legend, or a source dump.

## 1. Separate visual and audit layers

Return these layers in order:

1. one-sentence answer or question framing;
2. one fenced `text` visual core;
3. compact source, evidence-group, node-map, and unknown notes.

The visual core uses readable labels. Canonical IDs and citations remain in the
evidence model; print them only where a reader needs them to disambiguate a
label, follow a trace, compare revisions, or audit a claim. Do not make a
reader decode `[U1]`, `[TT]`, or another opaque key before they can understand
the topology.

Use one visual question and one abstraction level per fenced block. If a plan
asks both "what lands first?" and "what does the artifact contain?", return a
delivery view and an artifact view, not two unrelated edge lists in one
overview.

## 2. Select a visual grammar

Choose the form from the evidence model, not by habit.

| Question shape                        | Visual grammar          |
| ------------------------------------- | ----------------------- |
| Ordered outcome or delivery           | Left-to-right pipeline  |
| Multiple inputs or consumers          | Fan-in or fan-out       |
| Artifact, owner, or contract contents | Containment box         |
| Parent and child work                 | Hierarchy tree          |
| Lifecycle                             | State transition path   |
| Ordered interaction                   | Numbered sequence lanes |
| One dependency path                   | Trace                   |

An overview may use a pipeline with one adjacent containment box when both
answer the same question. Otherwise split it. Do not combine delivery order,
artifact internals, current implementation, and future-stage behavior merely
because they share source material.

## 3. Use structure as semantics

Plain ASCII boxes are allowed when they show an owner, artifact, contract, or
other real containment boundary. Use `+`, `-`, and `|`; never use Unicode box
drawing. A box must earn its border:

- box title names the owner or artifact;
- rows inside are contained parts, not decorative detail;
- connector direction has one explicit verb or a clear pipeline direction;
- one box level is normally enough; split instead of deeply nesting;
- labels stay readable words, not only IDs or file paths;
- a method or scoping operation stays inside its owning type unless the source
  establishes an independent boundary;
- a contract edge represents the full source-defined contract, not one
  convenient member such as a mask.

A connector must visibly identify its endpoints or join. Use direct adjacency
where spacing would make an endpoint ambiguous. Use one primary direction per
view. Keep relationship types uniform inside a visual core: a delivery pipeline
does not also encode status and blockers on the same lines.

## 4. Templates

### Delivery pipeline

```text
+-------------+     +-----------------+     +---------------+
| input guard | --> | domain compiler | --> | consumer gate |
+-------------+     +-----------------+     +---------------+
```

Use for ordered plan units. Put a short relation above or below a connector
only when the default direction does not explain it.

### Fan-in pipeline

```text
[source records] --+
[attributes]     --+
[events]         --+-->[compiler]-->[evidence artifact]
[timeline]       --+
```

Use for a named transformation. Use the containment view separately when the
question is what the artifact contains; an exhaustive file inventory belongs in
the audit layer.

### Containment and boundary

```text
+-------------------------+
| evidence artifact       |
| - identity map          |
| - availability contract |
| - audit receipt         |
+-------------------------+
             |
        consumed by
             v
         [next owner]
```

Use for what a contract exposes and what a later owner may consume. Do not draw
future implementation internals unless the question asks for them.

### Owned contract and operation

```text
[evidence contract] --applied by--> +----------------------+
                                     | DomainDataset        |
                                     | attach_contract(...) |
                                     | current_scope()      |
                                     +----------------------+
```

Use when a later owner applies a contract and exposes a scoping operation. The
operation remains visibly owned; it is not a separate artifact filtered by the
owner. Keep this future-composition view separate from the artifact's delivery
order.

## 5. Keep the audit compact

Outside the visual core, report only what the reader needs to verify it:

```text
Source: repository@<commit>:path (current implementation)
Evidence: flow=compiler symbols; artifact=contract section;
          boundary=consumer interface.
Node map: only abbreviated or ambiguous labels.
Unknowns: runtime state is out of scope.
```

Group citations when one source section establishes multiple visible edges.
Return a full node/edge map only when the user requests an audit appendix or a
view needs explicit IDs to answer its question.

## 6. Split rather than compress into noise

Split a view when any of these are true:

- the reader must consult the legend to understand the main path;
- a box would contain unrelated concerns;
- more than one relation type is needed to explain the same lines;
- evidence would take more space than the visual core;
- width pressure removes useful labels or forces unexplained crossings.

Preserve cycles with a labeled back-edge or a separate trace. Never duplicate a
node just to make a layout look linear.
