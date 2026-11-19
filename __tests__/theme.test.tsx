import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThemeProvider, useTheme, useThemeController } from '../src/theme';
import { defaultLightTheme } from '../src/theme/tokens';

const ThemeConsumerTestComponent: React.FC = () => {
  const theme = useTheme();
  const { isDark, setThemeMode, updateRemoteColors } = useThemeController();

  return (
    <View>
      <Text testID="primary-color">{theme.colors.primary}</Text>
      <Text testID="is-dark">{isDark ? 'true' : 'false'}</Text>
      <Text testID="spacing-md">{theme.spacing.md}</Text>
      <Text testID="font-size-md">{theme.typography.fontSize.md}</Text>
      <TouchableOpacity testID="btn-dark" onPress={() => setThemeMode('dark')}>
        <Text>Set Dark</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="btn-remote-color"
        onPress={() => updateRemoteColors({ primary: '#E65100' })}
      >
        <Text>Update Remote Color</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('Theme Architecture', () => {
  it('provides default light theme tokens', async () => {
    const { getByTestId } = await render(
      <ThemeProvider>
        <ThemeConsumerTestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('primary-color').props.children).toBe(defaultLightTheme.colors.primary);
    expect(getByTestId('spacing-md').props.children).toBe(16);
    expect(getByTestId('font-size-md').props.children).toBe(16);
    expect(getByTestId('is-dark').props.children).toBe('false');
  });

  it('allows switching theme mode dynamically', async () => {
    const { getByTestId } = await render(
      <ThemeProvider>
        <ThemeConsumerTestComponent />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('btn-dark'));
    await waitFor(() => {
      expect(getByTestId('is-dark').props.children).toBe('true');
    });
  });

  it('allows updating remote configuration colors at runtime', async () => {
    const { getByTestId } = await render(
      <ThemeProvider>
        <ThemeConsumerTestComponent />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('btn-remote-color'));
    await waitFor(() => {
      expect(getByTestId('primary-color').props.children).toBe('#E65100');
    });
  });
});
