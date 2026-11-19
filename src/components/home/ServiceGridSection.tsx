import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Baby,
  Sparkles,
  LucideIcon,
  ChevronRight,
} from 'lucide-react-native';
import { ServiceGridData, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText, AppBadge } from '../common';
import { SectionBackground } from './SectionBackground';

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Activity,
  ShieldCheck,
  Baby,
  Sparkles,
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

  const handleServicePress = () => {
    navigation.navigate('DoctorDetails', { doctorId: 'doc-1' });
  };

  return (
    <SectionBackground background={background} style={styles.sectionContainer}>
      <View style={{ paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.sm }}>
        {title ? (
          <AppText variant="lg" weight="bold">
            {title}
          </AppText>
        ) : null}
        {subtitle ? (
          <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={[styles.grid, { padding: theme.spacing.md }]}>
        {data.services.map((srv) => {
          const IconComponent = iconMap[srv.icon] || Sparkles;

          return (
            <TouchableOpacity
              key={srv.id}
              accessibilityRole="button"
              accessibilityLabel={`${srv.title}: ${srv.subtitle}`}
              activeOpacity={0.7}
              onPress={handleServicePress}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.md,
                },
              ]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={styles.topRow}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: theme.colors.primaryLight,
                    },
                  ]}
                >
                  <IconComponent size={20} color={theme.colors.primary} />
                </View>

                {srv.tag ? (
                  <AppBadge label={srv.tag} variant="secondary" />
                ) : null}
              </View>

              <AppText
                variant="sm"
                weight="bold"
                numberOfLines={2}
                style={[styles.serviceTitle, { marginTop: theme.spacing.xs }]}
              >
                {srv.title}
              </AppText>

              <AppText
                variant="xs"
                color={theme.colors.textMuted}
                numberOfLines={2}
                style={{ marginTop: 2 }}
              >
                {srv.subtitle}
              </AppText>

              {srv.discount ? (
                <View style={[styles.discountRow, { marginTop: theme.spacing.xs }]}>
                  <AppText variant="xs" weight="bold" color={theme.colors.primary}>
                    {srv.discount}
                  </AppText>
                  <ChevronRight size={14} color={theme.colors.primary} />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </SectionBackground>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  card: {
    width: '48%',
    borderWidth: 1,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    lineHeight: 18,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
