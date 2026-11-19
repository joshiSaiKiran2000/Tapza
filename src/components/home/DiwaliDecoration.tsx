import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import { Sparkles, Flame } from 'lucide-react-native';
import { AppText, AppBadge } from '../common';

interface DiwaliDecorationProps {
  testID?: string;
}

/**
 * Traditional Diwali Toran Garland SVG with hanging marigolds, mango leaves, and golden diyas
 */
const ToranGarland: React.FC<{ width: number }> = ({ width }) => {
  const height = 44;
  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} 44`} fill="none">
        <Defs>
          {/* Flame Glow */}
          <RadialGradient id="toranFlameGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <Stop offset="50%" stopColor="#F59E0B" stopOpacity="0.7" />
            <Stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </RadialGradient>
          {/* Flame Gradient */}
          <SvgLinearGradient id="toranFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#DC2626" />
            <Stop offset="40%" stopColor="#EA580C" />
            <Stop offset="80%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#FEF3C7" />
          </SvgLinearGradient>
          {/* Brass Diya Gradient */}
          <SvgLinearGradient id="toranBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE68A" />
            <Stop offset="45%" stopColor="#D97706" />
            <Stop offset="100%" stopColor="#78350F" />
          </SvgLinearGradient>
        </Defs>

        {/* Top Gold Toran String */}
        <Path
          d={`M 0 4 Q ${width * 0.25} 12 ${width * 0.5} 4 Q ${width * 0.75} 12 ${width} 4`}
          stroke="#F59E0B"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Distributed Mango Leaves and Marigold Flowers across width */}
        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((ratio, idx) => {
          const cx = width * ratio;
          const isMarigold = idx % 2 === 0;
          return (
            <G key={`garland-item-${idx}`}>
              {/* Mango Leaf */}
              <Path
                d={`M ${cx - 6} 4 Q ${cx} 18 ${cx} 22 Q ${cx} 18 ${cx + 6} 4 Z`}
                fill="#15803D"
                opacity={0.9}
              />
              {/* Marigold Flower */}
              {isMarigold ? (
                <G>
                  <Circle cx={cx} cy={11} r={6} fill="#EA580C" />
                  <Circle cx={cx} cy={11} r={4.5} fill="#FBBF24" />
                  <Circle cx={cx} cy={11} r={2.5} fill="#FEF08A" />
                </G>
              ) : (
                <G>
                  <Circle cx={cx} cy={10} r={5} fill="#D97706" />
                  <Circle cx={cx} cy={10} r={3} fill="#FEF3C7" />
                </G>
              )}
            </G>
          );
        })}

        {/* Hanging Diyas at 3 Key Anchors (20%, 50%, 80%) */}
        {[0.2, 0.5, 0.8].map((ratio, dIdx) => {
          const dx = width * ratio;
          return (
            <G key={`diya-hanging-${dIdx}`}>
              {/* Golden hanging chain */}
              <Path
                d={`M ${dx} 4 L ${dx} 24`}
                stroke="#FDE68A"
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
              {/* Diya Glow */}
              <Circle cx={dx} cy={24} r={10} fill="url(#toranFlameGlow)" />
              {/* Diya Bowl */}
              <Path
                d={`M ${dx - 10} 32 C ${dx - 9} 39 ${dx - 4} 42 ${dx} 42 C ${dx + 4} 42 ${dx + 9} 39 ${dx + 10} 32 Z`}
                fill="url(#toranBrassGrad)"
              />
              <Ellipse cx={dx} cy={32} rx={10} ry={2.5} fill="#FDE68A" />
              {/* Flame */}
              <Path
                d={`M ${dx} 20 C ${dx - 3} 25 ${dx - 3} 28 ${dx} 32 C ${dx + 3} 28 ${dx + 3} 25 ${dx} 20 Z`}
                fill="url(#toranFlameGrad)"
              />
            </G>
          );
        })}

        {/* Little Sparkles */}
        <Circle cx={width * 0.35} cy={16} r={1.5} fill="#FEF08A" opacity={0.8} />
        <Circle cx={width * 0.65} cy={16} r={1.5} fill="#FEF08A" opacity={0.8} />
      </Svg>
    </View>
  );
};

export const DiwaliDecoration: React.FC<DiwaliDecorationProps> = ({ testID = 'diwali-decoration' }) => {
  const { width: windowWidth } = useWindowDimensions();
  const garlandWidth = Math.max(windowWidth - 32, 280);

  // Subtle pulsing animation for festive flame glow
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseAnim]);

  return (
    <View testID={testID} style={styles.container}>
      {/* 1. Hanging Toran & Marigold Garland */}
      <View style={styles.garlandWrapper}>
        <ToranGarland width={garlandWidth} />
      </View>

      {/* 2. Festive Diwali Celebration Banner */}
      <LinearGradient
        colors={['#7C182A', '#9A1C28', '#9A3412', '#C2410C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerCard}
      >
        <View style={styles.bannerContent}>
          {/* Left Diya Flame Icon with Glow */}
          <Animated.View
            style={[
              styles.flameIconCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Flame size={20} color="#FEF08A" fill="#F59E0B" />
          </Animated.View>

          {/* Center Greeting & Info */}
          <View style={styles.textContainer}>
            <View style={styles.badgeRow}>
              <AppBadge
                label="✨ Shubh Deepavali"
                variant="secondary"
                style={styles.badgeStyle}
              />
              <AppText variant="xs" weight="bold" color="#FDE68A" style={{ marginLeft: 6 }}>
                Festive Edition
              </AppText>
            </View>

            <AppText variant="sm" weight="bold" color="#FFFFFF" style={styles.titleText}>
              Diwali Health & Wellness Festival
            </AppText>

            <AppText variant="xs" color="#FEF3C7" style={styles.subText}>
              Upto 35% OFF on Consultations & Packages • Code: DIWALI35
            </AppText>
          </View>

          {/* Right Sparkles */}
          <View style={styles.rightSparkle}>
            <Sparkles size={22} color="#FDE68A" />
          </View>
        </View>

        {/* Decorative Golden Bottom Trim Line */}
        <View style={styles.goldenTrim} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 6,
    width: '100%',
  },
  garlandWrapper: {
    alignItems: 'center',
    marginBottom: -4,
    zIndex: 2,
  },
  bannerCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(253, 230, 138, 0.45)',
    overflow: 'hidden',
    shadowColor: '#C2410C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  flameIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(254, 240, 138, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(254, 240, 138, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  badgeStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  titleText: {
    fontSize: 13.5,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  subText: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 1,
  },
  rightSparkle: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldenTrim: {
    height: 2.5,
    backgroundColor: '#FDE68A',
    opacity: 0.8,
  },
});
