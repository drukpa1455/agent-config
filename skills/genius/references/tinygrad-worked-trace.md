# Worked Tinygrad Source Trace

This example demonstrates the method, evidence format, and transfer boundary. It
was reproduced against `tinygrad/tinygrad` commit
`e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b`. Verify it again when the checkout
revision differs; do not preserve the expected output by ignoring changed
source.

## Isolate one path

The question is whether planning should own execution order or the executor
should reconstruct dependencies while running. Use a tiny expression to follow
one complete path without unrelated accelerator details.

The input is realized first so its initial data copy does not obscure the single
computation call under study. With an existing Python 3.11+ interpreter, run
from outside the checkout:

```sh
TINYGRAD_PATH=${TINYGRAD_PATH:-$HOME/src/tinygrad}
PYTHON_BIN=${PYTHON_BIN:-python3} # use an existing Python 3.11+
PYTHONDONTWRITEBYTECODE=1 CACHELEVEL=0 DEVICE=PYTHON \
  PYTHONPATH="$TINYGRAD_PATH" "$PYTHON_BIN" - <<'PY'
from tinygrad import Tensor
from tinygrad.engine.realize import compile_linear, run_linear

inp = Tensor([1, 2, 3]).realize()
out = (inp + 1) * 2
print(out.uop.op.name, out.uop.realized is not None)

linear, var_vals = out.linear_with_vars()
print(linear.op.name, len(linear.src), linear.src[0].src[0].op.name)

compiled = compile_linear(linear)
program = compiled.src[0].src[0]
print(program.op.name, ",".join(x.op.name for x in program.src))
print(out.uop.realized is not None)

run_linear(compiled, var_vals)
print(out.uop.realized is not None, out.tolist())
PY
```

Expected output at the studied revision:

```text
MUL False
LINEAR 1 SINK
PROGRAM SINK,LINEAR,SOURCE,BINARY
False
True [4, 6, 8]
```

Do not install Python or Tinygrad dependencies merely to run this example. If
the available interpreter is incompatible, the source and tests can still
establish the path; report that the runtime trace was not reproduced.

## Follow the evidence

1. Tensor operations converge through `Tensor._apply_uop`, which wraps the new
   UOp without executing it:
   [`tinygrad/tensor.py::Tensor._apply_uop`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/tensor.py#L108-L116).
2. `Tensor.linear_with_vars` lowers a sink into a linear schedule, while
   `Tensor.realize` is the named boundary that passes that schedule to
   `run_linear`:
   [`tinygrad/tensor.py::Tensor.linear_with_vars`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/tensor.py#L178-L195).
3. `create_schedule` constructs dependency edges, topologically orders calls,
   and returns `LINEAR` with that order in `src`:
   [`tinygrad/schedule/__init__.py::create_schedule`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/schedule/__init__.py#L29-L99).
4. `compile_linear` rewrites call payloads into target programs. `run_linear`
   then iterates `linear.src` directly and dispatches each call through
   `pm_exec`:
   [`tinygrad/engine/realize.py::compile_linear,run_linear`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/engine/realize.py#L243-L281).
5. A null-backend test independently proves that creating a schedule does not
   allocate a buffer and running it does:
   [`test/null/test_schedule.py::test_buffer_has_buffer`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/test/null/test_schedule.py#L37-L47).

A reproducible citation names repository, full revision, path, and symbol:

```text
tinygrad/tinygrad@e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b
  tinygrad/engine/realize.py::run_linear
```

Use a commit-pinned link when possible. A bare line number, local absolute path,
or link to a moving branch is not enough. For observed behavior, retain the
command, relevant environment, and output separately from source citations.

## Transfer the invariant

For a target where an executor currently rediscovers a dependency graph while
running, a concise recommendation could be:

- **Recommendation:** make planning emit one ordered execution plan and make the
  executor consume that plan without replanning.
- **Mechanic:** Tinygrad's scheduler owns dependency ordering in `LINEAR`; the
  runtime walks the ordered calls.
- **Invariant:** dependency order has one semantic owner.
- **Target analogue:** the target's own durable plan or manifest, not a renamed
  `UOp` or kernel schedule.
- **Divergence:** an audited service may also require stable plan identity,
  authorization, idempotency, retries, transactional effects, and repair.
- **Consequence:** first test one planner that emits a deterministic plan and one
  executor that never queries dependency edges. Do not add an IR or scheduler
  if direct sequential code already owns the only required order.

The code trace establishes Tinygrad's mechanic. It does not prove that every
target needs the transferred design; the target pressure and divergence decide
that.
