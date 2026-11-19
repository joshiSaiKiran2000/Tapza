import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, Pill, Clock, PhoneCall, Sparkles, LucideIcon } from 'lucide-react-native';
import { QuickActionsData, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Pill,
  Clock,
  PhoneCall,
  Sparkles,
};

interface QuickActionsSectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  background: BackgroundConfig;
  data: QuickActionsData;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  title,
  subtitle,
  background,
  data,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleActionPress = (route: string) => {
    if (route === 'DoctorDetails') {
      navigation.navigate('DoctorDetails', { doctorId: 'doc-1' });
    } else if (route === 'Prescriptions') {
      navigation.navigate('MainTabs', { screen: 'Prescriptions' });
    } else if (route === 'Bookings') {
      navigation.navigate('MainTabs', { screen: 'Bookings' });
    } else {
      navigation.navigate('DoctorDetails', { doctorId: 'doc-1' });
    }
  };

  return (
    <SectionBackground background={background} style={styles.sectionContainer}>
      <View style={{ paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.xs }}>
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
        {data.actions.map((act) => {
          const IconComponent = iconMap[act.icon] || Sparkles;

          return (
            <TouchableOpacity
              key={act.id}
              accessibilityRole="button"
              accessibilityLabel={`${act.label}: ${act.sublabel || ''}`}
              activeOpacity={0.7}
              onPress={() => handleActionPress(act.route)}
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.md,
                },
              ]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
                {/* Card Top Row with Icon on left and Badge on right */ }
                < View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: theme.colors.primaryLight,
                  },
                ]}
              >
                <IconComponent size={22} color={theme.colors.primary} />
              </View>

                {act.badge ? (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          act.badge === 'SOS'
                            ? theme.colors.error
                            : theme.colors.secondaryLight,
                      },
                    ]}
                  >
                    <AppText
                      variant="xs"
                      weight="bold"
                      numberOfLines={1}
                      color={act.badge === 'SOS' ? theme.colors.white : theme.colors.secondary}
                      style={{ fontSize: 10, lineHeight: 12 }}
                    >
                      {act.badge}
                    </AppText>
                  </View>
                ) : null}
              </View>

              <AppText
                variant="sm"
                weight="bold"
                numberOfLines={1}
                style={{ marginTop: 10 }}
              >
                {act.label}
              </AppText>

              {act.sublabel ? (
                <AppText
                  variant="xs"
                  color={theme.colors.textMuted}
                  numberOfLines={1}
                  style={{ marginTop: 2 }}
                >
                  {act.sublabel}
                </AppText>
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
  actionCard: {
    width: '48%',
    borderWidth: 1,
    minHeight: 96,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    maxWidth: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
