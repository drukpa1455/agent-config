# Engineering Lens Index

Choose a lens by the target pressure, not by fame or aesthetic preference. Each
profile is a revision-bound study of work produced by a person and collaborators;
it is not a personality model or a claim of sole authorship.

## Roster

| Lens                                                                     | Best fit                                                                             | High-leverage pattern visible in the work                                                                | Useful counterweight                                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [George Hotz, contributors, and Tinygrad](george-hotz-tinygrad.md)       | Semantic convergence, explicit phases, realization, introspection, deletion          | Many features converge through one inspectable representation and ordered execution path                 | SQLite when external compatibility or durable repair dominates                      |
| [D. Richard Hipp, contributors, and SQLite](d-richard-hipp-sqlite.md)    | Durable state, compatibility, failure handling, generated deliverables, verification | Explicit invariants and fault simulation protect a long-lived contract while internals remain changeable | Tinygrad when internal carriers survive without owning a contract                   |
| [Fabrice Bellard, contributors, and QuickJS](fabrice-bellard-quickjs.md) | Embedded runtimes, footprint, explicit resource ownership, compact complete systems  | A narrow host API exposes ownership and bounds around direct, dependency-light machinery                 | esbuild or Tinygrad when inspectable transforms justify retained intermediate state |
| [Evan Wallace, contributors, and esbuild](evan-wallace-esbuild.md)       | Measured transformation performance, parallel pipelines, deterministic output        | Data layout and pass fusion eliminate work while serialization restores deterministic ownership          | SQLite when compatibility and exhaustive failure behavior outweigh throughput       |

## Studied snapshots

| Project           | Primary origin                             | Studied revision                                                                                                                    | Observed   |
| ----------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Tinygrad          | `https://github.com/tinygrad/tinygrad.git` | `e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b`                                                                                          | 2026-07-11 |
| SQLite Git mirror | `https://github.com/sqlite/sqlite.git`     | Git `f2e2b8202350341ef5798a7672ce18957cc952c0`; canonical Fossil `c3d307d1367ba08c9ddb9fc26c95131d3e124d7e97896383f21b48cdc154a50a` | 2026-07-12 |
| QuickJS           | `https://github.com/bellard/quickjs.git`   | `04be246001599f5995fa2f2d8c91a0f198d3f34c`                                                                                          | 2026-07-12 |
| esbuild           | `https://github.com/evanw/esbuild.git`     | `6ff1d8b0d8c134e867a397eef39702a223ebef9e`                                                                                          | 2026-07-12 |

A snapshot remains useful historical evidence after upstream moves, but it must
not be described as current without a fresh check.

## Selection

Start from the hardest constraint:

- **Too many parallel semantic carriers or hidden execution order:** Tinygrad.
- **Corruption, rollback, compatibility, fault recovery, or long-lived public
  contracts:** SQLite.
- **Embedding, startup, footprint, host-controlled memory or execution:**
  QuickJS.
- **Transform throughput, avoidable passes, parallel work, deterministic build
  products:** esbuild.

Use one counter-lens when the target has a competing constraint:

- Tinygrad + SQLite: should an internal representation be deleted, or does it own
  a durable compatibility or recovery boundary?
- QuickJS + Tinygrad: does direct lowering remove useless machinery, or hide
  transformations that need legality checks and replay?
- esbuild + SQLite: is measured throughput worth fused phases, or does the
  failure and compatibility surface require slower explicit boundaries?
- esbuild + QuickJS: should concurrency maximize throughput, or should one host
  retain simple deterministic resource ownership?

Do not combine lenses just because several sound appealing. A comparison earns
its place only if it can reverse or sharpen the target decision.

## Evidence strength

Prefer evidence in this order:

1. current source and focused tests at a full revision;
2. project-authored architecture and contribution documents at that revision;
3. a reproducible trace with retained command and output;
4. history showing a deletion, reversal, or measured optimization;
5. explicit primary statements tied to the observed work.

Secondary essays, interviews, and reputation may suggest where to look but do not
establish repository behavior or personal intent.

## Adding a lens

A candidate belongs here only when all are true:

- a canonical public source can be pinned and inspected;
- the work exposes a distinct design pressure not already covered;
- at least one complete path, its tests, and a tradeoff can be cited;
- collaborators and project ownership can be represented honestly;
- the profile says what not to copy;
- routing tests demonstrate when the lens should and should not be selected.

A long roster with shallow cards is worse than a small roster with falsifiable
source maps.
