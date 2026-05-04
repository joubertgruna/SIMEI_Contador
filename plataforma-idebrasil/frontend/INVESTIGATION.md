# Investigation: Minimizing MUI dev-mode warnings in tests

Goal
----
Find the minimal, safe set of mocks or test adjustments that silence React dev-mode "not wrapped in act(...)" warnings originating from MUI internals without breaking Emotion/styled engine.

Plan (iterative)
-----------------
1. Reproduce: ensure we can reproduce warnings locally with `TEST_MUI_MOCKS=false` (we already have a failing noisy run captured).
2. Baseline: current safe mocks in `src/setupTests.ts` (ButtonBase, FormControl, InputBase, Portal, TrapFocus) remain.
3. Iteration 1: try mocking `Transition` only (shallow, return children) and run tests.
4. Iteration 2: if warnings persist, add `Popover` mock and re-test.
5. Iteration 3: if still noisy, add `Modal` mock or consider mocking `Menu` internals carefully.
6. At each step: run full test suite, run `npm run build`, and verify no emotion errors.

Notes
-----
- Avoid replacing emotion/styled engine internals — mocks that remove required style metadata will break MUI components (we saw this with broader mocks).
- Prefer small, local mocks that return native DOM elements (e.g., `div`, `span`) but preserve className/props forwarding.

Iteration log

Iteration 1 results
-------------------
I added a narrow mock for `react-transition-group/Transition` (renders children synchronously) and ran the CI helper locally.

Outcome:
- Quiet run (`TEST_MUI_MOCKS=true`) still fails with an emotion styled-engine error (same as before).
- Fallback run (without `TEST_MUI_MOCKS`) failed two tests that rely on selecting "Comércio" options. The Transition mock appears to alter the timing/behavior of select/combobox updates so the expected option text isn't rendered during the test.

Decision:
- Reverted the Transition mock to restore existing test behavior. Iteration 1 did not provide a safe improvement—mocking Transition synchronously broke select/option rendering in tests.

Next steps:
- Iteration 2: try a narrow `@mui/material/Popover` mock (guarded and only applied when `TEST_MUI_MOCKS` is not enabled) or instead add targeted `waitFor`/`findBy` improvements in the failing tests to stabilize async updates without mocking.

Iteration 2 results
-------------------
I attempted a guarded Popover mock (inline div role=dialog) and ran the CI helper.

Outcome:
- Both the quiet run (`TEST_MUI_MOCKS=true`) and the fallback run failed with the same emotion styled-engine error. The Popover mock did not help and also broke or prevented test execution.

Decision:
- Reverted the Popover mock. Mocking Popover inline appears to interfere with styling metadata or MUI internals in a way that the styled engine does not like in this environment.

Next steps:
- Iteration 3: instead of more mocks, try targeted test stabilizations for the failing `EmpresaCadastro.test.tsx` (use `findBy*`, `waitFor`, and ensure service mocks resolve before assertions). This is likely the safer path forward.



How I'll proceed
-----------------
I'll edit `src/setupTests.ts` in small steps. After each change I'll run the CI helper script locally (it already captures the two-run flow). If a change silences the warnings without breaking emotion, I'll keep it and write a short note here.
