# Agent Config

`README.md` documents component selection, installation, and repository tools.
Consult the relevant section when changing one of those interfaces.

- `global/AGENTS.md` owns the optional shared working agreement.
- `skills/<name>/` owns one self-contained, on-demand capability.
- `references/voice.md` is optional editorial material.
- `scripts/link` owns explicit component installation and removal.
- `scripts/work` owns optional worktree creation and merged-task cleanup.
- `scripts/update` owns guarded, fast-forward checkout updates.

Keep enduring preferences in the shared agreement, task-specific knowledge in
skills and references, and concrete operational safeguards in scripts. A useful
preference may change a decision even when the agent already knows the concept.
Review the benefit and unwanted work a rule could cause; word count alone does
not establish value. Preserve invocation metadata and keep each skill's resources
inside its package. Installed links are projections, not source files.

For prose, review meaning, triggers, and affected links. For changes to `link`,
`work`, or `update`, run the corresponding `scripts/test-<name>` in isolation.
`scripts/test-browse` checks the browser adapter. Do not create tests that merely
assert instruction wording.

Installation is a separate user choice. Repository updates and task cleanup must
never invoke the linker or install configuration. Do not add background services,
hooks, telemetry, or session state to enforce prose.
