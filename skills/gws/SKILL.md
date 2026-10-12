---
name: gws
description: Use the Google Workspace CLI when gws is requested or provides a needed Workspace capability. Prefer a suitable existing authorized connector when no interface is specified.
---

# Google Workspace CLI

Check availability with `command -v gws` and the active account with
`gws auth status`. Use existing authorization; do not expose or copy credentials.
If another suitable authorized interface can do the work, no second login is
needed solely for this skill.

Discover semantic `+` helpers through `gws <service> --help` and inspect the
chosen helper's help. For raw API operations, read the live contract with
`gws schema <service.resource.method>`. Pass query parameters through `--params`
and bodies through `--json`; bound pagination with `--page-limit`.

Match the requested effect: queries read, drafts remain drafts, and sending
requires an explicit send request. For Gmail, `gws gmail +send --draft` saves
without sending. Resolve the account, target, recipients,
content, and attachments before an external change. Use a supported `--dry-run`
when request construction is uncertain. Inspect an uncertain result before
retrying an action that could duplicate a send or mutation.
