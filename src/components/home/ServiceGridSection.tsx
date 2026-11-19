import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Baby,
  Sparkles,
  FlaskConical,
  Stethoscope,
  Plus,
  LucideIcon,
} from 'lucide-react-native';
import { ServiceGridData, BackgroundConfig, ServiceGridItem } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Activity,
  ShieldCheck,
  Baby,
  Sparkles,
  FlaskConical,
  Stethoscope,
};

interface ServiceGridSectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  background: BackgroundConfig;
  data: ServiceGridData;
}

export const ServiceGridSection: React.FC<ServiceGridSectionProps> = ({
  title,
  subtitle,
  background,
  data,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCardPress = (service: ServiceGridItem) => {
    if (service.route === 'DoctorDetails') {
      navigation.navigate('DoctorDetails', { doctorId: 'doc-1' });
    } else {
      const queryName = service.name || service.title || 'Health Checkup';
      navigation.navigate('DoctorSearch', { query: queryName });
    }
  };

  return (
    <SectionBackground background={background} style={styles.sectionContainer}>
      <View style={styles.outerWrapper}>
            {/* Section Header */}
            {(title || subtitle) && (
              <View style={styles.headerRow}>
                {title ? (
                  <AppText variant="lg" weight="bold" color={theme.colors.text}>
                    {title}
                  </AppText>
                ) : null}
                {subtitle ? (
                  <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                    {subtitle}
                  </AppText>
                ) : null}
              </View>
            )}

          {/* 3-Column Service Grid Cards */}
          <View style={styles.grid}>
            {data.services.map((srv) => (
              <ServiceCardItem
                key={srv.id}
                service={srv}
                onPress={() => handleCardPress(srv)}
              />
            ))}
          </View>
        </View>
    </SectionBackground>
  );
};

interface ServiceCardItemProps {
  service: ServiceGridItem;
  onPress: () => void;
}

const ServiceCardItem: React.FC<ServiceCardItemProps> = ({
  service,
  onPress,
}) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);

  const name = service.name || service.title || 'Health Package';
  const badgeText = service.badge || service.tag;
  const imageUrl = service.image || service.imageUrl;

  // Format Price in Rupees
  const rawPrice = service.price ?? service.priceRupees;
  let priceFormatted: string;
  if (typeof rawPrice === 'number') {
    priceFormatted = `₹${rawPrice.toLocaleString('en-IN')}`;
  } else if (typeof rawPrice === 'string') {
    priceFormatted = rawPrice.startsWith('₹') ? rawPrice : `₹${rawPrice}`;
  } else if (service.discount && service.discount.includes('₹')) {
    priceFormatted = service.discount.split(' ')[0];
  } else {
    priceFormatted = '₹499';
  }

  // Format Original Price
  let originalPriceFormatted: string | null = null;
  if (service.originalPrice) {
    if (typeof service.originalPrice === 'number') {
      originalPriceFormatted = `₹${service.originalPrice.toLocaleString('en-IN')}`;
    } else if (typeof service.originalPrice === 'string') {
      originalPriceFormatted = service.originalPrice.startsWith('₹')
        ? service.originalPrice
        : `₹${service.originalPrice}`;
    }
  }

  const IconComponent = (service.icon && iconMap[service.icon]) || Sparkles;

  // Badge color mapping
  const getBadgeBg = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('diwali') || lower.includes('special')) return '#D97706';
    if (lower.includes('popular') || lower.includes('best')) return '#0D7A73';
    if (lower.includes('essential')) return '#2563EB';
    if (lower.includes('off') || lower.includes('save')) return '#15803D';
    return theme.colors.primary;
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${name}: ${priceFormatted}`}
      activeOpacity={0.82}
      onPress={onPress}
      style={[
        styles.card3Col,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      {/* Top Image or Fallback Visual */}
        <View style={styles.imageContainer3Col}>
          {imageUrl && !imageError ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.fallbackBox, { backgroundColor: theme.colors.primaryLight }]}>
              <IconComponent size={24} color={theme.colors.primary} />
            </View>
          )}

          {/* Optional Floating Badge on Image */}
          {badgeText ? (
            <View
              style={[
                styles.floatingBadge3Col,
                { backgroundColor: getBadgeBg(badgeText) },
              ]}
            >
              <AppText
                variant="xs"
                weight="bold"
                color="#FFFFFF"
                numberOfLines={1}
                style={{ fontSize: 9, letterSpacing: 0.2 }}
              >
                {badgeText}
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Card Details */}
          <View style={styles.cardContent3Col}>
            {/* Name / Title */}
            <AppText
              variant="xs"
              weight="bold"
              numberOfLines={2}
              color={theme.colors.text}
              style={styles.serviceName3Col}
            >
              {name}
            </AppText>

            {/* Price Row */}
              <View style={styles.priceRow}>
                <View style={styles.priceContainer}>
                  <AppText
                    variant="xs"
                    weight="bold"
                    color="#0D7A73"
                    style={{ fontSize: 12 }}
                  >
                    {priceFormatted}
                  </AppText>

                  {originalPriceFormatted ? (
                    <AppText
                      variant="xs"
                      color={theme.colors.textMuted}
                      style={styles.originalPrice}
                    >
                      {originalPriceFormatted}
                    </AppText>
                  ) : null}
                </View>

                {/* Plus Add / Book Button */}
                <View style={[styles.plusBtn3Col, { backgroundColor: theme.colors.primaryLight }]}>
                  <Plus size={12} color={theme.colors.primary} strokeWidth={2.5} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          );
};

          const styles = StyleSheet.create({
            sectionContainer: {
            marginVertical: 6,
  },
          outerWrapper: {
            paddingHorizontal: 16,
          width: '100%',
  },
          headerRow: {
          marginBottom: 12,
  },
          grid: {
            flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          rowGap: 10,
  },
          card3Col: {
            width: '31.3%',
          borderRadius: 14,
          borderWidth: 1,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 3,
          elevation: 1,
  },
            imageContainer3Col: {
            width: '100%',
          height: 78,
          overflow: 'hidden',
          position: 'relative',
  },
          cardImage: {
            width: '100%',
          height: '100%',
  },
          fallbackBox: {
            width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
  },
            floatingBadge3Col: {
            position: 'absolute',
          top: 5,
          left: 5,
          borderRadius: 5,
          paddingHorizontal: 5,
          paddingVertical: 2,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
  },
          cardContent3Col: {
            padding: 7,
          justifyContent: 'space-between',
          minHeight: 64,
  },
          serviceName3Col: {
            fontSize: 11,
          lineHeight: 14,
          minHeight: 28,
  },
          priceRow: {
            flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 4,
  },
          priceContainer: {
            flexDirection: 'row',
          alignItems: 'baseline',
          gap: 3,
          flexWrap: 'wrap',
  },
          originalPrice: {
            textDecorationLine: 'line-through',
          fontSize: 9,
  },
          plusBtn3Col: {
            width: 22,
          height: 22,
          borderRadius: 11,
          alignItems: 'center',
          justifyContent: 'center',
  },
});
