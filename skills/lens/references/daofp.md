# DaoFP: Bartosz Milewski

DaoFP is the lens for deriving interfaces from construction, observation, and
composition; choosing algebraic shapes deliberately; making effects visible;
and using laws to distinguish real abstractions from coincidental wrappers.

This profile studies `BartoszMilewski/DaoFP` at
[`7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc`](https://github.com/BartoszMilewski/DaoFP/tree/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc),
observed on 2026-08-19. The repository contains no detected license at this
revision. This profile therefore paraphrases narrow primary-source observations;
it does not reproduce the book or its examples.

## Fit

Use this lens when target evidence shows an interface defined by representation
rather than behavior, multiple awkwardly equivalent encodings, composition that
needs exceptions, a generic transformation that inspects concrete cases, hidden
effects, unnecessary sequencing, or repeated recursive traversals with unclear
ownership. Do not use it merely to demand purity, Haskell, point-free syntax,
monads, category vocabulary, or type-level machinery.

## Decision card

Use only the tests matching the evidenced target pressure.

1. **Construction-observation test:** can the concept be specified by how valid
   values are built, observed, and transformed without exposing its storage? If
   not, name that contract before choosing a representation.
2. **Algebraic-shape test:** is the choice one-of-many, several-at-once, or
   pluggable behavior? Model it first as a sum, product, or function-shaped
   boundary; reject encodings that admit meaningless combinations.
3. **Composition-law test:** does composition have an identity, associate, and
   preserve the promised behavior? If not, the abstraction or its boundary is
   incomplete; do not repair it with call-order folklore.
4. **Genericity test:** does a supposedly generic transformation preserve
   structure and commute with the target's ordinary mappings? If it must inspect
   payload types or concrete variants, narrow the claim.
5. **Effect test:** are failure, environment, state, output, nondeterminism, and
   external action visible at the boundary that composes them? If not, return
   data or an explicit operation and let the owning boundary perform the effect.
6. **Dependency test:** can computations be combined without one inspecting the
   other's result? If yes, preserve independence; require sequential composition
   only for a real data or effect dependency.
7. **Recursion-ownership test:** can recursive shape be separated from the
   operation that consumes or produces it, and would doing so remove an evidenced
   intermediate or duplicate traversal? If not, keep the direct recursion.

If the target problem is local, ordinary functions already compose clearly, or
the language cannot express a proposed law without obscuring ownership, DaoFP
may be the wrong lens.

## Observed reasoning path

```text
objects and arrows
  -> composition, identity, and associativity
  -> construction and observation rules
  -> sums, products, and function objects
  -> structure-preserving mappings and natural transformations
  -> universal constructions
  -> recursive algebras and coalgebras
  -> explicit effects
  -> independent and dependent effect composition
```

The sequence starts with relationships and composition before introducing
concrete programming encodings
([`1-CleanSlate.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/1-CleanSlate.tex#L1-L101),
[`2-Composition.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/2-Composition.tex#L8-L103)).
Later chapters add structure only when it preserves those relationships.

## High-leverage mechanics

### Specify behavior before representation

DaoFP treats objects as knowable through incoming and outgoing arrows. Two
representations are interchangeable when mappings in both directions preserve
observable behavior
([`3-Isomorphism.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/3-Isomorphism.tex#L42-L163)).

Sum types are characterized by their alternatives and case analysis; products
by construction from components and projections back to them. Their computation
and uniqueness rules say that constructing then observing, or observing then
reconstructing, behaves predictably
([`4-SumTypes.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/4-SumTypes.tex#L121-L332),
[`5-ProductTypes.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/5-ProductTypes.tex#L13-L117)).

**Transfer:** write the constructors, observers, round trips, and invalid cases
that define the boundary. Choose a class layout, table, tagged union, closure, or
wire representation afterward. A universal property is useful here as a design
test: the interface should provide exactly the mapping its consumers require,
not as a reason to encode categorical machinery.

### Composition laws expose false boundaries

Composition decomposes a program while associativity makes the grouping of that
decomposition irrelevant
([`2-Composition.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/2-Composition.tex#L8-L44)).
Functorial mappings retain identity and composition; naturality requires two
structurally equivalent routes to agree
([`8-Functors.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/8-Functors.tex),
[`9-NaturalTransformations.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/9-NaturalTransformations.tex)).

**Transfer:** state laws as observable equalities and test representative paths.
A mapper that changes meaning, a wrapper that cannot preserve identity, or a
generic adapter that switches on concrete payloads has not earned its abstraction
claim. Laws support ordinary named functions; they do not require abstract names
in production code.

### Effects are composition contracts

DaoFP makes effects visible in function inputs or results so callers can own
their interpretation. Its examples pass environment and state explicitly,
return log data, and defer external action to an executing boundary
([`13-Effects.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/13-Effects.tex#L17-L156)).

Independent computations use applicative composition; dependent computations
need sequential composition. The distinction is dependency, not syntax or a
promise that the runtime will execute work concurrently
([`14-Applicatives.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/14-Applicatives.tex#L9-L57),
[`15-Monads.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/15-Monads.tex#L7-L89)).

**Transfer:** choose the weakest composition contract that preserves meaning.
Return data from the stable core, execute it at an owned boundary, and keep
independent validation, lookup, or preparation independent. Introduce an effect
type only when it makes composition or failure materially clearer than an
ordinary result and explicit orchestration.

### Recursive shape and interpretation can separate

DaoFP presents algebras as consumers of recursive structure and coalgebras as
producers, with folds, unfolds, and their composition separating traversal shape
from interpretation
([`11-Algebras.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/11-Algebras.tex),
[`12-Coalgebras.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/12-Coalgebras.tex)).

**Transfer:** use this distinction when several operations share a recursive
shape or when producer-consumer fusion removes a measured intermediate. Direct
recursion is clearer for one local operation. Do not introduce recursion-scheme
libraries, fixed-point encodings, or advanced types without repeated pressure.

## Transfer limits

DaoFP develops a mathematical model in Haskell and category theory. Real systems
still need explicit mutation ownership, resource bounds, transactions,
authorization, compatibility, observability, cancellation, and cleanup. A law
about pure values does not establish those operational properties.

Do not copy the costume. Start with ordinary domain types, named functions, and
tests of observable laws. Reach for higher-kinded encodings, free structures,
optics, or categorical vocabulary only when the target language, team, and
repeated composition problem make them the simplest honest representation.

## Source map

- [`DaoFP.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/DaoFP.tex)
  owns the book assembly and chapter order.
- Chapters 1-6 develop composition and algebraic data construction.
- Chapters 8-10 develop structure-preserving mappings, naturality, universal
  constructions, and adjunctions.
- Chapters 11-12 develop recursive algebras and coalgebras.
- Chapters 13-15 develop explicit effects and their parallel or sequential
  composition.
- Chapters 16-22 continue into advanced categorical and dependent-type
  machinery; they are source context, not default transfer guidance.
