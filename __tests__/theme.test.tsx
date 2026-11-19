import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThemeProvider, useTheme, useThemeController } from '../src/theme';
import { defaultLightTheme } from '../src/theme/tokens';

const ThemeConsumerTestComponent: React.FC = () => {
  const theme = useTheme();
  const { isDark, toggleTheme, setThemeMode, updateRemoteColors } = useThemeController();

  return (
    <View>
      <Text testID="primary-color">{theme.colors.primary}</Text>
      <Text testID="background-color">{theme.colors.background}</Text>
      <Text testID="card-color">{theme.colors.card}</Text>
      <Text testID="text-color">{theme.colors.text}</Text>
      <Text testID="is-dark">{isDark ? 'true' : 'false'}</Text>
      <Text testID="spacing-md">{theme.spacing.md}</Text>
      <Text testID="font-size-md">{theme.typography.fontSize.md}</Text>
      <TouchableOpacity testID="btn-dark" onPress={() => setThemeMode('dark')}>
        <Text>Set Dark</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="btn-toggle" onPress={toggleTheme}>
        <Text>Toggle Theme</Text>
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
    expect(getByTestId('background-color').props.children).toBe(defaultLightTheme.colors.background);
    expect(getByTestId('spacing-md').props.children).toBe(16);
    expect(getByTestId('font-size-md').props.children).toBe(16);
    expect(getByTestId('is-dark').props.children).toBe('false');
  });

    it('allows switching theme mode dynamically and applies dark theme tokens', async () => {
      const { getByTestId } = await render(
        <ThemeProvider>
          <ThemeConsumerTestComponent />
        </ThemeProvider>
      );

      fireEvent.press(getByTestId('btn-dark'));
      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('true');
        expect(getByTestId('background-color').props.children).toBe('#0F172A');
        expect(getByTestId('card-color').props.children).toBe('#1E293B');
        expect(getByTestId('text-color').props.children).toBe('#F8FAFC');
      });
    });

    it('toggles dark mode with toggleTheme', async () => {
      const { getByTestId } = await render(
        <ThemeProvider>
          <ThemeConsumerTestComponent />
        </ThemeProvider>
      );

      // Initial is light
      expect(getByTestId('is-dark').props.children).toBe('false');

      // Toggle to dark
      fireEvent.press(getByTestId('btn-toggle'));
      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('true');
        expect(getByTestId('background-color').props.children).toBe('#0F172A');
      });

      // Toggle back to light
      fireEvent.press(getByTestId('btn-toggle'));
      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('false');
        expect(getByTestId('background-color').props.children).toBe('#F8FAFC');
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
