# Agent Config

Shared global policy and portable skills for coding agents.

## Layout

```text
AGENTS.md                    repository-local change contract
global/AGENTS.md             always-loaded working policy
scripts/link                 idempotent local linker
skills/curated-wiki/         schema-driven knowledge curation
skills/genius/               source-backed engineering lenses
skills/implementation/      grounded planning and delivery
skills/persistent-browser/   on-demand browser capability
skills/systematic-debugging/  evidence-first root-cause diagnosis
```

Project-level `AGENTS.md` files remain authoritative for project-specific rules and layer after the shared global policy.

## Use the shared configuration

Clone once, then link the shared files:

```sh
git clone https://github.com/drukpa1455/agent-config.git ~/src/agent-config
~/src/agent-config/scripts/link
```

The linker creates a real `~/.agents/skills/` directory and links every owned
skill into it. It removes stale links to skills deleted from this checkout and
refuses unmanaged entries, so globally active prompt content remains versioned
and reviewable. Install project-specific or third-party skills in their owning
repository instead of the global directory.

Pi and Codex both read the same skills and global policy. Run `/reload` in Pi after changes; start a new Codex session to reload them.

Update explicitly after review:

```sh
git -C ~/src/agent-config pull --ff-only
```

Unattended pulls are intentionally excluded because skills and global instructions can execute policy and code.

## Curated wiki

`curated-wiki` queries and maintains a user-owned Markdown wiki without imposing a storage layout or note format. The target repository's `AGENTS.md` remains its schema; the skill supplies cross-context discovery, side-effect boundaries, and query, curation, and lint flows.

The design follows the persistent, compounding [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) while keeping each wiki's operating contract local.

Set `KNOWLEDGE_BASE_PATH` when the wiki should be available outside its own checkout, or provide its path in the request.

```sh
npx skills add drukpa1455/agent-config --skill curated-wiki
```

See [`skills/curated-wiki/SKILL.md`](skills/curated-wiki/SKILL.md).

## Genius

`genius` carries two deeply studied, revision-bound lenses: Tinygrad with George
Hotz and contributors, and MQuickJS with Fabrice Bellard, Charlie Gordon, and
contributors. Its main skill file directly includes both decision cards and
their highest-value principles; reference profiles retain detailed source paths,
limitations, history, and reproducible worked traces.

The skill studies project mechanics rather than simulating personalities. It
pins source evidence, preserves collaborators, separates observation from
inference, honors a named lens or otherwise chooses from target pressure, and
states where each analogy breaks. Future profiles are added one primary-source study at a time.

```sh
npx skills add drukpa1455/agent-config --skill genius
```

The skill is explicit-only. Use `/skill:genius <problem-or-design-question>`.
See [`skills/genius/SKILL.md`](skills/genius/SKILL.md).

## Implementation

`implementation` grounds and delivers repository work in one flow: intent and
live truth, decisions, order, work, and proof. It accepts a specification,
existing plan, issue, findings block, epic, or stage.

Repository sources own current behavior, active plans own unresolved decisions
and intended order, Git and merged pull requests own completed delivery history,
GitHub owns live delivery state, and retained evidence owns proof. Durable plan
content moves to its canonical owner as work lands; completed execution detail is
retired. Diagrams are projections. A plan- or map-only request stops after that
output; otherwise one coherent outcome stays one change, while real dependency
or evidence boundaries become stages. A bounded polish pass converges duplicated
semantics in the touched surface without expanding into unrelated cleanup.

Review the public [skills.sh listing](https://skills.sh/drukpa1455/agent-config/implementation)
or install directly:

```sh
npx skills add drukpa1455/agent-config --skill implementation
```

Use `/skill:implementation <goal-or-artifact>`. See
[`skills/implementation/SKILL.md`](skills/implementation/SKILL.md).

## Systematic debugging

`systematic-debugging` applies a proportional evidence loop to reproducible defects and unexplained required-check failures. It classifies expected baselines, read-only findings, command mistakes, and explained environment failures without turning each one into an implementation workflow.

```sh
npx skills add drukpa1455/agent-config --skill systematic-debugging
```

See [`skills/systematic-debugging/SKILL.md`](skills/systematic-debugging/SKILL.md).

## Persistent browser

`persistent-browser` explicitly controls two visible browser profiles through one local dashboard:

- official Playwright for compatibility, diagnostics, and security-sensitive work
- Patchright for authorized social-media workflows

The skill preserves native browser identity. Its fixed profiles are
single-owner resources and may not be driven by concurrent agents. It does not
rotate fingerprints, proxies, profiles, or accounts, and must not be used to
bypass CAPTCHA, access controls, account limits, or site policy.

Install only this skill through the cross-harness Skills CLI:

```sh
npx skills add drukpa1455/agent-config --skill persistent-browser
```

The first browser run requires Node.js 20+, npm, stable Google Chrome, and the skill's explicit setup step. Setup installs pinned npm dependencies and Chrome for Testing into local user storage; it never stores profiles or credentials in Git.

See [`skills/persistent-browser/SKILL.md`](skills/persistent-browser/SKILL.md).

## License

MIT
