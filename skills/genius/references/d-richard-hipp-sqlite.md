# D. Richard Hipp, Contributors, and SQLite

SQLite is the lens for durable state, explicit invariants, compatibility,
systematic fault behavior, generated deliverables, and verification across
configurations.

This profile studies the official Git mirror at
[`f2e2b8202350341ef5798a7672ce18957cc952c0`](https://github.com/sqlite/sqlite/tree/f2e2b8202350341ef5798a7672ce18957cc952c0),
observed on 2026-07-12. SQLite's canonical source is Fossil, not Git; the
corresponding canonical check-in is
[`c3d307d1367ba08c9ddb9fc26c95131d3e124d7e97896383f21b48cdc154a50a`](https://sqlite.org/src/info/c3d307d1367ba08c9ddb9fc26c95131d3e124d7e97896383f21b48cdc154a50a).
The project is collaborative. Attribute mechanics to SQLite unless primary
evidence establishes individual ownership.

## Use this lens when

- corruption, crash recovery, or rollback semantics dominate;
- a public API or persisted format must survive long-lived clients;
- failure paths need deterministic ownership and fault injection;
- generated deliverables risk becoming parallel sources of truth;
- platform variability needs a narrow capability boundary;
- verification must cover configurations, not just happy-path examples.

Do not use it to justify indefinite compatibility for internal details, global C
state, a giant amalgamated source file, Tcl, or exhaustive test machinery in a
low-risk application.

## Observed path

```text
SQL text
  -> tokenizer and parser
  -> code generator and query planner
  -> VDBE program
  -> B-tree
  -> pager transaction state
  -> WAL or rollback journal
  -> pluggable VFS
```

The source map distinguishes public API, internal subsystem interfaces, the
virtual machine, storage, pager, and VFS
([`README.md`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/README.md#L324-L383)).
The leverage is not that SQLite lacks complexity; it places critical complexity
behind explicit contracts and validates those contracts under hostile failures.

## High-leverage mechanics

### Durability is written as invariants and legal states

The pager begins with numbered rollback-journal invariants covering overwrite
legality, synchronization, logical equivalence, locks, and transaction
well-formedness. It then names seven pager states and the functions responsible
for every transition
([`src/pager.c::pager invariants`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/src/pager.c#L26-L110),
[`src/pager.c::Pager.eState`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/src/pager.c#L135-L169)).
Durability is therefore a state contract with effect ordering, not a comment that
writes should be safe.

### Failure becomes owned state

Connection-scoped allocation failure is sticky: once `mallocFailed` is set,
later allocations on that connection also fail until reset. The source calls
this an important assumption used throughout the code
([`src/malloc.c::sqlite3DbMallocRaw`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/src/malloc.c#L588-L655)).
A dedicated allocator shim can fail the allocation after an exact countdown and
repeat it a controlled number of times
([`src/test_malloc.c::faultsimStep`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/src/test_malloc.c#L22-L126)).
The transfer is to normalize a cross-cutting failure once, then force every
boundary through reproducible failure—not to copy a global flag.

### Verification is a matrix with inspectable state

`testrunner.tcl` runs `testfixture`, SQLite, fuzzing, and C tests in parallel and
records both logs and a queryable SQLite database of test state
([`doc/testrunner.md`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/doc/testrunner.md#L31-L123)).
The full suite is combined with runtime permutations such as auto-vacuum and
lookaside settings
([`doc/testrunner.md::test sets`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/doc/testrunner.md#L168-L218)).
Correctness claims are tied to failure modes and configurations, while test
progress and failures remain inspectable data.

### Generated artifacts have visible owners

The public header, parser, opcode tables, keyword hash, pragma table, and
amalgamation are generated from named source templates and scripts
([`README.md::Generated Source Code Files`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/README.md#L231-L305)).
The single-file amalgamation is a distribution and optimization projection, not
the editing source. This preserves modular ownership while producing a consumer-
friendly artifact.

### Compatibility lives at public edges

SQLite retains obsolete public options as no-ops and continues supporting older
prepare interfaces while recommending corrected versioned interfaces
([`src/sqlite.h.in::SQLITE_CONFIG_PCACHE`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/src/sqlite.h.in#L2080-L2097),
[`src/sqlite.h.in::sqlite3_step`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/src/sqlite.h.in#L5270-L5347)).
By contrast, the README says internal interfaces can change between releases
([`README.md::sqliteInt.h`](https://github.com/sqlite/sqlite/blob/f2e2b8202350341ef5798a7672ce18957cc952c0/README.md#L326-L336)).
The lesson is selective compatibility: preserve contracts that external state or
clients truly depend on while allowing internal convergence.

## Source map

| Pressure            | Start here                                               | Inspect                                                       |
| ------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Public contract     | `src/sqlite.h.in`                                        | versioned APIs, legacy compatibility, generated documentation |
| Query execution     | `src/parse.y`, `src/where*.c`, `src/vdbe.c`              | grammar, planning, VM opcodes                                 |
| Durable state       | `src/btree.c`, `src/pager.c`, `src/wal.c`                | transaction invariants, state transitions, recovery           |
| Platform boundary   | `src/os.c`, `src/os_unix.c`, `src/os_win.c`              | VFS capability seam                                           |
| Failure ownership   | `src/malloc.c`, `src/test_malloc.c`, `test/malloc*.test` | sticky OOM state and injected failures                        |
| Configuration proof | `test/testrunner.tcl`, `test/permutations.test`          | suites, permutations, retained run state                      |
| Derived artifacts   | `tool/mksqlite3*.tcl`, `tool/mkopcode*.tcl`              | canonical inputs and rebuild paths                            |
| Source identity     | `manifest`, `manifest.uuid`, `README.md`                 | canonical Fossil identity and mirror verification             |

## Transfer limits

SQLite's compatibility and verification burden follows from embedded deployment,
persisted data, a huge public surface, and decades of clients. A young internal
service may be harmed by adopting that burden before a real contract exists.
Its C patterns, process-global configuration, custom build system, and
amalgamation are consequences of its domain, not default application design.

Use Tinygrad as a counter-lens when an internal carrier or compatibility shim no
longer owns external authority, durability, or repair and can be deleted.
