# Agent Config

A small personal working agreement and optional skills for Pi, Codex, and Claude
Code. The aim is less friction: preserve useful preferences and knowledge while
leaving ordinary coding judgment to the agent and project.

## Choose what to use

Nothing is installed by cloning, updating, or finishing work in this repository.
Read the [shared policy](global/AGENTS.md), then choose only useful components.

| Component | Purpose | Invocation |
| --- | --- | --- |
| `policy` | Personal engineering and communication preferences | Loaded by the harness when installed |
| [wiki](skills/wiki/SKILL.md) | Query or curate an owner's Markdown knowledge repository | Matching wiki work |
| [lens](skills/lens/SKILL.md) | Pinned Tinygrad, MQuickJS, and DaoFP design studies | Explicit only |
| [spec](skills/spec/SKILL.md) | Ground a specification in outcomes, decisions, and acceptance criteria | Explicit only |
| [browse](skills/browse/SKILL.md) | Playwright CLI and Patchright session/profile conventions | CLI browser work |
| [gws](skills/gws/SKILL.md) | Google Workspace CLI discovery and operations | Workspace CLI work |

The [writing reference](references/voice.md) is available for substantial editing
when useful. It is neither installed nor requested on every session. Source
studies and worked traces live inside `skills/lens/references/` and are read on
demand. Generic implementation and debugging guides have been retired; their
history remains in Git.

Each skill is self-contained and can also be installed individually, for example
with `npx skills add drukpa1455/agent-config --skill wiki`. `spec` and `lens` retain
explicit invocation metadata for Codex and Claude Code. Use the harness's skill
command when invoking them. A wiki can be located through the request, its own
checkout, or `KNOWLEDGE_BASE_PATH`.

## Install explicitly

The linker requires Python 3.9 or newer. From a stable checkout:

```sh
git clone https://github.com/drukpa1455/agent-config.git ~/src/agent-config
cd ~/src/agent-config
scripts/link --check policy wiki lens
scripts/link policy wiki lens
```

**Each invocation names the complete desired set.** These examples install the
policy and two skills. `scripts/link policy` keeps only the shared policy;
`scripts/link wiki` keeps only the wiki skill. There is no default bundle and no
selection manifest. `--check` previews the same plan without changing files.

Only harnesses available on `PATH` receive links:

| Harness | Global policy | Skills |
| --- | --- | --- |
| Pi | `~/.pi/agent/AGENTS.md` | `~/.agents/skills/` |
| Codex | `~/.codex/AGENTS.md` | `~/.agents/skills/` |
| Claude Code | `~/.claude/CLAUDE.md` | `~/.claude/skills/` |

The linker preserves unrelated entries, including Omarchy's stock skills. It
refuses selected name collisions and checks the full plan before writing. It
removes only this checkout's omitted, retired, or no-longer-applicable links,
including the old shared voice link. Legacy whole-directory skill links become
individual selected links. Re-run with the complete selection after retiring a
skill or removing a harness. If no harness is found, installation refuses to
change anything.

To remove this checkout's managed links explicitly:

```sh
scripts/link --check --none
scripts/link --none
```

Links point directly into the checkout. Editing or updating an already installed
file changes what those links expose; start a new Codex or Claude Code session,
or use `/reload` in Pi, to load it. Updating does not create or reconcile links.

## Repository tools

`scripts/update` fast-forwards a clean primary checkout under shared locks, with
Git hooks disabled. From another worktree it advances only to that worktree's
landed first-parent revision, preserving a newer primary. It refuses dirty,
divergent, non-trunk, or unlanded state. It never runs the linker.

The optional `scripts/work new <task>` and `scripts/work done` manage isolated
GitHub work without loading a coding skill. `new` creates a branch under
`~/.worktrees/<host>/<owner>/<repo>/`; `WORKTREE_ROOT` overrides that root. Run
`done` from that clean task worktree after merging. It verifies the exact merged
head and fresh trunk, checks dependencies, synchronizes primary, and removes the
owned worktree and branch. It never installs configuration or runs updater hooks.
The tools require Git and Python 3.9+; cleanup also requires authenticated `gh`.

## Contributing

[AGENTS.md](AGENTS.md) maps ownership and checks.
[CONTRIBUTING.md](CONTRIBUTING.md) describes the contribution conventions.

MIT licensed.
