# Agent Config

Shared global policy and portable skills for coding agents.

## Layout

```text
global/AGENTS.md             always-loaded working policy
scripts/link                 idempotent local linker
skills/curated-wiki/         schema-driven knowledge curation
skills/epic-loop/            stage-gated epic delivery
skills/implementation-planning/ repository-grounded planning
skills/persistent-browser/   on-demand browser capability
```

Project-level `AGENTS.md` files remain authoritative for project-specific rules and layer after the shared global policy.

## Use the shared configuration

Clone once, then link the shared files:

```sh
git clone https://github.com/drukpa1455/agent-config.git ~/src/agent-config
~/src/agent-config/scripts/link
```

The linker creates a real `~/.agents/skills/` aggregation directory and links each owned skill into it. Existing foreign skill entries are preserved, so reviewed third-party skills can be installed without writing them into this repository. The linker migrates the legacy whole-directory symlink only when it points to this checkout and otherwise refuses conflicting paths.

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

## Implementation planning

`implementation-planning` turns consequential engineering intent into an approved, repository-grounded plan. It verifies current behavior, resolves load-bearing decisions, scales delivery from one issue to genuinely staged work, and names interfaces, evidence, rollback, repair, and resource bounds without pre-writing routine implementation.

The skill is read-only until the exact plan is approved. It does not publish issues or execute work; a stable approved plan hands off explicitly to `epic-loop`.

```sh
npx skills add drukpa1455/agent-config --skill implementation-planning
```

Use `/skill:implementation-planning <intent-or-spec>`. See [`skills/implementation-planning/SKILL.md`](skills/implementation-planning/SKILL.md).

## Epic loop

`epic-loop` turns an approved plan into a native GitHub epic, stage, and implementation sub-issue hierarchy. It prepares each stage against repository and upstream evidence, executes it as an unmerged PR stack, pauses once for the stage merge gate, then verifies the landed stage before the next begins.

The target repository's `AGENTS.md` remains authoritative. The skill adds no labels, tracker setup, database, telemetry, or background service.

```sh
npx skills add drukpa1455/agent-config --skill epic-loop
```

Use `/skill:epic-loop shape <plan>`, `prepare <stage-issue>`, `run <stage-issue>`, or `review <epic-issue>`. See [`skills/epic-loop/SKILL.md`](skills/epic-loop/SKILL.md).

## Persistent browser

`persistent-browser` controls two isolated, visible browser profiles through one local dashboard:

- official Playwright for compatibility, diagnostics, and security-sensitive work
- Patchright for authorized social-media workflows

The skill preserves native browser identity. It does not rotate fingerprints, proxies, profiles, or accounts, and must not be used to bypass CAPTCHA, access controls, account limits, or site policy.

Install only this skill through the cross-harness Skills CLI:

```sh
npx skills add drukpa1455/agent-config --skill persistent-browser
```

The first browser run requires Node.js 20+, npm, stable Google Chrome, and the skill's explicit setup step. Setup installs pinned npm dependencies and Chrome for Testing into local user storage; it never stores profiles or credentials in Git.

See [`skills/persistent-browser/SKILL.md`](skills/persistent-browser/SKILL.md).

## License

MIT
