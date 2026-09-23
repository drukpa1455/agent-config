# Contributing

Make one thing clearly better.

If the change needs a long argument to establish its value, it is probably not
ready. Keep the change focused on its intended outcome.

## Before a pull request

- Read `README.md`, `AGENTS.md`, and the owning source.
- Explain the observed failure or missing capability.
- Separate prerequisite refactors only when necessary and independently useful.
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

Projection scripts may link repository truth. `scripts/update` and the task
lifecycle may fast-forward clean local trunk under their shared locks. They
do not stage changes, commit, push, or silently mutate unrelated state.

## Proof

Choose proof for the changed behavior. Run script tests only when their owned
behavior changes. For prose, review meaning and affected links; for skill
metadata or path changes, also check discovery and triggers. Review policy
wording against the observed failure and a relevant safety scenario without
creating a test harness for the wording.
