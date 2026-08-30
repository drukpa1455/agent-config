# Agent Config

This repository owns the shared policy and portable skills installed into Pi
and Codex. Read `README.md` before changing either surface.

## Ownership

- `global/AGENTS.md` owns always-loaded behavior.
- `skills/<name>/SKILL.md` owns one on-demand capability; references and scripts
  stay inside that package.
- `scripts/link` owns local projection into `~/.agents`, `~/.pi`, `~/.codex`, and
  `~/.claude`. `scripts/test-link` proves that projection against a throwaway home.
- `scripts/work` owns this repository's task lifecycle. It delegates isolation to
  the shared fallback and refreshes the landed projection before cleanup.
  `scripts/test-work` proves that order against isolated commands.
- `scripts/update` is the sole owner of lock-serialized, fast-forward refresh of
  the clean local trunk and its links. `scripts/test-update` proves that lifecycle
  against isolated repositories and a throwaway home.
- `scripts/sync` owns explicit projection into repository roots.
  `scripts/test-sync` proves that projection without touching a real repository.
- Installed links and user-local runtime/profile state are projections, not
  repository truth.

## Change discipline

- Give each policy change one observed failure and one behavioral purpose.
- Keep globally implicit skills rare. Make a capability explicit-only when
  loading it imposes an architectural lens, changes ordinary task flow, or adds
  human gates. Automatic discovery never authorizes effects or bypasses resource
  ownership and the high-impact boundary.
- Test prompt behavior with pressure cases covering the original failure and
  protected safety contexts; do not validate wording alone.
- Preserve cross-harness invocation metadata when adding or renaming a skill.
- Do not add hooks, background services, telemetry, automatic model selection,
  or session state to enforce prose policy.

## Verification

For changed Markdown or YAML, run Prettier and markdownlint with the repository's
existing line-length exception. Validate local links, skill discovery, and the
exact changed-path scope. Changes to `scripts/link`, `scripts/work`,
`scripts/update`, or `scripts/sync` require their isolated projection tests before
applying them to a real home or repository. After an agent-config change lands
and passes fresh-trunk verification, run `scripts/update` from that exact landed
revision.
