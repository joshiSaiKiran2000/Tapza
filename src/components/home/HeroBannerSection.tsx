import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
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

interface HeroBannerSectionProps {
  id: string;
  title?: string;
  background: BackgroundConfig;
  data: HeroBannerData;
  scrollY?: Animated.Value;
}

export const HeroBannerSection: React.FC<HeroBannerSectionProps> = ({
  background,
  data,
  scrollY,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCtaPress = () => {
    navigation.navigate('DoctorDetails', {
      doctorId: data.ctaParams?.doctorId || 'doc-1',
      doctorName: data.ctaParams?.doctorName || 'Dr. Ramesh Reddy',
    });
  };

  const isDiwali = data.headline.toLowerCase().includes('diwali') || background.gradientColors?.[0]?.includes('#');
  const isGradientOrDark = background.type === 'gradient';

  // Parallax translation effect based on scroll position
  const translateY = scrollY
    ? scrollY.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [-15, 0, 12],
      extrapolate: 'clamp',
    })
    : 0;

  return (
    <View style={styles.outerContainer}>
      <SectionBackground background={background} style={styles.backgroundWrapper}>
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
              {data.headline}
            </AppText>

            <View style={{ marginTop: 6 }}>
              <AppText variant="sm" weight="semibold" color="#FDE68A">
                {data.subheadline.includes('OFF')
                  ? data.subheadline
                  : 'Up to 20% OFF on Consultations'}
              </AppText>
            </View>

            {/* Pill "Book Now →" Button */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={data.ctaText || 'Book Now'}
              activeOpacity={0.85}
              onPress={handleCtaPress}
              style={styles.bookNowButton}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <AppText variant="xs" weight="bold" color="#18181B">
                {data.ctaText || 'Book Now'}
              </AppText>
              <ArrowRight size={14} color="#18181B" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {/* Right Visual (Glowing Diya or Medical Shield) */}
          <View style={styles.rightColumn}>
            {isDiwali ? <DiyaIllustration size={102} /> : <MedicalIllustration size={100} />}
          </View>
        </Animated.View>
      </SectionBackground>

      {/* Pagination Dots (3 dots) */ }
  <View style={styles.dotsRow}>
    <View style={[styles.dot, styles.activeDot, { backgroundColor: theme.colors.primary }]} />
    <View style={[styles.dot, { backgroundColor: theme.colors.border }]} />
    <View style={[styles.dot, { backgroundColor: theme.colors.border }]} />
  </View>
    </View >
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
    width: '100%',
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
    width: 16,
    borderRadius: 4,
  },
});
