// Small helper to read runtime-injected config (env-config.js) with fallbacks
export function getRuntimeConfig() {
  // window.__RUNTIME_CONFIG__ is injected at container start by env-entrypoint.sh
  // If it's not present, fall back to build-time process.env values.
  const win = typeof window !== 'undefined' ? window : (globalThis as any);
  const runtime = (win as any).__RUNTIME_CONFIG__ || {};

  return {
    // Prefer a relative path so the frontend uses the same origin and nginx can proxy /api -> backend.
    // Fall back to process.env or localhost for local dev.
    REACT_APP_API_URL: runtime.REACT_APP_API_URL || process.env.REACT_APP_API_URL || '/api',
  } as { REACT_APP_API_URL: string };
}

export function getApiUrl() {
  return getRuntimeConfig().REACT_APP_API_URL;
}
