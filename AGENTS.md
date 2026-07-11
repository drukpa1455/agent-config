# Agent Config

This repository owns the shared policy and portable skills installed into Pi
and Codex. Read `README.md` before changing either surface.

## Ownership

- `global/AGENTS.md` owns always-loaded behavior.
- `skills/<name>/SKILL.md` owns one on-demand capability; references and scripts
  stay inside that package.
- `scripts/link` owns local projection into `~/.agents`, `~/.pi`, and `~/.codex`.
- Installed links and user-local runtime/profile state are projections, not
  repository truth.

## Change discipline

- Give each policy change one observed failure and one behavioral purpose.
- Keep globally implicit skills rare. A capability that writes, controls shared
  state, imposes an architectural lens, or adds human gates is explicit-only in
  both Pi and Codex.
- Test prompt behavior with pressure cases covering the original failure and
  protected safety contexts; do not validate wording alone.
- Preserve cross-harness invocation metadata when adding or renaming a skill.
- Do not add hooks, background services, telemetry, automatic model selection,
  or session state to enforce prose policy.

## Verification

For changed Markdown or YAML, run Prettier and markdownlint with the repository's
existing line-length exception. Validate local links, skill discovery, and the
exact changed-path scope. Changes to `scripts/link` also require isolated-home
idempotence, unmanaged-entry refusal, and preservation tests before applying it
locally.
