import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DoctorCarouselData, DoctorCarouselItem, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';

// High-resolution professional doctor portrait images
export const defaultDoctorImages: Record<string, string> = {
  'doc-1': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'doc-2': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'doc-3': 'https://images.unsplash.com/photo-1594824813637-27b686d634ea?auto=format&fit=crop&w=400&q=80',
  'doc-4': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
  'doc-5': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
};

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
        {data.doctors.map((doc) => {
          const imageUri =
            doc.imageUrl || defaultDoctorImages[doc.id] || defaultDoctorImages['doc-1'];

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
                  {/* Top Avatar Area with Doctor Profile Image */ }
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.doctorImage}
                      resizeMode="cover"
                    />
                  </View>

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
    </SectionBackground >
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
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              },
                avatarContainer: {
                  height: 110,
                  width: '100%',
                  backgroundColor: '#E0F2FE',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                },
                  doctorImage: {
                    width: '100%',
                    height: '100%',
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
