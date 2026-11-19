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
} from 'react-native-svg';

interface MedicalIllustrationProps {
  size?: number;
}

export const MedicalIllustration: React.FC<MedicalIllustrationProps> = ({ size = 110 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <Defs>
          <RadialGradient id="tealGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.4" />
            <Stop offset="70%" stopColor="#0D7A73" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#0D7A73" stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2DD4BF" />
            <Stop offset="50%" stopColor="#0D7A73" />
            <Stop offset="100%" stopColor="#07504C" />
          </LinearGradient>
        </Defs>

        <Circle cx="60" cy="60" r="45" fill="url(#tealGlow)" />

        {/* Shield Container */}
        <Path
          d="M60 20 L86 32 C86 64 60 88 60 88 C60 88 34 64 34 32 Z"
          fill="url(#shieldGrad)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />

        {/* Heartbeat Line */}
        <Path
          d="M44 54 L52 54 L56 44 L62 64 L66 50 L70 54 L76 54"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Floating Cross Accent */}
        <G opacity="0.8">
          <Circle cx="88" cy="30" r="8" fill="#FFFFFF" fillOpacity="0.2" />
          <Path d="M88 26 L88 34 M84 30 L92 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
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
