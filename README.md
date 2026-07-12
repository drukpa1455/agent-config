# Agent Config

Shared global policy and portable skills for coding agents.

## Layout

```text
AGENTS.md                    repository-local change contract
global/AGENTS.md             always-loaded working policy
scripts/link                 idempotent local linker
skills/curated-wiki/         schema-driven knowledge curation
skills/converging-semantic-representations/ explicit architecture lens
skills/tinygrad-design/      source-backed Tinygrad design lens
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

## Semantic convergence

`converging-semantic-representations` is an explicit architecture lens for
finding duplicated semantic ownership across compiler and workflow phases. It
does not impose a graph or instruction-stream core on every domain.

Use `/skill:converging-semantic-representations <question>`.

## Tinygrad design

`tinygrad-design` studies a relevant end-to-end path in a current Tinygrad
checkout, then translates the observed mechanic into the target domain without
copying compiler nouns, dense syntax, global state, or hardware-specific
tradeoffs. Its source map covers public sugar, UOps and specs, scheduling,
lowering, realization, adapters, introspection, replay, and clarifying deletion
history.

The skill is an explicit architecture lens. Use
`/skill:tinygrad-design <problem-or-design-question>`.

## Implementation

`implementation` grounds and delivers repository work in one flow: facts,
decisions, order, work, and proof. It accepts an intent, specification, existing
plan, issue, findings block, epic, or stage.

Plans retain design decisions, diagrams project them, and GitHub records
delivery order. A plan- or map-only request stops after that output. Otherwise
one coherent outcome
stays one change, while real dependency or evidence boundaries become stages.

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
