import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../src/theme';
import { DynamicSectionRenderer } from '../src/components/home/DynamicSectionRenderer';
import { HomeSection } from '../src/config/types';

describe('Dynamic Section Rendering', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NavigationContainer>
      <ThemeProvider>{children}</ThemeProvider>
    </NavigationContainer>
  );

  it('renders hero_banner section with headline and CTA', async () => {
    const section: HomeSection = {
      id: 'sec-hero',
      type: 'hero_banner',
      background: { type: 'gradient', gradientColors: ['#0D7A73', '#115E59'] },
      data: {
        headline: 'Find Best Hyderabad Doctors',
        subheadline: 'Trusted clinic consultations',
        ctaText: 'Book Now',
        ctaRoute: 'DoctorDetails',
      },
    };

    const { getByText } = await render(<DynamicSectionRenderer section={section} />, {
      wrapper,
    });
    expect(getByText('Find Best Hyderabad Doctors')).toBeTruthy();
    expect(getByText('Book Now')).toBeTruthy();
  });

  it('renders category_chips section with categories', async () => {
    const section: HomeSection = {
      id: 'sec-categories',
      type: 'category_chips',
      title: 'Top Specialities',
      background: { type: 'solid', color: '#FFFFFF' },
      data: {
        categories: [
          { id: 'cat-1', label: 'Cardiology', icon: 'Heart' },
          { id: 'cat-2', label: 'Pediatrics', icon: 'Baby' },
        ],
      },
    };

    const { getByText } = await render(<DynamicSectionRenderer section={section} />, {
      wrapper,
    });
    expect(getByText('Top Specialities')).toBeTruthy();
    expect(getByText('Cardiology')).toBeTruthy();
    expect(getByText('Pediatrics')).toBeTruthy();
  });

  it('renders quick_actions section with action shortcuts', async () => {
    const section: HomeSection = {
      id: 'sec-qa',
      type: 'quick_actions',
      title: 'Quick Shortcuts',
      background: { type: 'solid', color: '#F8FAFC' },
      data: {
        actions: [
          { id: 'qa-1', label: 'Book Doctor', icon: 'Calendar', route: 'DoctorDetails' },
          { id: 'qa-2', label: 'Medicines', icon: 'Pill', route: 'Prescriptions' },
        ],
      },
    };

    const { getByText } = await render(<DynamicSectionRenderer section={section} />, {
      wrapper,
    });
    expect(getByText('Quick Shortcuts')).toBeTruthy();
    expect(getByText('Book Doctor')).toBeTruthy();
    expect(getByText('Medicines')).toBeTruthy();
  });

  it('renders service_grid section with healthcare test cards', async () => {
    const section: HomeSection = {
      id: 'sec-services',
      type: 'service_grid',
      title: 'Health Packages',
      background: { type: 'solid', color: '#FFFFFF' },
      data: {
        columns: 2,
        services: [
          {
            id: 'srv-1',
            title: 'Full Body Wellness',
            subtitle: '68 Key Parameters',
            icon: 'ShieldCheck',
            route: 'DoctorDetails',
          },
        ],
      },
    };

    const { getByText } = await render(<DynamicSectionRenderer section={section} />, {
      wrapper,
    });
    expect(getByText('Health Packages')).toBeTruthy();
    expect(getByText('Full Body Wellness')).toBeTruthy();
  });

  it('renders doctor_carousel section with doctor cards and fees', async () => {
    const section: HomeSection = {
      id: 'sec-doctors',
      type: 'doctor_carousel',
      title: 'Hyderabad Doctors',
      background: { type: 'solid', color: '#FFFFFF' },
      data: {
        doctors: [
          {
            id: 'doc-1',
            name: 'Dr. Ramesh Reddy',
            speciality: 'Cardiologist',
            experienceYears: 16,
            rating: 4.9,
            reviewsCount: 300,
            fee: 800,
            clinic: 'Care Hospitals',
            area: 'Banjara Hills',
            availableToday: true,
          },
        ],
      },
    };

    const { getByText } = await render(<DynamicSectionRenderer section={section} />, {
      wrapper,
    });
    expect(getByText('Hyderabad Doctors')).toBeTruthy();
    expect(getByText('Dr. Ramesh Reddy')).toBeTruthy();
    expect(getByText('₹800')).toBeTruthy();
  });

  it('renders offer_strip section with coupon code', async () => {
    const section: HomeSection = {
      id: 'sec-offer',
      type: 'offer_strip',
      background: { type: 'solid', color: '#FFFFFF' },
      data: {
        id: 'off-1',
        title: 'Special Diwali Discount',
        code: 'DIWALI35',
        discountText: '35% OFF',
        description: 'Valid across all clinics',
        validTill: '25 Nov',
        ctaText: 'Redeem',
      },
    };

    const { getByText } = await render(<DynamicSectionRenderer section={section} />, {
      wrapper,
    });
    expect(getByText('Special Diwali Discount')).toBeTruthy();
    expect(getByText('DIWALI35')).toBeTruthy();
  });
});
