import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DoctorCarouselData, DoctorCarouselItem, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';

// Soft gradient pairs for the doctor card header illustration
const avatarGradientPairs: Array<[string, string]> = [
  ['#E0F2FE', '#BAE6FD'], // Light Sky Blue
  ['#EDE9FE', '#DDD6FE'], // Light Lavender
  ['#DCFCE7', '#BBF7D0'], // Light Mint Green
  ['#FFEDD5', '#FED7AA'], // Light Peach
];

interface DoctorCarouselSectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  background: BackgroundConfig;
  data: DoctorCarouselData;
}

export const DoctorCarouselSection: React.FC<DoctorCarouselSectionProps> = ({
  title = 'Our Doctors',
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
            {/* Header with Title and "See all →" */}
            <View style={styles.headerRow}>
              <AppText variant="md" weight="bold" color={theme.colors.text}>
                {title}
              </AppText>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="See all doctors"
                onPress={() =>
                  navigation.navigate('DoctorDetails', {
                    doctorId: data.doctors[0]?.id || 'doc-1',
                  })
                }
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.seeAllButton}
              >
                <AppText variant="xs" weight="bold" color={theme.colors.primary}>
                  See all →
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Horizontal Doctor Cards Matching Design */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
                {
                  data.doctors.map((doc, index) => {
                    const grad = avatarGradientPairs[index % avatarGradientPairs.length];

                    return (
                      <TouchableOpacity
                        key={doc.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Doctor ${doc.name}, ${doc.speciality}, Fee ₹${doc.fee}`}
                        activeOpacity={0.82}
                        onPress={() => handleDoctorPress(doc)}
                        style={[
                          styles.doctorCard,
                          {
                            backgroundColor: theme.colors.card,
                            borderColor: theme.colors.border,
                          },
                        ]}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                            {/* Top Avatar Area with soft gradient */}
                            <LinearGradient
                              colors={grad}
                              style={styles.avatarContainer}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                            >
                              <View style={styles.avatarCircle}>
                                <User size={38} color="#0369A1" />
                              </View>
                            </LinearGradient>

                              {/* Doctor Details Body */}
                              <View style={styles.cardBody}>
                                <AppText
                                  variant="sm"
                                  weight="bold"
                                  color={theme.colors.text}
                                  numberOfLines={1}
                                >
                                  {doc.name}
                                </AppText>

                                <AppText
                                  variant="xs"
                                  color={theme.colors.textSecondary}
                                  numberOfLines={1}
                                  style={{ marginTop: 2 }}
                                >
                                  {doc.speciality}
                                </AppText>

                                  {/* Bottom Row: Fee & Available Pill */}
                                  <View style={styles.feeRow}>
                                    <AppText variant="sm" weight="bold" color={theme.colors.text}>
                                      ₹{doc.fee}
                                    </AppText>

                                      <View style={styles.availableBadge}>
                                        <AppText
                                          variant="xs"
                                          weight="semibold"
                                          color="#047857"
                                          style={{ fontSize: 10, lineHeight: 12 }}
                                        >
                                          Available
                                        </AppText>
                                      </View>
                                    </View>
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
                          marginVertical: 10,
  },
                          headerRow: {
                            flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 16,
                          marginBottom: 12,
  },
                          seeAllButton: {
                            flexDirection: 'row',
                          alignItems: 'center',
  },
                          scrollContent: {
                            flexDirection: 'row',
                          paddingLeft: 16,
                          paddingRight: 24,
                          gap: 12,
  },
                          doctorCard: {
                          width: 156,
                          borderRadius: 18,
                          borderWidth: 1,
                          overflow: 'hidden',
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2 },
                          shadowOpacity: 0.05,
                          shadowRadius: 4,
                          elevation: 2,
  },
                          avatarContainer: {
                            height: 100,
                          alignItems: 'center',
                          justifyContent: 'center',
  },
                          avatarCircle: {
                            width: 60,
                          height: 60,
                          borderRadius: 30,
                          backgroundColor: '#FFFFFF',
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2 },
                          shadowOpacity: 0.08,
                          shadowRadius: 3,
                          elevation: 2,
  },
                          cardBody: {
                            padding: 12,
                          justifyContent: 'space-between',
  },
                            feeRow: {
                            flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10,
  },
                          availableBadge: {
                            backgroundColor: '#D1FAE5',
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 10,
                          borderWidth: StyleSheet.hairlineWidth,
                          borderColor: '#A7F3D0',
  },
});
