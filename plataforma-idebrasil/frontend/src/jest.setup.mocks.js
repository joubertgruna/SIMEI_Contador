// Jest setup file that runs before modules are loaded. When TEST_MUI_MOCKS=true
// it replaces @mui/material with simple passthrough components to avoid
// importing MUI's styled engine in CI environments that can't handle it.
if (process.env.TEST_MUI_MOCKS === 'true') {
  // Create mocks inside the jest.mock factory so we don't reference out-of-
  // scope variables (Jest forbids that).

  jest.mock('@mui/material', () => {
    const React = require('react');

    const makeComponent = (name) => {
      const Comp = (props) => React.createElement('div', Object.assign({}, props, { 'data-mock-component': name }), props.children);
      Comp.displayName = name;
      return Comp;
    };

    const handler = {
      get(target, prop) {
        if (prop === '__esModule') return true;
        if (!target[prop]) {
          target[prop] = makeComponent(String(prop));
        }
        return target[prop];
      },
    };

    return new Proxy({}, handler);
  });

  // Some modules are imported directly by path — mock them individually.
  jest.mock('@mui/material/Unstable_TrapFocus', () => {
    const React = require('react');
    const Comp = (props) => React.createElement('div', { 'data-mock-component': 'Unstable_TrapFocus' }, props.children);
    Comp.displayName = 'Unstable_TrapFocus';
    return Comp;
  });

  jest.mock('@mui/material/Portal', () => {
    const React = require('react');
    const Comp = (props) => React.createElement('div', { 'data-mock-component': 'Portal' }, props.children);
    Comp.displayName = 'Portal';
    return Comp;
  });
}
