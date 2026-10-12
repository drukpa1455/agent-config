# Agent Config

Read `README.md` before changing this repository.

- `global/AGENTS.md` owns the optional shared working agreement.
- `skills/<name>/` owns one self-contained, on-demand capability.
- `references/voice.md` is optional editorial material.
- `scripts/link` owns explicit component installation and removal.
- `scripts/work` owns optional worktree creation and merged-task cleanup.
- `scripts/update` owns guarded, fast-forward checkout updates.

Keep personal preferences distinct from generic coding advice. Add instructions
when they convey useful context or address a concrete failure; avoid turning a
local incident into a universal workflow. Preserve skill invocation metadata and
keep each package's references inside it. Installed links are projections, not
source files.

For prose, review meaning, triggers, and affected links. For changes to `link`,
`work`, or `update`, run the corresponding `scripts/test-<name>` in isolation.
`scripts/test-browse` checks the browser adapter. Do not create tests that merely
assert instruction wording.

Installation is a separate user choice. Repository updates and task cleanup must
never invoke the linker or install configuration. Do not add background services,
hooks, telemetry, or session state to enforce prose.
