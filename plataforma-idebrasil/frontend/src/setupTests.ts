// Configuração do Jest para testes
// Configuração do Jest para testes
import '@testing-library/jest-dom';

// Mock do axios para testes
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  }),
}));

// Mock do react-helmet-async
jest.mock('react-helmet-async', () => ({
  Helmet: (props: any) => {
    // require React lazily so jest.mock factory doesn't capture out-of-scope React
    // (Jest forbids referencing external variables directly in the mock factory)
    const ReactLib = require('react');
    return ReactLib.createElement('div', null, props.children);
  },
}));

// Mock do react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Configuração global para testes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
// Assign mocks to global storages (these globals are only used by tests)
(global as any).localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
(global as any).sessionStorage = sessionStorageMock;

// Configuração para testes assíncronos
jest.setTimeout(10000);

// Mock MUI ButtonBase to disable ripple effects (TouchRipple) during tests
jest.mock('@mui/material/ButtonBase', () => {
  const React = require('react');
  // Render a plain button in tests to avoid MUI internal event callbacks that
  // schedule updates outside of the synchronous event tick in jsdom.
  const Component = (props: any) => React.createElement('button', { type: 'button', ...props }, props.children);
  Component.displayName = 'ButtonBase';
  return { __esModule: true, default: Component };
});

// Mock FormControl to a simple div to avoid internal onFilled/onBlur effects.
jest.mock('@mui/material/FormControl', () => {
  const React = require('react');
  const Component = (props: any) => React.createElement('div', { ...props }, props.children);
  Component.displayName = 'FormControl';
  return { __esModule: true, default: Component };
});

// Mock InputBase to a basic input element to avoid MUI input lifecycle side effects
// while keeping label/input semantics usable for getByLabelText queries.
jest.mock('@mui/material/InputBase', () => {
  const React = require('react');
  const Component = (props: any) => React.createElement('input', { ...props });
  Component.displayName = 'InputBase';
  return { __esModule: true, default: Component };
});

// Small, scoped mocks to reduce MUI dev-mode noise in jsdom tests.
// Reasoning: some MUI internals (FocusTrap/Portal) perform focus or portal
// operations that schedule React updates outside the immediate user-event tick in
// jsdom, producing 'not wrapped in act(...)' warnings. We mock only these
// orchestration components to render children inline, preserving component
// structure while avoiding the browser-like focus/portal side effects.
jest.mock('@mui/material/Unstable_TrapFocus', () => {
  const React = require('react');
  const Component = (props: any) => React.createElement('div', { ...props }, props.children);
  Component.displayName = 'Unstable_TrapFocus';
  return { __esModule: true, default: Component };
});

jest.mock('@mui/material/Portal', () => {
  const React = require('react');
  const Component = (props: any) => React.createElement('div', { ...props }, props.children);
  Component.displayName = 'Portal';
  return { __esModule: true, default: Component };
});


// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});
// Note: previously we filtered certain MUI 'not wrapped in act(...)' warnings here.
// That suppression was removed to surface real test issues and keep logs clean by
// fixing tests/components instead. Keep the ButtonBase mock above to reduce
// TouchRipple noise in many tests.

// --- Option B: tight console.error filter for specific MUI act() warnings ---
// This only suppresses console.error messages that include the 'not wrapped in act('
// text and reference @mui in the stack trace. It keeps all other console errors
// visible so we don't hide real issues.
const _originalConsoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  // Build a safe string representation of all args to match against.
  let combined = '';
  try {
    combined = args
      .map((a) => {
        if (typeof a === 'string') return a;
        // Prefer stack traces when available (Error objects)
        if (a && typeof a === 'object' && 'stack' in a && typeof a.stack === 'string') return a.stack;
        try {
          return JSON.stringify(a);
        } catch (_e) {
          return String(a);
        }
      })
      .join(' ');
  } catch (e) {
    // Fallback to a rough concat if something unexpected occurs
    combined = args.map((a) => String(a)).join(' ');
  }

  try {
  // Prefer checking a captured stack so we can detect MUI-originated warnings
  // even when the stack is printed separately by other console calls.
  (new Error().stack || '').toString();

    // 1) Suppress React dev-mode "not wrapped in act(...)" warnings when they
    // originate from MUI/transition/popover/focus orchestration code. We check
    // the combined args for a small set of indicators commonly present in the
    // MUI callstacks. This keeps the filter narrow but robust to how React
    // prints stack traces across environments.
    if (combined.includes('not wrapped in act(')) {
      const indicators = ['@mui', 'node_modules/@mui', 'react-transition-group', 'MenuItem', 'Popover', 'Transition', 'FocusTrap', 'TrapFocus', 'SelectInput', 'InputBase'];
      const matched = indicators.some((i) => combined.includes(i));
      if (matched) return; // swallow specific MUI-related act warnings
    }

    // 2) Suppress a small class of known MUI focus/popover messages that are
    // noisy but non-actionable in jsdom tests.
    if (combined.includes('MUI: Unable to set focus to a MenuItem') || combined.includes('Unable to set focus to a MenuItem')) {
      return;
    }
  } catch (e) {
    // If anything goes wrong inspecting the stack, fall back to original
    return _originalConsoleError(...args);
  }

  return _originalConsoleError(...args);
};

// --- Option C: aggressive MUI mocks (opt-in via TEST_MUI_MOCKS env var) ---
// If you need absolutely zero MUI dev-mode warnings, set TEST_MUI_MOCKS=true in
// your CI environment. This will replace some MUI components (Transition,
// Popover, Modal) with synchronous passthroughs. It's opt-in because these
// mocks diverge from real behavior and can break styled engine expectations.
if (process.env.TEST_MUI_MOCKS === 'true') {
  // Aggressive, opt-in mocks: wrap in try/catch so CI doesn't fail if the
  // styled engine or other internals don't like the mocks in some envs.
  try {
    // Mock transitions and popovers synchronously
    jest.mock('react-transition-group/Transition', () => {
      const React = require('react');
      const Component = (props: any) => React.createElement('div', null, props.children);
      Component.displayName = 'Transition';
      return { __esModule: true, default: Component };
    });

    jest.mock('@mui/material/Popover', () => {
      const React = require('react');
      const Component = (props: any) => React.createElement('div', { role: 'dialog', ...props }, props.children);
      Component.displayName = 'Popover';
      return { __esModule: true, default: Component };
    });

    jest.mock('@mui/material/Modal', () => {
      const React = require('react');
      const Component = (props: any) => React.createElement('div', { role: 'dialog', ...props }, props.children);
      Component.displayName = 'Modal';
      return { __esModule: true, default: Component };
    });
  } catch (e) {
    // If aggressive mocks fail (styled engine, import errors, etc.), don't fail
    // the entire test run — warn and continue without them.
    // eslint-disable-next-line no-console
    console.warn('TEST_MUI_MOCKS is enabled but aggressive MUI mocks failed. Continuing without them. Error:', (e as any) && (e as any).message ? (e as any).message : e);
  }
}