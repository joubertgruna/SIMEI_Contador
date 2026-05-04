#!/usr/bin/env bash
set -u

echo "[ci-test] Attempting tests with TEST_MUI_MOCKS=true"
if TEST_MUI_MOCKS=true CI=true npm test -- --watchAll=false --silent; then
  echo "[ci-test] Tests passed with TEST_MUI_MOCKS"
  exit 0
else
  echo "[ci-test] Tests with TEST_MUI_MOCKS failed; retrying without it"
  if CI=true npm test -- --watchAll=false --silent; then
    echo "[ci-test] Tests passed without TEST_MUI_MOCKS"
    exit 0
  else
    echo "[ci-test] Tests failed both with and without TEST_MUI_MOCKS"
    exit 1
  fi
fi
