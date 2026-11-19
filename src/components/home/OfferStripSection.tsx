import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sparkles, Copy, Check, ChevronRight, Tag } from 'lucide-react-native';
import { OfferStripData, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';

interface OfferStripSectionProps {
  id: string;
  title?: string;
  background: BackgroundConfig;
  data: OfferStripData;
}

export const OfferStripSection: React.FC<OfferStripSectionProps> = ({
  background,
  data,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (data.code) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      Alert.alert(
        'Offer Applied!',
        `Coupon code "${data.code}" copied. Use at checkout for discount.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handlePress = () => {
    if (data.code) {
      handleCopyCode();
    }
    navigation.navigate('DoctorSearch', { query: 'Consult' });
  };

  const isGradient = background.type === 'gradient';
  const textColor = isGradient ? '#FFFFFF' : theme.colors.text;
  const subtextColor = isGradient ? 'rgba(255, 255, 255, 0.9)' : theme.colors.textSecondary;

  const titleText = data.message || data.title;
  const subtitleText = data.description || (data.discountText ? `Use code ${data.code} for ${data.discountText}` : null);

          return (
          <View style={styles.outerWrapper}>
            <SectionBackground background={background} style={styles.stripContainer}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`${titleText}. Tap to claim.`}
                activeOpacity={0.85}
                onPress={handlePress}
                style={styles.innerBand}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                {/* Left Icon with Soft Glow Pill */}
                <View style={[styles.iconCircle, { backgroundColor: isGradient ? 'rgba(255, 255, 255, 0.22)' : theme.colors.primaryLight }]}>
                  <Sparkles size={20} color={isGradient ? '#FEF08A' : theme.colors.primary} />
                </View>

                {/* Center Message */}
                <View style={styles.messageContainer}>
                  <AppText
                    variant="sm"
                    weight="bold"
                    color={textColor}
                    numberOfLines={2}
                    style={styles.titleText}
                  >
                    {titleText}
                  </AppText>
                  {subtitleText ? (
                    <AppText
                      variant="xs"
                      color={subtextColor}
                      numberOfLines={1}
                      style={styles.descriptionText}
                    >
                      {subtitleText}
                    </AppText>
                  ) : null}
                </View>

          {/* Right Coupon Code Pill or Arrow */}
                {data.code ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Copy coupon ${data.code}`}
                    onPress={handleCopyCode}
                    style={[
                      styles.codePill,
                      {
                        backgroundColor: isGradient
                          ? 'rgba(255, 255, 255, 0.25)'
                          : theme.colors.surfaceVariant,
                        borderColor: isGradient
                          ? 'rgba(255, 255, 255, 0.5)'
                          : theme.colors.border,
                      },
                    ]}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <AppText
                      variant="xs"
                      weight="bold"
                      color={copied ? '#86EFAC' : (isGradient ? '#FFFFFF' : theme.colors.primary)}
                      style={styles.codeText}
                    >
                      {copied ? 'COPIED' : data.code}
                    </AppText>
                    {copied ? (
                      <Check size={13} color="#86EFAC" style={{ marginLeft: 4 }} />
                    ) : (
                      <Copy size={13} color={isGradient ? '#FFFFFF' : theme.colors.textMuted} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.arrowCircle, { backgroundColor: isGradient ? 'rgba(255, 255, 255, 0.2)' : theme.colors.surfaceVariant }]}>
                    <ChevronRight size={16} color={textColor} />
                  </View>
                )}
        </TouchableOpacity>
      </SectionBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: 16,
    marginVertical: 8,
    width: '100%',
  },
  stripContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  innerBand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 66,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  titleText: {
    fontSize: 14.5,
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.2,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
