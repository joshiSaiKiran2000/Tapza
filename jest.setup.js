// Set default timeout for tests under load
jest.setTimeout(15000);

// Mock AsyncStorage for Jest
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock lucide-react-native icons for Jest
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        const MockIcon = (props) =>
          React.createElement(View, { testID: `icon-${String(prop)}`, ...props });
        MockIcon.displayName = `MockIcon(${String(prop)})`;
        return MockIcon;
      },
    }
  );
});
