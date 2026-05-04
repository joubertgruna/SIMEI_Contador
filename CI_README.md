````markdown
CI behavior for frontend tests

This repository's CI attempts a quiet test run first (to reduce MUI dev-mode noise) and
falls back to a normal test run if that fails.

What it does:
1. Run `npm test` with `TEST_MUI_MOCKS=true` (opt-in aggressive mocks in `src/setupTests.ts`).
2. If that run fails (e.g. styled-engine/import issues), the script retries without TEST_MUI_MOCKS.

Tradeoffs:
- TEST_MUI_MOCKS=true: much quieter logs, but mocks can diverge from real MUI behavior and may
  trigger styling/import/runtime errors in some environments.
- No TEST_MUI_MOCKS: preserves real behavior and avoids styled-engine issues, but logs can be
  noisier due to MUI dev-mode warnings.

How to run locally:

```bash
# safe run (what CI will do if mocks fail)
CI=true npm test -- --watchAll=false

# force quiet run with mocks
TEST_MUI_MOCKS=true CI=true npm test -- --watchAll=false
```

Notes about deprecation warnings in CI
------------------------------------

The CI pipeline sets the environment variable `NODE_OPTIONS=--no-deprecation` to
avoid noisy Node.js deprecation logs that originate from transient third-party
dependencies (for example, some older transport libraries). This is a temporary,
pragmatic choice to keep CI logs concise while we plan and perform upgrades to
the dependency tree that eliminate those warnings at the source.

If you'd prefer not to hide deprecation warnings, remove `--no-deprecation` from
the job `env` in `.github/workflows/ci.yml`.

````
