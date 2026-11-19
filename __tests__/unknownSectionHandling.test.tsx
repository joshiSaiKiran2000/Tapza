import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../src/theme';
import { DynamicSectionRenderer } from '../src/components/home/DynamicSectionRenderer';
import { HomeSection } from '../src/config/types';

describe('Unknown Section Handling', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NavigationContainer>
      <ThemeProvider>{children}</ThemeProvider>
    </NavigationContainer>
  );

  it('safely renders fallback without crashing when encountering an unsupported section type', async () => {
    const unknownSection = {
      id: 'sec-telehealth-experimental',
      type: 'telehealth_live_queue' as any,
      background: { type: 'solid' as const, color: '#FFFFFF' },
      data: { queueLength: 5 },
    };

    // Should not throw or crash
    const renderCall = async () => {
      return render(
        <DynamicSectionRenderer section={unknownSection as unknown as HomeSection} />,
        { wrapper }
      );
    };

    await expect(renderCall()).resolves.toBeDefined();
  });
});
