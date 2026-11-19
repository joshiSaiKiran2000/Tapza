import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { HeroBannerData, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText, AppButton, AppBadge } from '../common';
import { SectionBackground } from './SectionBackground';

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

  const isGradientOrDark = background.type === 'gradient';
  const textColor = isGradientOrDark ? theme.colors.white : theme.colors.text;
  const subtitleColor = isGradientOrDark
    ? 'rgba(255, 255, 255, 0.85)'
    : theme.colors.textSecondary;

  // Parallax translation effect based on scroll position
  const translateY = scrollY
    ? scrollY.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [-20, 0, 15],
      extrapolate: 'clamp',
    })
    : 0;

  return (
    <SectionBackground background={background} style={styles.backgroundWrapper}>
      <Animated.View
        style={[
          styles.content,
          {
            paddingHorizontal: 18,
            paddingVertical: 18,
            transform: [{ translateY }],
          },
        ]}
      >
        {data.badgeText ? (
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badgeContainer,
                {
                  backgroundColor: isGradientOrDark
                    ? 'rgba(255, 255, 255, 0.2)'
                    : theme.colors.primaryLight,
                  borderColor: isGradientOrDark
                    ? 'rgba(255, 255, 255, 0.4)'
                    : theme.colors.border,
                },
              ]}
            >
              <Sparkles size={14} color={isGradientOrDark ? '#FEF08A' : theme.colors.primary} />
              <AppText
                variant="xs"
                weight="bold"
                color={isGradientOrDark ? theme.colors.white : theme.colors.primary}
                style={{ marginLeft: 6 }}
              >
                {data.badgeText}
              </AppText>
            </View>
          </View>
        ) : null}

        <AppText
          variant="xl"
          weight="bold"
          color={textColor}
          style={[styles.headline, { marginTop: theme.spacing.sm }]}
        >
          {data.headline}
        </AppText>

        {data.headlineHindi ? (
          <AppText
            variant="sm"
            weight="medium"
            color={subtitleColor}
            style={{ marginTop: 2, fontStyle: 'italic' }}
          >
            {data.headlineHindi}
          </AppText>
        ) : null}

        <AppText
          variant="sm"
          color={subtitleColor}
          style={[styles.subheadline, { marginTop: theme.spacing.xs }]}
        >
          {data.subheadline}
        </AppText>

        {data.accentNote ? (
          <View style={[styles.accentRow, { marginTop: theme.spacing.sm }]}>
            <ShieldCheck size={16} color={isGradientOrDark ? '#FEF08A' : theme.colors.success} />
            <AppText
              variant="xs"
              weight="semibold"
              color={isGradientOrDark ? '#FEF08A' : theme.colors.success}
              style={{ marginLeft: 6 }}
            >
              {data.accentNote}
            </AppText>
          </View>
        ) : null}

        <AppButton
          title={data.ctaText}
          variant={isGradientOrDark ? 'secondary' : 'primary'}
          size="md"
          icon={<ArrowRight size={18} color={theme.colors.white} />}
          iconPosition="right"
          style={{ marginTop: theme.spacing.md }}
          onPress={handleCtaPress}
        />
      </Animated.View>
    </SectionBackground >
  );
};

const styles = StyleSheet.create({
  backgroundWrapper: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    paddingVertical: 20,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  headline: {
    letterSpacing: -0.3,
  },
  subheadline: {
    lineHeight: 20,
  },
  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
