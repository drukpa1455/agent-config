# Patchright

Patchright is the default for user-authorized social-media work and an explicit alternate elsewhere. Never use it to bypass CAPTCHA, account limits, access controls, or site policy.

## Invariants

- Command: `$SKILL_DIR/scripts/patchright`
- Profile: isolated from official Playwright
- Dashboard: `$SKILL_DIR/scripts/dashboard`
- Apply every boundary in the parent skill.
- Never share, copy, or concurrently open another engine's profile.
- Never attach official Playwright to this browser over CDP; that defeats Patchright's execution-context protections.
- Keep one stable native identity. Do not rotate or spoof fingerprints, user agents, proxies, locale, geolocation, or device properties.

## Differences

Patchright lacks `find`, mobile/device opening, and high-resolution screenshots in its assistant CLI. Use bounded partial snapshots instead of `find`.

Console events are disabled. Evaluation defaults to Patchright's isolated world. Keep returned values small: broad page extraction can stall patched serialization. If the daemon stops responding, restart it once rather than retrying. Routing, service workers, bindings, tracing, screenshots, and WebAuthn can differ from upstream Playwright.

Patchright may intercept HTML and modify Content Security Policy to inject initialization scripts. Do not use it to validate CSP, security headers, exact response bytes, console behavior, or service-worker behavior. Reproduce suspicious behavior with official Playwright rather than adding retries or workarounds.

Monitor through the Patchright session daemon in the shared dashboard. Do not expose or attach to a remote-debugging endpoint.
