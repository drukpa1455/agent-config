# Contributing

Make one thing clearly better.

If the change needs a long argument to establish its value, it is probably not
ready. Improve the owner first, prove that improvement independently, then make
the final change small.

## Before a pull request

- Read `README.md`, `AGENTS.md`, and the owning source.
- Explain the observed failure or missing capability.
- Keep refactors separate from behavior changes.
- Remove incidental formatting, generated churn, and unrelated cleanup.
- Disclose material AI assistance and review every resulting line and claim.

Open a pull request only when the change is coherent and ready to merge.

## What belongs here

Global policy changes must be useful across ordinary repositories and harnesses.
Name the pressure case that requires the rule and the safe behavior it must
preserve.

A skill owns one bounded capability. Keep its trigger precise, its effects within
the user's authority, and its source evidence revision-bound. Prefer explicit
invocation when a skill changes normal task flow or imposes an architectural
lens.

Projection scripts may link or copy repository truth. Only `scripts/update` may
fetch and fast-forward this repository's clean local trunk under its update lock.
They do not stage changes, commit, push, or silently mutate unrelated state.

## Proof

Run the narrow proof for the surface you changed:

```sh
scripts/test-link
scripts/test-update
scripts/test-sync
```

Changes to prose still require editorial review of meaning and links. Changes to
skills require discovery and trigger checks. A wording diff is not proof of a
behavioral policy change.
