# Evan Wallace, Contributors, and esbuild

esbuild is the lens for measured transformation performance, data-oriented
pipeline design, parallel work with deterministic output, and eliminating
avoidable passes.

This profile studies `evanw/esbuild` at
[`6ff1d8b0d8c134e867a397eef39702a223ebef9e`](https://github.com/evanw/esbuild/tree/6ff1d8b0d8c134e867a397eef39702a223ebef9e),
observed on 2026-07-12. Repository history identifies Evan Wallace as the
principal author and also includes other contributors. Attribute mechanics to
esbuild unless history establishes individual ownership.

## Use this lens when

- transformation throughput is a measured product constraint;
- serial passes, format conversion, or repeated traversal dominate a profile;
- independent units can be processed concurrently;
- parallel work must still produce deterministic artifacts;
- incremental work needs immutable reusable inputs;
- a data representation can defer a decision and eliminate a later pass;
- benchmarks and compatibility suites should shape architecture.

Do not use it to justify concurrency, ASTs, fused phases, custom parsers, or
caches before a profile proves the bottleneck.

## Observed path

```text
entry points
  -> parallel dependency scan and parse
  -> immutable per-file AST and symbol data
  -> linking and tree-shaking graph
  -> parallel printing and source-map chunks
  -> deterministic join and output artifacts
```

The architecture document names two top-level phases, `ScanBundle` and
`(*Bundle).Compile`, and says performance decisions may make the code harder to
work with
([`docs/architecture.md::Overview`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/docs/architecture.md#L22-L66)).
The project treats performance as an explicit tradeoff to measure, not a free
consequence of using Go.

## High-leverage mechanics

### Eliminate work before optimizing it

The stated design principles maximize parallelism, avoid serialization between
tools, merge work into three full-AST passes, and keep reusable build data
immutable for incremental builds
([`docs/architecture.md::Design principles`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/docs/architecture.md#L28-L52)).
The primary move is less work and fewer conversions; concurrency accelerates the
remaining work.

### Parallel work follows natural ownership units

`ScanBundle` traverses the module graph as a parallel worklist and launches file
parsing independently
([`docs/architecture.md::Scan phase`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/docs/architecture.md#L54-L66),
[`internal/bundler/bundler.go::ScanBundle`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/internal/bundler/bundler.go#L1365-L1445)).
Printing and source-map generation are also per-file before chunks are rebased
and joined
([`docs/architecture.md::Notes about printing`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/docs/architecture.md#L476-L482)).
The transferable pattern is to parallelize independent owned units, not to add
threads around shared mutable orchestration.

### Representation removes later passes

Symbols use stable references and an array-of-arrays map selected from profiling.
Imported identifiers retain a special form until linking supplies the missing
namespace fact, avoiding another full-AST replacement pass
([`internal/ast/ast.go::SymbolMap`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/internal/ast/ast.go#L518-L542),
[`internal/ast/ast.go::FollowSymbols,MergeSymbols`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/internal/ast/ast.go#L642-L715),
[`docs/architecture.md::EImportIdentifier`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/docs/architecture.md#L217-L225)).
Data carries a deferred semantic decision until the phase that actually owns the
required information.

### Determinism is restored explicitly

Compilation can link entry points concurrently, but shared mangle-cache updates
are serialized in entry-point order and result groups are joined in that same
order
([`internal/bundler/bundler.go::Bundle.Compile`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/internal/bundler/bundler.go#L3012-L3085)).
The linker graph maps unstable source indices to stable indices and sorts dynamic
entry points before use
([`internal/graph/graph.go::LinkerGraph`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/internal/graph/graph.go#L100-L153),
[`internal/graph/graph.go::stableEntryPoints`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/internal/graph/graph.go#L257-L270)).
Parallel completion order is treated as nondeterminism to normalize, not as
output order.

### Performance claims have representative workloads

The Makefile pins and runs external Test262, UglifyJS, and Terser suites and
defines comparative application-scale benchmarks such as repeated Three.js
source
([`Makefile::external suites`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/Makefile#L722-L754),
[`Makefile::Terser suite`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/Makefile#L876-L890),
[`Makefile::Three.js benchmark`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/Makefile#L957-L1009)).
Benchmarks cover realistic scale and compare competing tools; external suites
pressure semantic compatibility.

### The tradeoff is stated rather than hidden

The architecture document says merged passes improve cache locality but separate
passes are normally easier to understand and maintain. It also calls esbuild an
experiment whose current techniques may not be best
([`docs/architecture.md`](https://github.com/evanw/esbuild/blob/6ff1d8b0d8c134e867a397eef39702a223ebef9e/docs/architecture.md#L22-L52)).
This is a guardrail: use fused phases only when measured performance pays for the
lost local clarity.

## Source map

| Pressure               | Start here                                                      | Inspect                                          |
| ---------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| Pipeline ownership     | `docs/architecture.md`, `internal/bundler/bundler.go`           | scan, compile, timing boundaries                 |
| Parsing and transforms | `internal/js_lexer/`, `internal/js_parser/`, `internal/js_ast/` | pass fusion and retained semantic facts          |
| Symbol identity        | `internal/ast/ast.go`                                           | refs, symbol maps, merging, stable identity      |
| Linking                | `internal/linker/linker.go`, `internal/graph/`                  | tree shaking, reachability, deterministic order  |
| Parallel output        | `internal/js_printer/`, `internal/sourcemap/`                   | per-file printing and rebased chunks             |
| Incremental work       | `internal/cache/`, context and rebuild paths                    | immutable reusable parse data and cache keys     |
| Proof                  | `Makefile`, `scripts/`, `internal/*_tests/`                     | external suites, benchmarks, end-to-end behavior |

## Transfer limits

esbuild's fused parser passes and specialized data structures trade local
maintainability for a measured bundler workload. An ordinary service may gain
nothing from an AST, a parallel worklist, custom caches, or low-level symbol
maps. Go's goroutines and memory model are implementation choices, not the
invariant.

Use SQLite as a counter-lens when exhaustive failure behavior and compatibility
matter more than throughput. Use Tinygrad when phase legality and replay require
more inspectable intermediate transformations than esbuild retains.
