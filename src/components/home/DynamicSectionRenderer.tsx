import React from 'react';
import { Animated } from 'react-native';
import { HomeSection } from '../../config/types';
import { HeroBannerSection } from './HeroBannerSection';
import { CategoryChipsSection } from './CategoryChipsSection';
import { QuickActionsSection } from './QuickActionsSection';
import { ServiceGridSection } from './ServiceGridSection';
import { DoctorCarouselSection } from './DoctorCarouselSection';
import { OfferStripSection } from './OfferStripSection';
import { UnknownSectionFallback } from './UnknownSectionFallback';

interface DynamicSectionRendererProps {
  section: HomeSection;
  scrollY?: Animated.Value;
}

  export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({
    section,
    scrollY,
  }) => {
    switch (section.type) {
      case 'hero_banner':
        return (
          <HeroBannerSection
            id={section.id}
            title={section.title}
            background={section.background}
            data={section.data}
            scrollY={scrollY}
          />
        );

      case 'category_chips':
        return (
          <CategoryChipsSection
            id={section.id}
            title={section.title}
            subtitle={section.subtitle}
            background={section.background}
            data={section.data}
          />
        );

      case 'quick_actions':
        return (
          <QuickActionsSection
            id={section.id}
            title={section.title}
            subtitle={section.subtitle}
            background={section.background}
            data={section.data}
          />
        );

      case 'service_grid':
        return (
          <ServiceGridSection
            id={section.id}
            title={section.title}
            subtitle={section.subtitle}
            background={section.background}
            data={section.data}
          />
        );

      case 'doctor_carousel':
        return (
          <DoctorCarouselSection
            id={section.id}
            title={section.title}
            subtitle={section.subtitle}
            background={section.background}
            data={section.data}
          />
        );

      case 'offer_strip':
        return (
          <OfferStripSection
            id={section.id}
            title={section.title}
            background={section.background}
            data={section.data}
          />
        );

      default:
        return (
          <UnknownSectionFallback
            sectionId={section.id}
            sectionType={(section as any).type || 'unknown'}
          />
        );
    }
  };
