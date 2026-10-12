---
name: gws
description: Operate Google Workspace through the gws CLI when that interface is requested or selected for a needed capability.
---

# Google Workspace CLI

Honor the requested interface; otherwise prefer a suitable existing authorized
connector. When using the CLI, check availability with `command -v gws` and
resolve an unknown active account with `gws auth status`. Reuse established
authorization and keep credentials private. If authentication needs the user's
participation, explain the specific missing step.

Discover semantic `+` helpers through `gws <service> --help` and inspect the
chosen helper's help. For raw API operations, read the live contract with
`gws schema <service.resource.method>`. Pass query parameters through `--params`
and bodies through `--json`; use focused queries and bound pagination with
`--page-limit`.

Match the authorized effect: queries read, drafts remain drafts, and sending
requires an explicit send request. For Gmail, `gws gmail +send --draft` saves
without sending. Resolve the account, target, recipients, content, and
attachments before an external change. Use a supported `--dry-run` when request
construction is uncertain. Inspect an uncertain result before retrying an action
that could duplicate a send or mutation.
