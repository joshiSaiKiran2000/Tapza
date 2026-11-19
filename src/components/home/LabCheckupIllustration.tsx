import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Rect,
} from 'react-native-svg';

interface LabCheckupIllustrationProps {
  size?: number;
  isFestive?: boolean;
}

export const LabCheckupIllustration: React.FC<LabCheckupIllustrationProps> = ({
  size = 100,
  isFestive = false,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <Defs>
          {/* Ambient Glow */}
          <RadialGradient id="labGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={isFestive ? '#F59E0B' : '#60A5FA'} stopOpacity="0.45" />
            <Stop offset="70%" stopColor={isFestive ? '#D97706' : '#2563EB'} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={isFestive ? '#B45309' : '#1D4ED8'} stopOpacity="0" />
          </RadialGradient>

          {/* Flask Liquid Gradient */}
          <LinearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={isFestive ? '#FBBF24' : '#38BDF8'} />
            <Stop offset="50%" stopColor={isFestive ? '#F59E0B' : '#0284C7'} />
            <Stop offset="100%" stopColor={isFestive ? '#D97706' : '#1E40AF'} />
          </LinearGradient>

          {/* Glass Gradient */}
          <LinearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
          </LinearGradient>
        </Defs>

        {/* Ambient Glow Background */}
        <Circle cx="60" cy="60" r="46" fill="url(#labGlow)" />

        {/* Clipboard / Health Report Card in background */}
        <G transform="translate(18, 22) rotate(-8)">
          <Rect
            x="0"
            y="0"
            width="42"
            height="58"
            rx="6"
            fill="#FFFFFF"
            fillOpacity="0.9"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
          {/* Clipboard Clip */}
          <Rect x="13" y="-3" width="16" height="6" rx="2" fill={isFestive ? '#B45309' : '#3B82F6'} />
          {/* Report Lines */}
          <Rect x="8" y="14" width="26" height="3" rx="1.5" fill={isFestive ? '#F59E0B' : '#93C5FD'} />
          <Rect x="8" y="22" width="22" height="3" rx="1.5" fill={isFestive ? '#FCD34D' : '#BFDBFE'} />
          <Rect x="8" y="30" width="18" height="3" rx="1.5" fill={isFestive ? '#FDE68A' : '#DBEAFE'} />
          {/* Checkmark tick */}
          <Circle cx="30" cy="44" r="6" fill={isFestive ? '#10B981' : '#10B981'} />
          <Path
            d="M27 44 L29 46 L33 42"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Laboratory Flask */}
        {/* Flask Glass Outline */}
        <Path
          d="M54 28 L66 28 L66 46 L82 78 C85 84 81 92 74 92 L46 92 C39 92 35 84 38 78 L54 46 Z"
          fill="rgba(255,255,255,0.18)"
          stroke="url(#glassGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Flask Rim Top */}
        <Rect x="51" y="24" width="18" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.8" />

        {/* Liquid inside flask */}
        <Path
          d="M44 76 Q60 70 76 76 L80 84 C81 87 79 90 75 90 L45 90 C41 90 39 87 40 84 Z"
          fill="url(#liquidGrad)"
        />

        {/* Liquid Surface wave */}
        <Path
          d="M44 76 Q52 72 60 76 Q68 80 76 76"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Rising Effervescent Bubbles */}
        <Circle cx="60" cy="62" r="3" fill="#FFFFFF" fillOpacity="0.75" />
        <Circle cx="56" cy="52" r="2.2" fill="#FFFFFF" fillOpacity="0.65" />
        <Circle cx="64" cy="42" r="1.8" fill="#FFFFFF" fillOpacity="0.55" />
        <Circle cx="52" cy="78" r="2.5" fill="#FFFFFF" fillOpacity="0.6" />
        <Circle cx="68" cy="82" r="2" fill="#FFFFFF" fillOpacity="0.6" />

        {/* Sparkles on top right */}
        <G opacity="0.9">
          <Circle cx="92" cy="36" r="2" fill={isFestive ? '#FDE68A' : '#93C5FD'} />
          <Circle cx="84" cy="24" r="1.5" fill="#FFFFFF" />
          <Circle cx="98" cy="48" r="1.2" fill="#FFFFFF" />
        </G>
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
