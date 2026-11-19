import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Tag, Copy, Check, Clock, Sparkles } from 'lucide-react-native';
import { OfferStripData, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText, AppButton, AppBadge } from '../common';
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    Alert.alert(
      'Coupon Code Applied!',
      `Code "${data.code}" has been copied for your appointment.`,
      [{ text: 'OK' }]
    );
  };

  const handleCta = () => {
    navigation.navigate('DoctorDetails', { doctorId: 'doc-1' });
  };

  const isGradient = background.type === 'gradient';
  const textColor = isGradient ? theme.colors.white : theme.colors.text;
  const subtextColor = isGradient ? 'rgba(255,255,255,0.85)' : theme.colors.textSecondary;

  return (
    <SectionBackground background={background} style={styles.container}>
      <View style={[styles.innerContent, { padding: theme.spacing.md }]}>
        <View style={styles.topRow}>
          <View style={styles.titleArea}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Tag size={16} color={isGradient ? '#FEF08A' : theme.colors.secondary} />
              <AppText
                variant="sm"
                weight="bold"
                color={isGradient ? '#FEF08A' : theme.colors.secondary}
                style={{ marginLeft: 6 }}
              >
                {data.discountText}
              </AppText>
            </View>

            <AppText
              variant="md"
              weight="bold"
              color={textColor}
              style={{ marginTop: 4 }}
            >
              {data.title}
            </AppText>

            {data.titleHindi ? (
              <AppText
                variant="xs"
                color={subtextColor}
                style={{ marginTop: 2, fontStyle: 'italic' }}
              >
                {data.titleHindi}
              </AppText>
            ) : null}
          </View>
        </View>

        <AppText
          variant="xs"
          color={subtextColor}
          style={{ marginTop: 6, lineHeight: 16 }}
        >
          {data.description}
        </AppText>

        <View style={[styles.actionRow, { marginTop: theme.spacing.sm }]}>
          {/* Coupon Code Pill */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Copy coupon code ${data.code}`}
            onPress={handleCopyCode}
            style={[
              styles.couponButton,
              {
                backgroundColor: isGradient
                  ? 'rgba(255, 255, 255, 0.2)'
                  : theme.colors.surfaceVariant,
                borderColor: isGradient
                  ? 'rgba(255, 255, 255, 0.4)'
                  : theme.colors.border,
              },
            ]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <AppText
              variant="sm"
              weight="bold"
              color={isGradient ? theme.colors.white : theme.colors.primary}
              style={{ letterSpacing: 1 }}
            >
              {data.code}
            </AppText>
            {copied ? (
              <Check size={14} color={isGradient ? '#86EFAC' : theme.colors.success} style={{ marginLeft: 6 }} />
            ) : (
              <Copy size={14} color={isGradient ? theme.colors.white : theme.colors.textMuted} style={{ marginLeft: 6 }} />
            )}
          </TouchableOpacity>

          <AppButton
            title={data.ctaText}
            size="sm"
            variant={isGradient ? 'secondary' : 'primary'}
            style={{ height: 40, minHeight: 40, paddingHorizontal: 16 }}
            onPress={handleCta}
          />
        </View>

        <View style={[styles.validRow, { marginTop: 6 }]}>
          <Clock size={12} color={subtextColor} style={{ marginRight: 4 }} />
          <AppText variant="xs" color={subtextColor} style={{ fontSize: 11 }}>
            Valid till: {data.validTill}
          </AppText>
        </View>
      </View>
    </SectionBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  innerContent: {
    paddingVertical: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    minHeight: 44,
  },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
