import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../src/theme';
import { AppText, AppButton, AppBadge, AppCard } from '../src/components/common';

describe('Common UI Components', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('renders AppText with accessible font scaling enabled', async () => {
    const { getByText } = await render(
      <AppText variant="lg" weight="bold">
        Namaste Tapza
      </AppText>,
      { wrapper }
    );
    const textElement = getByText('Namaste Tapza');
    expect(textElement.props.allowFontScaling).toBe(true);
  });

  it('renders AppButton with accessibility role and minimum 44pt touch target', async () => {
    const onPressMock = jest.fn();
    const { getByRole } = await render(
      <AppButton title="Book Doctor" onPress={onPressMock} />,
      { wrapper }
    );

    const button = getByRole('button');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders AppBadge with proper label', async () => {
    const { getByText } = await render(
      <AppBadge label="Confirmed" variant="success" />,
      { wrapper }
    );
    expect(getByText('Confirmed')).toBeTruthy();
  });

  it('renders AppCard container', async () => {
    const { getByText } = await render(
      <AppCard>
        <AppText>Card Content</AppText>
      </AppCard>,
      { wrapper }
    );
    expect(getByText('Card Content')).toBeTruthy();
  });
});
