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

interface TeleconsultIllustrationProps {
  size?: number;
  isFestive?: boolean;
}

export const TeleconsultIllustration: React.FC<TeleconsultIllustrationProps> = ({
  size = 100,
  isFestive = false,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <Defs>
          {/* Ambient Glow */}
          <RadialGradient id="teleGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={isFestive ? '#F43F5E' : '#A855F7'} stopOpacity="0.45" />
            <Stop offset="70%" stopColor={isFestive ? '#BE185D' : '#7C3AED'} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={isFestive ? '#831843' : '#4C1D95'} stopOpacity="0" />
          </RadialGradient>

          {/* Phone Screen Gradient */}
          <LinearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={isFestive ? '#9D174D' : '#312E81'} />
            <Stop offset="100%" stopColor={isFestive ? '#4C0519' : '#1E1B4B'} />
          </LinearGradient>

          {/* Doctor Avatar Gradient */}
          <LinearGradient id="docGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#E0E7FF" />
          </LinearGradient>

          {/* Live Badge Gradient */}
          <LinearGradient id="liveBadgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>

        {/* Ambient Glow */}
        <Circle cx="60" cy="60" r="46" fill="url(#teleGlow)" />

        {/* Smartphone Body */}
        <Rect
          x="34"
          y="16"
          width="52"
          height="88"
          rx="12"
          fill="url(#screenGrad)"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
        />

        {/* Phone Speaker Notch */}
        <Rect x="52" y="21" width="16" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.6" />

        {/* Video Call Avatar Circle */}
        <Circle cx="60" cy="50" r="18" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Doctor Head */}
        <Circle cx="60" cy="45" r="7.5" fill="url(#docGrad)" />

        {/* Doctor Coat / Shoulders */}
        <Path
          d="M48 64 C48 57 53 55 60 55 C67 55 72 57 72 64 Z"
          fill="url(#docGrad)"
        />
        {/* Stethoscope around neck */}
        <Path
          d="M55 57 C55 62 65 62 65 57"
          stroke={isFestive ? '#F59E0B' : '#06B6D4'}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* LIVE / Online Badge */}
        <Rect x="42" y="72" width="36" height="12" rx="6" fill="url(#liveBadgeGrad)" />
        <Circle cx="48" cy="78" r="2.5" fill="#FFFFFF" />
        <Path
          d="M53 78 L56 78 M59 78 L65 78 M68 78 L71 78"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Signal Waves on top left */}
        <Path
          d="M20 38 Q25 43 20 48"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M15 33 Q24 43 15 53"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Signal Waves on top right */}
        <Path
          d="M100 38 Q95 43 100 48"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M105 33 Q96 43 105 53"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sparkles */}
        <Circle cx="98" cy="22" r="2" fill="#FFFFFF" fillOpacity="0.8" />
        <Circle cx="24" cy="72" r="1.5" fill={isFestive ? '#FDE68A' : '#C084FC'} fillOpacity="0.9" />
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
