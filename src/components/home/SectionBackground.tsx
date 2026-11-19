import React from 'react';
import { View, ImageBackground, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BackgroundConfig } from '../../config/types';
import { useTheme } from '../../theme';

interface SectionBackgroundProps {
  background: BackgroundConfig;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({
  background,
  style,
  children,
}) => {
  const theme = useTheme();

  if (background.type === 'gradient' && background.gradientColors?.length) {
    const colors = background.gradientColors as [string, string, ...string[]];
    return (
      <LinearGradient
        colors={colors}
        start={background.gradientStart || { x: 0, y: 0 }}
        end={background.gradientEnd || { x: 1, y: 1 }}
        locations={background.gradientLocations as [number, number, ...number[]] | undefined}
        style={[styles.container, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  if (background.type === 'image' && background.imageUrl) {
    return (
      <ImageBackground
        source={{ uri: background.imageUrl }}
        blurRadius={background.imageBlurRadius || 0}
        imageStyle={{ opacity: background.imageOpacity ?? 0.85 }}
        style={[styles.container, style]}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    );
  }

  // Solid background fallback
  const resolvedColor = background.color || theme.colors.surface;
  return (
    <View style={[styles.container, { backgroundColor: resolvedColor }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
