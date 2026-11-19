import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import { HeroBannerData, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';
import { DiyaIllustration } from './DiyaIllustration';
import { MedicalIllustration } from './MedicalIllustration';
import { LabCheckupIllustration } from './LabCheckupIllustration';
import { TeleconsultIllustration } from './TeleconsultIllustration';

interface HeroBannerSectionProps {
  id: string;
  title?: string;
  background: BackgroundConfig;
  data: HeroBannerData;
  scrollY?: Animated.Value;
}

interface BannerSlide {
  id: string;
  badgeText?: string;
  headline: string;
  subheadline: string;
  subheadlineColor: string;
  ctaText: string;
  onCta: () => void;
  background: BackgroundConfig;
  visual: React.ReactNode;
}

export const HeroBannerSection: React.FC<HeroBannerSectionProps> = ({
  background,
  data,
  scrollY,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width: windowWidth } = useWindowDimensions();

    // Banner width fills the container between 16px horizontal screen padding
    const bannerWidth = Math.max(windowWidth - 32, 280);

    const flatListRef = useRef<FlatList<BannerSlide>>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(0);
    activeIndexRef.current = activeIndex;
    const isInteractingRef = useRef(false);

    const isDiwali =
      data.headline.toLowerCase().includes('diwali') ||
      background.gradientColors?.[0]?.toLowerCase().includes('#7c182a') ||
      background.gradientColors?.[0]?.toLowerCase().includes('#b91c1c') ||
      background.gradientColors?.[0]?.toLowerCase().includes('#c2410c');

    // Build the 3 banners with dynamic themes (Diwali or Standard)
    const banners: BannerSlide[] = useMemo(() => {
      if (isDiwali) {
        return [
          {
            id: 'banner-diwali-1',
            badgeText: data.badgeText || '🪔 Shubh Deepavali',
            headline: data.headline,
            subheadline: data.subheadline.includes('OFF')
              ? data.subheadline
              : 'Up to 20% OFF on Consultations',
            subheadlineColor: '#FDE68A',
            ctaText: data.ctaText || 'Book Now',
            onCta: () => {
              navigation.navigate('DoctorDetails', {
                doctorId: data.ctaParams?.doctorId || 'doc-1',
                doctorName: data.ctaParams?.doctorName || 'Dr. Rakesh Kumar',
              });
            },
            background: background,
            visual: <DiyaIllustration size={102} />,
          },
          {
            id: 'banner-diwali-2',
            badgeText: '✨ Festive Health Check',
            headline: 'Festive Family Wellness\nFull Body Package',
            subheadline: '75+ Vital Tests @ ₹999 • Free Home Sample',
            subheadlineColor: '#FEF08A',
            ctaText: 'Book Checkup',
            onCta: () => {
              navigation.navigate('DoctorSearch', { query: 'Health Checkup' });
            },
            background: {
              type: 'gradient' as const,
              gradientColors: ['#78350F', '#B45309', '#D97706'],
            },
            visual: <LabCheckupIllustration size={102} isFestive={true} />,
          },
          {
            id: 'banner-diwali-3',
            badgeText: '⚡ 24x7 Available',
            headline: '24/7 Expert Doctors\nAnytime, Anywhere',
            subheadline: 'Video Consult Within 10 Minutes',
            subheadlineColor: '#FBCFE8',
            ctaText: 'Consult Now',
            onCta: () => {
              navigation.navigate('DoctorSearch', { initialCategory: 'Consult' });
            },
            background: {
              type: 'gradient' as const,
              gradientColors: ['#831843', '#BE185D', '#9D174D'],
            },
            visual: <TeleconsultIllustration size={102} isFestive={true} />,
          },
        ];
      }

      return [
        {
          id: 'banner-normal-1',
          badgeText: data.badgeText || "Hyderabad's Trusted Care",
          headline: data.headline,
          subheadline: data.subheadline,
          subheadlineColor: '#A7F3D0',
          ctaText: data.ctaText || 'Book Now',
          onCta: () => {
            navigation.navigate('DoctorDetails', {
              doctorId: data.ctaParams?.doctorId || 'doc-1',
              doctorName: data.ctaParams?.doctorName || 'Dr. Rakesh Kumar',
            });
          },
          background: background,
          visual: <MedicalIllustration size={100} />,
        },
        {
          id: 'banner-normal-2',
          badgeText: '🧪 Comprehensive Care',
          headline: 'Full Body Health Checkup\nat Flat 40% OFF',
          subheadline: '60+ Tests • Free Home Sample Pickup',
          subheadlineColor: '#BAE6FD',
          ctaText: 'Book Checkup',
          onCta: () => {
            navigation.navigate('DoctorSearch', { query: 'Health Checkup' });
          },
          background: {
            type: 'gradient' as const,
            gradientColors: ['#1E3A8A', '#2563EB', '#1D4ED8'],
          },
          visual: <LabCheckupIllustration size={100} isFestive={false} />,
        },
        {
          id: 'banner-normal-3',
          badgeText: '⚡ Instant Video Consult',
          headline: 'Consult Top Specialists\nWithin 15 Minutes',
          subheadline: 'Verified Doctors • 24/7 Video Consults',
          subheadlineColor: '#DDD6FE',
          ctaText: 'Consult Now',
          onCta: () => {
            navigation.navigate('DoctorSearch', { initialCategory: 'Consult' });
          },
          background: {
            type: 'gradient' as const,
            gradientColors: ['#4C1D95', '#6D28D9', '#5B21B6'],
          },
          visual: <TeleconsultIllustration size={100} isFestive={false} />,
        },
      ];
    }, [isDiwali, data, background, navigation]);

    // Auto-scroll through the 3 banners every 4 seconds
    useEffect(() => {
      if (process.env.NODE_ENV === 'test') {
        return;
      }

      const timer = setInterval(() => {
        if (isInteractingRef.current) return;
        const nextIndex = (activeIndexRef.current + 1) % banners.length;
        if (flatListRef.current) {
          try {
            flatListRef.current.scrollToOffset({
              offset: nextIndex * bannerWidth,
              animated: true,
            });
            setActiveIndex(nextIndex);
          } catch {
            // Guard for unmounted views
          }
        }
      }, 4000);

      return () => clearInterval(timer);
    }, [bannerWidth, banners.length]);

    const onScrollBeginDrag = () => {
      isInteractingRef.current = true;
    };

    const onScrollEndDrag = () => {
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 1200);
    };

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      isInteractingRef.current = false;
      const offsetX = e.nativeEvent.contentOffset.x;
      const newIdx = Math.round(offsetX / bannerWidth);
      if (newIdx >= 0 && newIdx < banners.length) {
        setActiveIndex(newIdx);
      }
    };

    const handleDotPress = (index: number) => {
      setActiveIndex(index);
      if (flatListRef.current) {
        try {
          flatListRef.current.scrollToOffset({
            offset: index * bannerWidth,
            animated: true,
          });
        } catch {
          // Guard
        }
      }
    };

    // Parallax translation effect based on vertical scroll position
    const translateY = scrollY
      ? scrollY.interpolate({
        inputRange: [-100, 0, 100],
      outputRange: [-15, 0, 12],
        extrapolate: 'clamp',
      })
    : 0;

return (
  <View style={styles.outerContainer}>
          <FlatList
            ref={flatListRef}
            data={banners}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            snapToInterval={bannerWidth}
            snapToAlignment="center"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            bounces={false}
            initialNumToRender={3}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={(_, index) => ({
              length: bannerWidth,
              offset: bannerWidth * index,
              index,
            })}
            style={{ width: bannerWidth, borderRadius: 22 }}
            renderItem={({ item }) => (
              <View style={{ width: bannerWidth }}>
                <SectionBackground background={item.background} style={styles.backgroundWrapper}>
                  <Animated.View
                    style={[
                      styles.contentRow,
                      {
                        transform: [{ translateY }],
                      },
                    ]}
                  >
                    {/* Left Text & CTA */}
                    <View style={styles.leftColumn}>
                      <AppText
                        variant="lg"
                        weight="bold"
                        color="#FFFFFF"
                        style={styles.headline}
                      >
                        {item.headline}
                      </AppText>

                      <View style={{ marginTop: 6 }}>
                        <AppText variant="sm" weight="semibold" color={item.subheadlineColor}>
                          {item.subheadline}
                        </AppText>
                      </View>

                    {/* Pill CTA Button */}
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={item.ctaText}
                      activeOpacity={0.85}
                      onPress={item.onCta}
                      style={styles.bookNowButton}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <AppText variant="xs" weight="bold" color="#18181B">
                        {item.ctaText}
                      </AppText>
                      <ArrowRight size={14} color="#18181B" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>

                    {/* Right Visual */}
                    <View style={styles.rightColumn}>{item.visual}</View>
                  </Animated.View>
                </SectionBackground>
              </View>
        )}
      />

      {/* Interactive Pagination Dots (3 dots reflecting activeIndex) */ }
<View style={styles.dotsRow}>
  {banners.map((item, idx) => {
    const isActive = activeIndex === idx;
    return (
      <TouchableOpacity
        key={item.id}
        accessibilityRole="button"
        accessibilityLabel={`Banner ${idx + 1}`}
        onPress={() => handleDotPress(idx)}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        style={[
          styles.dot,
          isActive
            ? [styles.activeDot, { backgroundColor: theme.colors.primary }]
            : { backgroundColor: theme.colors.border },
        ]}
      />
    );
  })}
</View>
    </View >
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  backgroundWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 165,
    overflow: 'hidden',
  },
  leftColumn: {
    flex: 1.25,
    flexShrink: 1,
    paddingRight: 8,
    justifyContent: 'center',
  },
  rightColumn: {
    flex: 0.95,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headline: {
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: -0.2,
  },
  bookNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 36,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 4,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 18,
    borderRadius: 4,
  },
});
