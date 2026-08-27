---
name: gws
description: Use for Gmail, Google Calendar, Drive, Docs, Sheets, Forms, Chat, Meet, Contacts, Tasks, Classroom, Keep, Apps Script, or Google Workspace administration. Route the task through the installed Google Workspace CLI and its live schema.
---

# Google Workspace

Use `gws` as the canonical Google Workspace interface. Do not substitute a
browser, start a separate agent session, or copy a generated API catalog.

## Route

Confirm the local capability with `command -v gws`, then inspect the active
identity with `gws auth status`. If the CLI or required authorization is absent,
report that exact requirement; never inspect, print, export, or store credentials
or tokens.

Prefer the CLI's semantic `+` helpers. Discover them with `gws <service> --help`
and inspect a helper with `gws <service> <helper> --help`. For an operation with
no helper, inspect the live contract before acting:

```sh
gws schema <service.resource.method>
```

Pass raw query parameters through `--params` and request bodies through `--json`.
Bound pagination with `--page-limit`; do not fetch an entire mailbox or drive
when a narrower query answers the request.

## Preserve intent

Let the user's verb determine the effect:

- read, find, list, summarize, or inspect: do not mutate;
- draft or compose: save a draft, such as `gws gmail +send --draft`;
- send, reply, reply-all, or forward: use the matching helper and send only when
  that effect is explicit;
- create, update, share, move, archive, or delete: mutate only the named target.

Resolve the active account, target, content, recipients, and attachments before
an external effect. Use `--dry-run` when supported and request construction is
uncertain or the operation is destructive. Inspect unknown success before
retrying. Follow the governing high-impact boundary for confirmation.
