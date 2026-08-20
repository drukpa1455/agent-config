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
   operation that consumes or produces it, giving repeated traversals one owner
   or removing an evidenced intermediate? If not, keep the direct recursion.

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

Universal constructions characterize an object through mappings in or out:
every valid candidate factors uniquely through the universal one. The result is
canonical up to isomorphism, not necessarily minimal in API size
([`9-NaturalTransformations.tex::Universal Constructions Revisited`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/9-NaturalTransformations.tex#L748-L768)).

**Transfer:** write the constructors, observers, round trips, invalid cases, and
unique mediating operation that define the boundary. Choose a class layout,
table, tagged union, closure, or wire representation afterward. Use universal
factorization to compare candidates, not as a reason to encode categorical
machinery.

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

### Free construction records only justified structure

A free construction adds the operations and laws required by a structure while
imposing no extra equations. DaoFP presents the free monoid as a recorded program
that can later be folded into different concrete monoids
([`10-Adjunctions.tex::Free/Forgetful Adjunctions`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/10-Adjunctions.tex#L1178-L1335)).
Free monads similarly separate a sequence of operations from the interpreter
that supplies its effects
([`15-Monads.tex::Free Monads`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/15-Monads.tex#L810-L855)).

```text
domain operations -> recorded program -> validate | transform | interpret
```

**Transfer:** reify operations as data only when multiple meaningful
interpreters, transformations, inspections, or durable handoffs justify the
program representation. Prefer a domain-specific command type or AST over a
generic free encoding. If one direct execution path owns the behavior, keep the
functions direct.

### Defunctionalization makes a closed behavior set explicit

DaoFP replaces a finite family of closures and captured environments with a sum
type of frames plus one `apply` interpreter. The resulting continuation is
ordinary recursive data that can be inspected or serialized
([`10-Adjunctions.tex::Defunctionalization`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/10-Adjunctions.tex#L1025-L1166),
[`Haskell/10-Defunc.hs`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/Haskell/10-Defunc.hs)).

**Transfer:** use tagged frames and an interpreter when functions must cross a
process, durability, inspection, or explicit-control boundary and the behavior
set is deliberately closed. Do not centralize an open plugin or extension model
into an ever-growing dispatcher.

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

The first benefit is ownership: the traversal owns recursion while clients
supply non-recursive production or consumption steps. A hylomorphism may also
fuse a producer and consumer without materializing the conceptual intermediate.
The book then shows a well-typed fold over an infinite structure that diverges
and warns that Haskell examples are illustrations rather than proofs
([`12-Coalgebras.tex::The impedance mismatch`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/12-Coalgebras.tex#L209-L254)).

**Transfer:** centralize recursion when several operations share its shape or
when fusion removes a measured intermediate. Direct recursion is clearer for one
local operation. Structural lawfulness does not prove termination,
productivity, bounded memory, or acceptable complexity.

### Focused updates earn composition through laws

DaoFP derives a lens from `get` and `set`, then obtains three laws: setting the
current focus changes nothing, getting after setting returns the new focus, and
the last of two sets wins
([`17-Comonads.tex::Lenses`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/17-Comonads.tex#L478-L569)).
Its existential representation preserves an opaque residue while replacing the
focus; nested lenses compose by combining their residues
([`18-Ends.tex::Existential Lens`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/18-Ends.tex#L940-L1161)).

**Transfer:** use a lawful focus when repeated nested reads and immutable updates
must compose across representations. Test its round trips. A direct update
function remains clearer for an ordinary record; profunctor optics and Tambara
modules are explanatory machinery, not a default dependency.

## Transfer limits

DaoFP develops a mathematical model in Haskell and category theory. Real systems
still need explicit mutation ownership, resource bounds, transactions,
authorization, compatibility, observability, cancellation, and cleanup. A law
about pure values does not establish those operational properties. Nor does a
lawful type establish termination, productivity, resource use, or runtime
scheduling.

Do not copy the costume. Start with ordinary domain types, named functions, and
tests of observable laws. Reach for higher-kinded encodings, free structures,
optics, or categorical vocabulary only when the target language, team, and
repeated composition problem make them the simplest honest representation.

## Source map

- [`DaoFP.tex`](https://github.com/BartoszMilewski/DaoFP/blob/7a03427c75c830518aa6ffdbcf1b9d131f8f4cfc/DaoFP.tex)
  owns the book assembly and chapter order.

Read only the tier justified by the target pressure:

| Tier           | Chapters | Use for                                                                       |
| -------------- | -------- | ----------------------------------------------------------------------------- |
| Default        | 1-9      | Composition, algebraic shape, construction, observation, laws, and genericity |
| Evidence-gated | 10-15    | Free construction, defunctionalization, recursion ownership, and effects      |
| Specialized    | 16-22    | Comonadic context, optics, Kan extensions, enrichment, and dependent types    |

Within the specialized tier, chapter 17 supplies the practical lens laws and
chapter 22 sharpens the distinction between definitional equality,
propositionally proven equality, and isomorphism. The remaining machinery mainly
explains representation equivalences and composition; do not load it merely to
name an application abstraction.
