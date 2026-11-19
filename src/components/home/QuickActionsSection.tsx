import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Calendar,
  FileText,
  Bell,
  Users,
  Pill,
  Clock,
  PhoneCall,
  Sparkles,
  ChevronRight,
  LucideIcon,
} from 'lucide-react-native';
import { QuickActionsData, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  FileText,
  Bell,
  Users,
  Pill,
  Clock,
  PhoneCall,
  Sparkles,
};

// Pastel colors for the 4 action circles matching the screenshot
const actionPalette = [
  { bg: '#CCFBF1', icon: '#0F766E' }, // Mint / Cyan
  { bg: '#DBEAFE', icon: '#1D4ED8' }, // Sky Blue
  { bg: '#FEF3C7', icon: '#D97706' }, // Warm Amber
  { bg: '#F3E8FF', icon: '#7E22CE' }, // Purple
];

interface QuickActionsSectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  background: BackgroundConfig;
  data: QuickActionsData;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  title = 'Quick Actions',
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

  const displayActions = data.actions.slice(0, 4);

  return (
    <SectionBackground background={background} style={styles.sectionContainer}>
            {/* Header with Title on Left and 'See all →' on Right */}
            <View style={styles.headerRow}>
              <AppText variant="md" weight="bold" color={theme.colors.text}>
                {title}
              </AppText>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="See all quick actions"
                onPress={() => navigation.navigate('MainTabs', { screen: 'Bookings' })}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.seeAllButton}
              >
                <AppText variant="xs" weight="bold" color={theme.colors.primary}>
                  See all →
                </AppText>
              </TouchableOpacity>
            </View>

                {/* 4 Action Circles in a Row */ }
                <View style={styles.actionsRow}>
                  {displayActions.map((act, index) => {
                    const colorPair = actionPalette[index % actionPalette.length];
                    const IconComponent = iconMap[act.icon] || Calendar;

                    return (
                      <TouchableOpacity
                        key={act.id}
                        accessibilityRole="button"
                        accessibilityLabel={act.label}
                        activeOpacity={0.75}
                        onPress={() => handleActionPress(act.route)}
                        style={styles.actionItem}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                            <View style={[styles.circleIcon, { backgroundColor: colorPair.bg }]}>
                              <IconComponent size={22} color={colorPair.icon} />
                            </View>

                          <AppText
                            variant="xs"
                            weight="medium"
                            color={theme.colors.textSecondary}
                            align="center"
                            style={styles.actionLabel}
                            numberOfLines={2}
                          >
                            {act.label}
                          </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
    </SectionBackground>
            );
};

            const styles = StyleSheet.create({
              sectionContainer: {
            marginVertical: 10,
            paddingHorizontal: 16,
  },
              headerRow: {
              flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
  },
              seeAllButton: {
              flexDirection: 'row',
            alignItems: 'center',
  },
            actionsRow: {
              flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-around',
  },
            actionItem: {
              alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
            minHeight: 88,
  },
            circleIcon: {
              width: 52,
            height: 52,
            borderRadius: 26,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
  },
            actionLabel: {
              marginTop: 8,
            fontSize: 11,
            lineHeight: 14,
            maxWidth: 72,
  },
});
