import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from '../src/theme';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import { AdminPanelScreen } from '../src/screens/AdminPanelScreen';
import { DiwaliDecoration } from '../src/components/home/DiwaliDecoration';
import { developerSettingsService } from '../src/services/developerSettings';
import { configService } from '../src/services/configService';

  describe('Admin Panel, Diwali Mode & Theme Customizations', () => {
    beforeEach(async () => {
      // Reset to normal mode and disable simulated latency for snappy tests
      await developerSettingsService.updateSettings({
        activeConfigId: 'normal',
        simulateLatency: false,
      });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationContainer>
        <ThemeProvider>{children}</ThemeProvider>
      </NavigationContainer>
    );

      it('renders ProfileScreen with Admin Panel card and navigates to AdminPanel on press', async () => {
        const navigateMock = jest.fn();
        const { getByText, getByTestId } = await render(
          <ProfileScreen navigation={{ navigate: navigateMock } as any} route={{} as any} />,
          { wrapper }
        );

        expect(getByText('Admin Panel')).toBeTruthy();
        expect(getByText('Diwali mode, background & text colors, font settings')).toBeTruthy();

        const adminCard = getByTestId('admin-panel-card');
        expect(adminCard).toBeTruthy();

        fireEvent.press(adminCard);
        expect(navigateMock).toHaveBeenCalledWith('AdminPanel');
      });

      it('renders AdminPanelScreen with Diwali Mode toggle, color selectors, and font scaling', async () => {
        const { getByText, getByTestId, getByLabelText } = await render(
          <AdminPanelScreen navigation={{} as any} route={{} as any} />,
          { wrapper }
        );

        // Header & Preview
        expect(getByText('Admin Panel')).toBeTruthy();
        expect(getByText('LIVE REAL-TIME PREVIEW')).toBeTruthy();
        expect(getByText('Screen & Typography Preview')).toBeTruthy();

        // Diwali Switch
        expect(getByText('FESTIVAL & PROMOTIONS')).toBeTruthy();
        const diwaliSwitch = getByTestId('admin-diwali-mode-switch');
        expect(diwaliSwitch).toBeTruthy();
        expect(diwaliSwitch.props.value).toBe(false);

        // Color Sections
        expect(getByText('SCREEN BACKGROUND COLOR')).toBeTruthy();
        expect(getByText('TEXT & TYPOGRAPHY COLOR')).toBeTruthy();
        expect(getByText('FONT SIZE & SCALING')).toBeTruthy();

        // Palettes
        expect(getByLabelText('Select background Warm Cream')).toBeTruthy();
        expect(getByLabelText('Select text color Cobalt Blue')).toBeTruthy();
        expect(getByLabelText('Font size Large')).toBeTruthy();
      });

        it('toggles Diwali Mode switch ON in AdminPanelScreen and updates settings', async () => {
          const { getByTestId, getByText } = await render(
            <AdminPanelScreen navigation={{} as any} route={{} as any} />,
            { wrapper }
          );

          const diwaliSwitch = getByTestId('admin-diwali-mode-switch');
          expect(diwaliSwitch.props.value).toBe(false);

          // Turn Diwali Mode ON
          fireEvent(diwaliSwitch, 'valueChange', true);

          await waitFor(() => {
            expect(developerSettingsService.getSettings().activeConfigId).toBe('diwali');
            expect(getByText('🪔 Active')).toBeTruthy();
          });
        });

        it('updates background color and font scale from AdminPanelScreen', async () => {
          const { getByLabelText, getByText } = await render(
            <AdminPanelScreen navigation={{} as any} route={{} as any} />,
            { wrapper }
          );

          // Select Warm Cream background
          fireEvent.press(getByLabelText('Select background Warm Cream'));
          await waitFor(() => {
            expect(getByText('BG: #FFFBEB')).toBeTruthy();
          });

          // Select Large font scale
          fireEvent.press(getByLabelText('Font size Large'));
          await waitFor(() => {
            expect(getByText('Font: LARGE')).toBeTruthy();
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
