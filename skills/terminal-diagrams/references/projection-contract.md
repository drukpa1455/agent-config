# Terminal Diagram Projection Contract

A terminal diagram is a read-only projection bound to a pinned revision or a
named GitHub observation. It answers one question from named source evidence;
it does not create semantic facts.

## 1. Identify sources before modeling

Every result names each source, revision, authority, and scope. A pinned
source is usable only when another reader can retrieve the same evidence.

### Pinned repository and document sources

Use a commit SHA or blob SHA for repository content, and an immutable revision
or content digest for an external document. Cite the repository, path, and
symbol or line range that support each fact. A path at a branch tip, a bare
`HEAD`, a mutable URL, and chat memory are not revisions.

Choose authority by the question, not by convenience:

- a pinned code revision establishes current implementation behavior;
- an approved plan establishes intended behavior and delivery outcomes;
- a pinned protocol or state specification establishes its defined semantics;
- a `diff` compares named revisions and does not choose one as current truth.

A plan and code may legitimately differ. Label them as intended and current in
a comparison. Preserve a source-declared status verbatim: `Ready for approval`
is not approved evidence. If required authority is absent or sources conflict
about the requested current or intended claim, return `SOURCE_GAP` rather than
selecting a winner.

### Live GitHub sources

GitHub issues, blockers, sub-issues, PR bases, PR heads, and PR states are
mutable. `@live` requests a fresh read; it is not a revision. Before rendering,
create one bounded observation record with:

- repository and every query endpoint or command;
- all pagination required for the stated scope;
- normalized response payloads;
- UTC fetch time for each query;
- `consistency: non-atomic`;
- a SHA-256 observation digest.

Read the root relationship summary before and after dependent queries. If its
relevant parent, child, blocker, stack, state, or `updatedAt` fields differ,
return `SOURCE_GAP`; do not combine the two reads. This detects observed drift
without claiming that the non-atomic GitHub API is a point-in-time snapshot.

Normalize by making a JSON object whose query records are sorted by canonical
query key, recursively sorting object keys, preserving source-defined ordering
such as sub-issue priority and stack order, and sorting unordered collections
by canonical entity ID. Serialize compact UTF-8 JSON with one trailing LF and
hash those exact bytes. The output source identity is the observation digest,
not the mutable URL. The digest identifies what was observed but does not make
GitHub historical state immutable or retrievable. Another reader can verify it
only when the raw query payloads were retained by their authoritative owner.

If the source changes during the read, pagination is incomplete, required
relationships are inaccessible, or two results disagree, return `SOURCE_GAP`.
A later planning or delivery gate needs a new observation; do not describe an
old digest as live state.

### Unverified input

Explicitly unverified user input may appear only as an `unverified` claim with
its own digest and no asserted relationship. It cannot establish a node, edge,
state transition, order, or authority. Return `SOURCE_GAP` if the requested
answer depends on it.

## 2. Use a minimal evidence model

Model only the information necessary to answer the question.

| Record     | Required fields                                                    |
| ---------- | ------------------------------------------------------------------ |
| Node       | canonical ID, label, type, source citation                         |
| Edge       | source node, target node, directed relation, source citation       |
| Annotation | node or edge ID, explicit status or qualifier, source citation     |
| Unknown    | question-relevant missing fact, source scope, reason it is unknown |

A relation is directional. `A --blocked by--> B` means A waits for B; it does
not imply B waits for A. Use distinct directed records for both directions when
the source establishes both.

### Stable node IDs

Use source-native, human-readable canonical IDs whenever available:

```text
issue:drukpa1455/agent-config#25
pr:drukpa1455/agent-config#31
file:owner/repo@<commit>:src/api.py#handle_request
plan:owner/repo@<blob>:architecture
protocol:<name>@<revision>:section-4
```

If no source-native identifier exists, derive
`source:<sha256-of-normalized-citation>` and include the full citation in the
evidence map. Never assign `N1`, `N2`, or another traversal-order ID.

Keep canonical IDs in the evidence model. The visual core uses a short,
readable display label such as `truth builder` or `current-corridor mask`.
Print a canonical ID only when a trace, diff, repeated label, or audit question
needs it; otherwise a legend must not be necessary to understand the topology.

A cycle points to an existing canonical ID. Do not duplicate a node to make a
cycle appear acyclic, and do not recurse through a cycle.

### Evidence and uncertainty

Every displayed edge has a citation. Cite only what the source actually says:
no inferred request/response, transitive dependency, retry, ownership, or
state transition. A source-backed absence may be shown as `not present in
<scope>`; an absence outside the inspected scope is unknown.

Keep these separate:

- **unknown**: optional detail is not established in the stated source scope;
- **SOURCE_GAP**: a missing, stale, contradictory, or inaccessible fact is
  required to answer the question;
- **unverified**: user-provided claim without source evidence.

## 3. Select one view

Use the smallest view that answers the question. Do not mix view purposes or
abstraction levels merely to make a comprehensive-looking graph.

### `overview`

Show the target boundary, direct external boundaries, major owners, and the
few relationships needed to explain the requested context. Choose one visible
primary structure: delivery pipeline, fan-in/fan-out, or meaningful
containment. Do not descend into an owner unless its internals cross the change
frontier. Split a delivery question from an artifact-composition question
instead of flattening both into one edge list.

### `expand`

Expand one named canonical node inside its parent boundary. Show only the
internal owners and direct interfaces needed to answer the question. The
parent's external relationships remain summarized, not redrawn as a second
overview.

### `trace`

Show one evidence-backed directed path between named endpoints, including the
relation at each hop. For a dependency question, say whether direction means
"depends on" or "is depended on." A missing hop, unproven transitive edge, or
ambiguous direction is `SOURCE_GAP`.

### `state`

Show only source-defined states, triggers, guards, terminal conditions, failure
transitions, and repair transitions. A transition label identifies the event
or condition, not a guessed implementation step. Do not turn `SOURCE_GAP` into
a source state.

### `sequence`

Show source-defined participants and ordered interactions. Number only an
order that the source establishes. Identify synchronous, asynchronous, retry,
acknowledgement, or failure behavior only when cited. A call edge alone does
not prove a response, completion order, or durability boundary.

### `diff`

Compare exactly two named source identities. Mark additions with `+`, removals
with `-`, and changes with `~`. A `~` record requires the same canonical node
or an explicit source-provided identity mapping; otherwise render one removal
and one addition. State whether the comparison is source text, modeled nodes,
or modeled edges.

## 4. Recurse only along the change frontier

Start with the requested boundary. Expand one level only when the change or
question crosses one of these boundaries:

- owner or implementation unit;
- public interface or compatibility contract;
- trust, process, or deployment boundary;
- durable state, consistency, or concurrency boundary;
- failure, rollback, or repair boundary.

Stop when one owner contains the remaining internals, its external contract is
explicit, cross-boundary state and failure behavior are resolved, and all
remaining decisions are reversible implementation details. There is no fixed
diagram count or depth. Split views when a graph would otherwise mix levels,
require unexplained crossings, or exceed its width budget.

## 5. Render topology-first ASCII

Read [`layout.md`](layout.md) before rendering. The visual core answers the
question first; it is not an edge ledger, full legend, or source dump.

Use a fenced `text` block and printable ASCII only. The default maximum is 80
columns. If it cannot be legible at that width, split the view; exceed the
width only when the user explicitly asks and state the measured width.

Select one grammar from the semantic graph:

- left-to-right pipeline for ordered delivery or a primary transformation;
- fan-in/fan-out for multiple source inputs or consumers;
- a plain-ASCII containment box for a real owner, artifact, or contract;
- hierarchy, state, sequence, or trace when that is the question.

Use readable labels in the visual core. Plain-ASCII `+`, `-`, and `|` boxes are
allowed only when their border expresses real containment. A pipeline arrow may
be unlabeled when the title establishes its single meaning, such as `precedes`;
all other connectors use an explicit directed verb. Keep status, blockers,
stack order, and data/control flow in separate views when they have different
meanings.

Do not make an opaque ID, exhaustive file inventory, or per-edge citation part
of the visual core. Keep canonical IDs and complete citations in the evidence
model. Return a compact source/evidence summary after the visual; expand it to
a full node/edge audit only when the user asks or an ambiguity requires it.

Before returning, measure actual ASCII byte width rather than estimating it.
Reject tabs, trailing whitespace, non-ASCII bytes, and lines over the agreed
limit. For boxes, also verify aligned borders and unambiguous connector
endpoints. Do not use Unicode box drawing, Mermaid, PlantUML, Graph::Easy,
HTML, SVG, or a renderer dependency.

Return a result in this order:

```text
Question: <one question>
View: <overview|expand|trace|state|sequence|diff>
Scope: <named boundary>
Completeness: <complete within scope|partial with listed unknowns>

<one topology-first ASCII visual core>

Source: <identity, authority, and revision or observation digest>
Evidence: <compact citation groups>
Node map: <only ambiguous labels or audit-requested IDs>
Unknowns: <none or explicit list>
```

`partial` is allowed only when all omitted facts are optional to the question.
A missing required fact is `SOURCE_GAP`, not a partial diagram.

## 6. Stop on a source gap

When a required fact is missing or conflicting, return only this form:

```text
SOURCE_GAP
Question: <one question>
Cannot establish: <required node, edge, order, transition, or authority>
Evidence: <citations and exact contradiction or absence>
Read needed: <smallest source and revision or live observation needed>
```

Do not draw a provisional edge, treat visual plausibility as evidence, suggest
an uncited architecture, write a source, or cross a planning or delivery gate.
