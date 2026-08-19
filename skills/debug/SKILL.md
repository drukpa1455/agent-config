---
name: debug
description: Use when asked to diagnose or fix a reproducible defect, or when a required check for the current change fails without an established cause. Do not invoke for read-only inventories, expected red baselines, command misuse, unavailable optional tooling, or already-explained failures.
---

# Debug

Establish cause before changing behavior. Scale the investigation to the
unknown; a known environment or orchestration mistake does not earn a defect
workflow.

## 1. Classify the failure

Before investigating, place the observation in one category:

- **Current defect or unexplained required-check failure:** continue through the
  evidence loop below.
- **Pre-existing failure during read-only work:** preserve the exact command,
  error, revision, and likely owner; do not edit unless the user asks for a fix.
- **Expected red characterization:** use it as baseline evidence, not as a new
  root-cause investigation.
- **Explained command, environment, or orchestration failure:** correct the
  command or isolate the environment when required, then rerun the check. Do
  not invent a product defect.
- **Unrelated failure:** establish that it is unrelated, report it, and keep it
  outside the current change.

If the category is unclear and affects the requested outcome, gather the
smallest evidence needed to classify it.

## 2. Pin the observation

Record:

- repository and exact revision;
- exact command or interaction;
- expected and actual behavior;
- complete relevant error text;
- execution context, including concurrency when it may matter.

Reproduce at the narrowest stable seam. For intermittent behavior, remove
competing writers, parallel builds, shared profiles, caches, or timing
variability one at a time.

## 3. Locate the owning cause

Trace backward from the failure to the first owner that can enforce the broken
invariant. Inspect recent relevant changes and compare one working case with the
failing case. At multi-component boundaries, observe the value entering and
leaving each boundary; add temporary diagnostics only when existing evidence
cannot localize the break.

Do not treat correlation, a changed file, or a plausible explanation as cause.

## 4. Falsify one hypothesis

State one concrete hypothesis and why the evidence supports it. Run the
smallest test that could disprove it. Change one variable at a time.

If falsified, return to the owning boundary with the new evidence. When repeated
falsification undermines the causal model, revisit the boundary and assumptions
before trying another fix. Ask the user only when the next path changes approved
scope or contracts.

## 5. Fix the source

For a behavior change, add the narrowest failing regression or characterization
before the fix when practical. Implement one root-cause correction inside the
approved scope. Do not bundle unrelated cleanup, broad defensive layers, or a
second speculative fix.

Read-only diagnosis ends with the evidence-backed cause and smallest next
owner; it never crosses into editing by implication.

## 6. Verify the outcome

Freshly rerun:

1. the original reproduction;
2. the focused affected checks;
3. any broader contract check justified by the changed boundary.

Report exact passes, remaining failures, and current revision. A passing rerun
proves only what that command covers. An unexplained failure returns to the
evidence loop. Stop for unknown external-write success, unavailable required
evidence or authority, or evidence that changes approved scope or contracts.
