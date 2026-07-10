# Agent Skills

Portable skills for shell-capable coding agents.

## Persistent browser

`persistent-browser` controls two isolated, visible browser profiles through one local dashboard:

- official Playwright for compatibility, diagnostics, and security-sensitive work
- Patchright for authorized social-media workflows

The skill preserves native browser identity. It does not rotate fingerprints, proxies, profiles, or accounts, and must not be used to bypass CAPTCHA, access controls, account limits, or site policy.

### Install

```sh
npx skills add drukpa1455/agent-skills --skill persistent-browser
```

The first browser run requires Node.js 20+, npm, stable Google Chrome, and the skill's explicit setup step. Setup installs pinned npm dependencies and Chrome for Testing into local user storage; it never stores profiles or credentials in Git.

See [`skills/persistent-browser/SKILL.md`](skills/persistent-browser/SKILL.md).

## License

MIT
