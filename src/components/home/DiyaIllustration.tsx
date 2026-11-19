import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';

interface DiyaIllustrationProps {
  size?: number;
}

export const DiyaIllustration: React.FC<DiyaIllustrationProps> = ({ size = 110 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <Defs>
          {/* Flame Glow Radial */}
          <RadialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <Stop offset="40%" stopColor="#F59E0B" stopOpacity="0.6" />
            <Stop offset="80%" stopColor="#EA580C" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </RadialGradient>

          {/* Flame Gradient */}
          <LinearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#DC2626" />
            <Stop offset="40%" stopColor="#EA580C" />
            <Stop offset="75%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#FEF3C7" />
          </LinearGradient>

          {/* Diya Bowl Gradient */}
          <LinearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#D97706" />
            <Stop offset="50%" stopColor="#92400E" />
            <Stop offset="100%" stopColor="#78350F" />
          </LinearGradient>

          {/* Diya Rim Gradient */}
          <LinearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FDE68A" />
            <Stop offset="50%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
        </Defs>

        {/* Ambient Glow */}
        <Circle cx="60" cy="45" r="38" fill="url(#flameGlow)" />

        {/* Floating Sparkles */}
        <Circle cx="24" cy="30" r="1.5" fill="#FEF08A" opacity="0.8" />
        <Circle cx="96" cy="24" r="2" fill="#FEF08A" opacity="0.9" />
        <Circle cx="102" cy="50" r="1.5" fill="#FDE68A" opacity="0.7" />
        <Circle cx="18" cy="56" r="1.8" fill="#FDE68A" opacity="0.7" />

        {/* Hanging Diya Accent on top right */}
        <G opacity="0.6">
          <Path d="M95 0 L95 18" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2,2" />
          <Ellipse cx="95" cy="20" rx="8" ry="3" fill="#D97706" />
          <Path
            d="M95 10 C93 14 92 16 95 19 C98 16 97 14 95 10 Z"
            fill="#FBBF24"
          />
        </G>

        {/* Main Diya Bowl Base */}
        <Path
          d="M20 72 C22 92 40 102 60 102 C80 102 98 92 100 72 C90 76 76 78 60 78 C44 78 30 76 20 72 Z"
          fill="url(#bowlGrad)"
        />

        {/* Diya Rim (Oval Top) */}
        <Ellipse cx="60" cy="72" rx="40" ry="8" fill="url(#rimGrad)" />

        {/* Diya Oil Surface (Inner Dark Rim) */}
        <Ellipse cx="60" cy="72" rx="34" ry="5.5" fill="#78350F" opacity="0.9" />
        <Ellipse cx="60" cy="73" rx="30" ry="4" fill="#451A03" />

        {/* Decorative Engraving on Bowl */}
        <Path
          d="M32 82 Q46 90 60 90 Q74 90 88 82"
          stroke="#FDE68A"
          strokeWidth="1.2"
          fill="none"
          opacity="0.8"
        />
        <Circle cx="44" cy="85" r="1.5" fill="#FDE68A" />
        <Circle cx="60" cy="88" r="1.8" fill="#FDE68A" />
        <Circle cx="76" cy="85" r="1.5" fill="#FDE68A" />

        {/* Diya Wick */}
        <Path
          d="M60 72 Q59 64 60 58"
          stroke="#27272A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Outer Flame */}
        <Path
          d="M60 22 C53 36 47 48 51 58 C54 65 66 65 69 58 C73 48 67 36 60 22 Z"
          fill="url(#flameGrad)"
        />

        {/* Inner Flame Core (Yellow/White) */}
        <Path
          d="M60 32 C56 42 53 49 55 56 C57 61 63 61 65 56 C67 49 64 42 60 32 Z"
          fill="#FEF3C7"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
