# Agent Config

Shared global policy and portable skills for coding agents.

## Layout

```text
AGENTS.md                    repository-local change contract
global/AGENTS.md             always-loaded working policy
scripts/link                 idempotent local linker
skills/curated-wiki/         schema-driven knowledge curation
skills/converging-semantic-representations/ explicit architecture lens
skills/staged-delivery/      stage-gated change delivery
skills/implementation-planning/ repository-grounded planning
skills/terminal-diagrams/    source-bound terminal projections
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

## Implementation planning

`implementation-planning` turns consequential engineering intent into an approved, repository-grounded plan. It verifies current behavior, resolves load-bearing decisions, scales delivery from one issue to genuinely staged work, and names interfaces, evidence, rollback, repair, and resource bounds without pre-writing routine implementation.

The skill is read-only until the exact plan is approved. Approval changes only
the status line to `Approved` and publishes the named delivery path. One-unit
plans enter the repository's ordinary workflow; only genuinely staged plans
hand off explicitly to `staged-delivery`.

```sh
npx skills add drukpa1455/agent-config --skill implementation-planning
```

Use `/skill:implementation-planning <intent-or-spec>`. See [`skills/implementation-planning/SKILL.md`](skills/implementation-planning/SKILL.md).

## Terminal diagrams

`terminal-diagrams` projects pinned plans, repository architecture, protocols,
state machines, and live GitHub delivery graphs into concise, topology-first
plain-ASCII views. It is user-invoked and read-only: source prose, code, GitHub
state, and manifests remain authoritative. The skill returns `SOURCE_GAP`
instead of inventing a relationship or silently resolving a contradiction.

```sh
npx skills add drukpa1455/agent-config --skill terminal-diagrams
```

Use `/skill:terminal-diagrams <source>@<revision> [question-or-scope]`. For
live GitHub state, `@live` requests a fresh observation that the skill hashes
before rendering. See [`skills/terminal-diagrams/SKILL.md`](skills/terminal-diagrams/SKILL.md).

## Staged delivery

`staged-delivery` turns an approved multi-stage plan into a native epic, stage,
and implementation hierarchy with unmerged PR stacks, human merge gates, and
landed verification. One-unit plans never enter this workflow.

The target repository's `AGENTS.md` remains authoritative. The skill adds no labels, tracker setup, database, telemetry, or background service.

```sh
npx skills add drukpa1455/agent-config --skill staged-delivery
```

Use `/skill:staged-delivery shape <plan>`, `prepare <stage-issue>`, `run <stage-issue>`, or `review <epic-issue>`. See [`skills/staged-delivery/SKILL.md`](skills/staged-delivery/SKILL.md).

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
