import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../src/theme';
import {
  EmptyState,
  ErrorState,
  HomeScreenSkeleton,
  DoctorDetailsSkeleton,
  PrescriptionListSkeleton,
  BookingListSkeleton,
} from '../src/components/common';

describe('Resilience Components (Empty States, Error States & Skeletons)', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('renders EmptyState with custom title, description, and actionable CTA', async () => {
    const onActionMock = jest.fn();
    const { getByText, getByRole } = await render(
      <EmptyState
        title="No Appointments Found"
        description="Book with top verified doctors."
        actionTitle="Explore Doctors"
        onAction={onActionMock}
      />,
      { wrapper }
    );

    expect(getByText('No Appointments Found')).toBeTruthy();
    expect(getByText('Book with top verified doctors.')).toBeTruthy();

    const button = getByRole('button');
    fireEvent.press(button);
    expect(onActionMock).toHaveBeenCalledTimes(1);
  });

  it('renders ErrorState with error message and 1-tap retry button', async () => {
    const onRetryMock = jest.fn();
    const { getByText, getByRole } = await render(
      <ErrorState
        title="Network Connection Failed"
        message="Could not reach healthcare API."
        onRetry={onRetryMock}
      />,
      { wrapper }
    );

    expect(getByText('Network Connection Failed')).toBeTruthy();
    expect(getByText('Could not reach healthcare API.')).toBeTruthy();

    const retryButton = getByRole('button');
    fireEvent.press(retryButton);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('renders all skeleton loading components without crashing', async () => {
    const homeSkel = await render(<HomeScreenSkeleton />, { wrapper });
    expect(homeSkel).toBeDefined();

    const docSkel = await render(<DoctorDetailsSkeleton />, { wrapper });
    expect(docSkel).toBeDefined();

    const rxSkel = await render(<PrescriptionListSkeleton />, { wrapper });
    expect(rxSkel).toBeDefined();

    const bkSkel = await render(<BookingListSkeleton />, { wrapper });
    expect(bkSkel).toBeDefined();
  });
});
