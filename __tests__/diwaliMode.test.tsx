import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../src/theme';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import { DiwaliDecoration } from '../src/components/home/DiwaliDecoration';
import { developerSettingsService } from '../src/services/developerSettings';
import { configService } from '../src/services/configService';

describe('Diwali Mode Toggle and Offer Display', () => {
  beforeEach(async () => {
    // Reset to normal mode before each test
    await developerSettingsService.updateSettings({ activeConfigId: 'normal' });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NavigationContainer>
      <ThemeProvider>{children}</ThemeProvider>
    </NavigationContainer>
  );

  it('renders ProfileScreen with Diwali Mode toggle switch defaulting to OFF (normal)', async () => {
    const { getByText, getByTestId } = await render(
      <ProfileScreen navigation={{} as any} route={{} as any} />,
      { wrapper }
    );

    expect(getByText('Diwali Mode')).toBeTruthy();
    expect(getByText('Off • Normal healthcare offers')).toBeTruthy();
    const diwaliSwitch = getByTestId('diwali-mode-switch');
    expect(diwaliSwitch).toBeTruthy();
    expect(diwaliSwitch.props.value).toBe(false);
  });

  it('toggles Diwali Mode switch ON in ProfileScreen and updates state', async () => {
    const { getByTestId, getByText } = await render(
      <ProfileScreen navigation={{} as any} route={{} as any} />,
      { wrapper }
    );

    const diwaliSwitch = getByTestId('diwali-mode-switch');
    expect(diwaliSwitch.props.value).toBe(false);

    // Turn Diwali Mode ON
    fireEvent(diwaliSwitch, 'valueChange', true);

    await waitFor(() => {
      expect(developerSettingsService.getSettings().activeConfigId).toBe('diwali');
      expect(getByText('Diwali offers & festive decoration active')).toBeTruthy();
    });
  });

  it('renders DiwaliDecoration with Toran garland, greeting, and offer banner', async () => {
    const { getByTestId, getByText } = await render(<DiwaliDecoration />, { wrapper });

    expect(getByTestId('diwali-decoration')).toBeTruthy();
    expect(getByText('Diwali Health & Wellness Festival')).toBeTruthy();
    expect(getByText('Upto 35% OFF on Consultations & Packages • Code: DIWALI35')).toBeTruthy();
    expect(getByText('✨ Shubh Deepavali')).toBeTruthy();
  });

  it('verifies configService returns normal offers in normal mode, and diwali offers in diwali mode', async () => {
    // 1. Normal mode
    await developerSettingsService.updateSettings({ activeConfigId: 'normal' });
    const normalResult = await configService.fetchConfig();
    expect(normalResult.config.configId).toBe('normal');

    const normalOfferSection = normalResult.config.sections.find((s) => s.type === 'offer_strip');
    expect(normalOfferSection).toBeDefined();
    expect((normalOfferSection?.data as any)?.code).toBe('FIRSTCARE');
    expect((normalOfferSection?.data as any)?.discountText).toBe('Flat 20% OFF');

    // 2. Diwali mode
    await developerSettingsService.updateSettings({ activeConfigId: 'diwali' });
    const diwaliResult = await configService.fetchConfig();
    expect(diwaliResult.config.configId).toBe('diwali');

    const diwaliOfferSection = diwaliResult.config.sections.find((s) => s.type === 'offer_strip');
    expect(diwaliOfferSection).toBeDefined();
    expect((diwaliOfferSection?.data as any)?.code).toBe('DIWALI35');
    expect((diwaliOfferSection?.data as any)?.discountText).toBe('35% OFF');

    const diwaliHeroSection = diwaliResult.config.sections.find((s) => s.type === 'hero_banner');
    expect(diwaliHeroSection).toBeDefined();
    expect((diwaliHeroSection?.data as any)?.headline).toContain('Diwali');
  });
});
