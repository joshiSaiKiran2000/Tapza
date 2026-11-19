import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Star, MapPin, Clock, Calendar, ChevronRight } from 'lucide-react-native';
import { DoctorCarouselData, DoctorCarouselItem, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText, AppButton, AppBadge } from '../common';
import { SectionBackground } from './SectionBackground';

interface DoctorCarouselSectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  background: BackgroundConfig;
  data: DoctorCarouselData;
}

export const DoctorCarouselSection: React.FC<DoctorCarouselSectionProps> = ({
  title,
  subtitle,
  background,
  data,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleDoctorPress = (doc: DoctorCarouselItem) => {
    navigation.navigate('DoctorDetails', {
      doctorId: doc.id,
      doctorName: doc.name,
    });
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingLeft: theme.spacing.md, paddingRight: 24, paddingVertical: theme.spacing.sm },
        ]}
      >
        {data.doctors.map((doc) => {
          return (
            <TouchableOpacity
              key={doc.id}
              accessibilityRole="button"
              accessibilityLabel={`Doctor ${doc.name}, ${doc.speciality}`}
              activeOpacity={0.8}
              onPress={() => handleDoctorPress(doc)}
              style={[
                styles.doctorCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.xl,
                  padding: theme.spacing.md,
                  marginRight: theme.spacing.md,
                },
              ]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.avatarPlaceholder,
                    {
                      backgroundColor: theme.colors.primaryLight,
                    },
                  ]}
                >
                  <AppText variant="lg" weight="bold" color={theme.colors.primary}>
                    {doc.name.split(' ')[1]?.[0] || 'D'}
                  </AppText>
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <AppText variant="sm" weight="bold" numberOfLines={1}>
                    {doc.name}
                  </AppText>
                  <AppText
                    variant="xs"
                    color={theme.colors.textSecondary}
                    numberOfLines={1}
                    style={{ marginTop: 1 }}
                  >
                    {doc.speciality}
                  </AppText>

                  <View style={styles.ratingRow}>
                    <Star size={13} color="#EAB308" fill="#EAB308" />
                    <AppText variant="xs" weight="semibold" style={{ marginLeft: 3 }}>
                      {doc.rating}
                    </AppText>
                    <AppText variant="xs" color={theme.colors.textMuted} style={{ marginLeft: 2 }}>
                      ({doc.reviewsCount})
                    </AppText>
                    <AppText variant="xs" color={theme.colors.textMuted} style={{ marginLeft: 6 }}>
                      • {doc.experienceYears} yrs exp
                    </AppText>
                  </View>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

              <View style={styles.clinicRow}>
                <MapPin size={14} color={theme.colors.textMuted} style={{ marginRight: 4 }} />
                <AppText variant="xs" color={theme.colors.textSecondary} numberOfLines={1}>
                  {doc.clinic}, {doc.area}
                </AppText>
              </View>

              {doc.nextAvailableSlot ? (
                <View style={[styles.slotRow, { marginTop: 4 }]}>
                  <Clock size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
                  <AppText variant="xs" weight="medium" color={theme.colors.primary}>
                    {doc.nextAvailableSlot}
                  </AppText>
                </View>
              ) : null}

              <View style={[styles.bottomRow, { marginTop: theme.spacing.sm }]}>
                <View>
                  <AppText variant="xs" color={theme.colors.textMuted}>
                    Fee
                  </AppText>
                  <AppText variant="md" weight="bold" color={theme.colors.primary}>
                    ₹{doc.fee}
                  </AppText>
                </View>

                <AppButton
                  title="Book"
                  size="sm"
                  variant="primary"
                  style={{ minWidth: 80, height: 40 }}
                  onPress={() => handleDoctorPress(doc)}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SectionBackground>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 4,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  doctorCard: {
    width: 280,
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
