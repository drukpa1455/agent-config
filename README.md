# Agent Config

Shared global policy and portable skills for coding agents.

## Layout

```text
AGENTS.md                    repository-local change contract
global/AGENTS.md             always-loaded working policy
scripts/link                 idempotent local linker
scripts/test-link            projection proof against a throwaway home
scripts/update               guarded local checkout and link refresh
scripts/test-update          update proof against throwaway repositories
scripts/sync                 explicit repository policy projection
scripts/test-sync            projection proof against throwaway repositories
skills/wiki/                 owner-controlled knowledge curation
skills/lens/                 source-backed engineering lenses
skills/spec/                 grounded specifications and delivery graphs
skills/implement/            scoped execution and verification
skills/browse/               portable headed browser control
skills/debug/                 evidence-first root-cause diagnosis
skills/gws/                   Google Workspace CLI routing
```

Project-level `AGENTS.md` files remain authoritative for project-specific rules and layer after the shared global policy.

## Use the shared configuration

Clone once, then link the shared files:

```sh
git clone https://github.com/drukpa1455/agent-config.git ~/src/agent-config
~/src/agent-config/scripts/link
```

The linker creates a real skills directory per harness and links every owned
skill into each. It removes stale links to skills deleted from this checkout and
refuses unmanaged entries, so globally active prompt content remains versioned
and reviewable. Install project-specific or third-party skills in their owning
repository instead of the global directory.

Pi, Codex, and Claude Code read the same skills and the same global policy. Each
reads it under the name its own harness loads:

```text
~/.pi/agent/AGENTS.md    ~/.agents/skills/
~/.codex/AGENTS.md       ~/.claude/skills/
~/.claude/CLAUDE.md
```

Run `/reload` in Pi after changes; start a new Codex or Claude Code session to
reload them.

Update explicitly after review from any worktree:

```sh
scripts/update
```

The updater serializes concurrent calls, requires a clean primary checkout on
the remote's live default branch, fast-forwards it without hooks, and refreshes
all links. From the primary it installs current remote trunk; from another
worktree it advances no farther than that worktree's landed revision. It refuses
dirty, divergent, non-trunk, or unlanded state. Unattended updates remain
excluded because skills and global instructions can execute policy and code.
The command requires Git, Python 3.9 or newer, and standard `tar`.

## Share the policy with a repository

Repositories whose `AGENTS.md` is an exact projection of the global policy can
sync it explicitly:

```sh
~/src/agent-config/scripts/sync ~/src/project-a ~/src/project-b
```

The command writes only `AGENTS.md`. It does not fetch, stage, commit, or push.
Repository-specific acceptance rules belong in `CONTRIBUTING.md` so the shared
policy remains one exact file.

## Wiki

`wiki` enters a user-owned Markdown knowledge repository without imposing a
storage layout or note format. It activates for explicit wiki work and questions
about the owner's accumulated knowledge, not merely because an ordinary task
overlaps a wiki topic. The target repository's `AGENTS.md` remains its schema.

The design follows the persistent, compounding [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) while keeping each wiki's operating contract local.

Set `KNOWLEDGE_BASE_PATH` when the wiki should be available outside its own checkout, or provide its path in the request.

```sh
npx skills add drukpa1455/agent-config --skill wiki
```

See [`skills/wiki/SKILL.md`](skills/wiki/SKILL.md).

## Lens

`lens` carries three deeply studied, revision-bound lenses: Tinygrad with George
Hotz and contributors, MQuickJS with Fabrice Bellard, Charlie Gordon, and
contributors, and DaoFP by Bartosz Milewski. Its small entrypoint selects one
lens from target pressure, then
loads only that profile. The profiles retain decision criteria, mechanics,
source paths, limitations, and optional reproducible worked traces.

The skill studies project mechanics rather than simulating personalities. It
pins source evidence, preserves collaborators, separates observation from
inference, honors a named lens or otherwise chooses from target pressure, and
states where each analogy breaks. Future profiles are added one primary-source study at a time.

```sh
npx skills add drukpa1455/agent-config --skill lens
```

The skill is explicit-only. Use `/skill:lens <problem-or-design-question>`.
See [`skills/lens/SKILL.md`](skills/lens/SKILL.md).

## Specification and implementation

`spec` turns a consequential repository discussion into an executable agreement:
observable behavior, codebase-grounded design, and the smallest useful graph of
stages, issues, and sub-issues. Complex designs and multi-stage epics include
compact ASCII architecture and delivery maps. Later stages retain durable
contracts without false implementation precision and are refined from evidence
after each stage lands. Coverage checks connect every contract to delivery and
proof without creating another status system. The skill stops before
product-code edits.

`implement` consumes a decided issue, stage, epic, spec, plan, findings block, or
brief. It studies relevant prior art, re-grounds each stage against fresh trunk,
uses isolated worktrees, delivers the selected scope through review and merge,
then performs a fresh-trunk stage closeout and removes merged branches and
worktrees. For a full epic it repeats that loop, refining each next stage from
what implementation revealed, and finishes with a cross-stage contract and
architecture audit. Production mutation remains outside the skill's authority.

Install either explicit-only skill directly:

```sh
npx skills add drukpa1455/agent-config --skill spec
npx skills add drukpa1455/agent-config --skill implement
```

Use `/skill:spec <discussion-or-goal>` before implementation, then
`/skill:implement <decided-issue-stage-or-epic>` when the work is ready. See
[`skills/spec/SKILL.md`](skills/spec/SKILL.md) and
[`skills/implement/SKILL.md`](skills/implement/SKILL.md).

## Debug

`debug` applies a proportional evidence loop to reproducible defects and unexplained required-check failures. It classifies expected baselines, read-only findings, command mistakes, and explained environment failures without turning each one into an implementation workflow.

```sh
npx skills add drukpa1455/agent-config --skill debug
```

See [`skills/debug/SKILL.md`](skills/debug/SKILL.md).

## Browse

`browse` provides one canonical headed browser surface across shell-capable
harnesses. Interactive browser automation loads it automatically; harness-native
browsers and Computer Use require explicit user choice. It selects two persistent
profiles behind one live dashboard:

- official Playwright for compatibility, diagnostics, and security-sensitive work
- Patchright for authorized social-media workflows

The skill preserves native browser identity. Its fixed profiles are
single-owner resources and may not be driven by concurrent agents. It does not
rotate fingerprints, proxies, profiles, or accounts, and must not be used to
bypass CAPTCHA, access controls, account limits, or site policy.

Install only this skill through the cross-harness Skills CLI:

```sh
npx skills add drukpa1455/agent-config --skill browse
```

The first browser run requires Node.js 20+, npm, stable Google Chrome, and the
skill's first-run setup. Setup installs pinned npm dependencies and Chrome for
Testing into local user storage; it never stores profiles or credentials in Git.

See [`skills/browse/SKILL.md`](skills/browse/SKILL.md).

## Google Workspace

`gws` routes Gmail, Calendar, Drive, Docs, Sheets, and other Google Workspace
work through the installed Google Workspace CLI. It prefers semantic helpers and
live CLI schemas over copied API catalogs, distinguishes drafts from sends, and
keeps authentication material private.

```sh
npx skills add drukpa1455/agent-config --skill gws
```

See [`skills/gws/SKILL.md`](skills/gws/SKILL.md).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

MIT
