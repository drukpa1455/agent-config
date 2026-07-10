# Agent Config

Shared global policy and portable skills for coding agents.

## Layout

```text
global/AGENTS.md             always-loaded working policy
skills/persistent-browser/   on-demand browser capability
```

Project-level `AGENTS.md` files remain authoritative for project-specific rules and layer after the shared global policy.

## Use the shared configuration

Clone once, then point supported harnesses at the checkout:

```sh
git clone https://github.com/drukpa1455/agent-config.git ~/src/agent-config
mkdir -p ~/.agents ~/.pi/agent ~/.codex
ln -s ~/src/agent-config/skills ~/.agents/skills
ln -s ~/src/agent-config/global/AGENTS.md ~/.pi/agent/AGENTS.md
ln -s ~/src/agent-config/global/AGENTS.md ~/.codex/AGENTS.md
```

The commands fail rather than overwrite existing configuration. Pi and Codex both read the same files. Run `/reload` in Pi after changes; start a new Codex session to reload global policy.

Update explicitly after review:

```sh
git -C ~/src/agent-config pull --ff-only
```

Unattended pulls are intentionally excluded because skills and global instructions can execute policy and code.

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
