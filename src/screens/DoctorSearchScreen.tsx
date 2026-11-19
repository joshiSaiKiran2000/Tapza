import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Star,
  Bookmark,
  X,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { AppText, EmptyState } from '../components/common';
import type { RootStackScreenProps } from '../types/navigation';
import { defaultDoctorImages } from '../components/home/DoctorCarouselSection';

export interface DoctorListItem {
  id: string;
  name: string;
  speciality: string;
  category: 'General' | 'Cardiologist' | 'Pediatrician' | 'Dermatologist' | 'Orthopedic';
  degrees: string;
  experienceYears: number;
  rating: number;
  reviewsCountFormatted: string;
  available: boolean;
  imageUrl: string;
}

// Complete 20-doctor directory matching the design with verified high-res photos
export const doctorSearchDirectory: DoctorListItem[] = [
  {
    id: 'doc-2',
    name: 'Dr. Priya Sharma',
    speciality: 'General Physician',
    category: 'General',
    degrees: 'MBBS, MD',
    experienceYears: 8,
    rating: 4.8,
    reviewsCountFormatted: '12k',
    available: true,
    imageUrl: defaultDoctorImages['doc-2'],
  },
  {
    id: 'doc-1',
    name: 'Dr. Rakesh Kumar',
    speciality: 'Cardiologist',
    category: 'Cardiologist',
    degrees: 'DM',
    experienceYears: 12,
    rating: 4.9,
    reviewsCountFormatted: '8k',
    available: true,
    imageUrl: defaultDoctorImages['doc-1'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Sneha Reddy',
    speciality: 'Pediatrician',
    category: 'Pediatrician',
    degrees: 'MD',
    experienceYears: 10,
    rating: 4.8,
    reviewsCountFormatted: '6k',
    available: true,
    imageUrl: defaultDoctorImages['doc-3'],
  },
  {
    id: 'doc-4',
    name: 'Dr. Arjun Mehta',
    speciality: 'Dermatologist',
    category: 'Dermatologist',
    degrees: 'MD',
    experienceYears: 9,
    rating: 4.7,
    reviewsCountFormatted: '5k',
    available: true,
    imageUrl: defaultDoctorImages['doc-4'],
  },
  {
    id: 'doc-5',
    name: 'Dr. Vikram Rao',
    speciality: 'General Physician',
    category: 'General',
    degrees: 'MBBS, DNB',
    experienceYears: 14,
    rating: 4.7,
    reviewsCountFormatted: '4.2k',
    available: true,
    imageUrl: defaultDoctorImages['doc-5'],
  },
  {
    id: 'doc-6',
    name: 'Dr. Neha Patel',
    speciality: 'Pediatrician',
    category: 'Pediatrician',
    degrees: 'MBBS, DCH',
    experienceYears: 7,
    rating: 4.9,
    reviewsCountFormatted: '7.4k',
    available: true,
    imageUrl: defaultDoctorImages['doc-6'],
  },
  {
    id: 'doc-7',
    name: 'Dr. Suresh Varma',
    speciality: 'Orthopedic Surgeon',
    category: 'Orthopedic',
    degrees: 'MS, M.Ch',
    experienceYears: 18,
    rating: 4.9,
    reviewsCountFormatted: '10k',
    available: true,
    imageUrl: defaultDoctorImages['doc-7'],
  },
  {
    id: 'doc-8',
    name: 'Dr. Ananya Sen',
    speciality: 'Dermatologist',
    category: 'Dermatologist',
    degrees: 'MD (DVL)',
    experienceYears: 11,
    rating: 4.8,
    reviewsCountFormatted: '3.9k',
    available: true,
    imageUrl: defaultDoctorImages['doc-8'],
  },
  {
    id: 'doc-9',
    name: 'Dr. Rajesh Deshmukh',
    speciality: 'Cardiologist',
    category: 'Cardiologist',
    degrees: 'DM, FACC',
    experienceYears: 15,
    rating: 4.9,
    reviewsCountFormatted: '9.1k',
    available: true,
    imageUrl: defaultDoctorImages['doc-9'],
  },
  {
    id: 'doc-10',
    name: 'Dr. Kavita Nair',
    speciality: 'General Physician',
    category: 'General',
    degrees: 'MBBS, MD',
    experienceYears: 10,
    rating: 4.8,
    reviewsCountFormatted: '6.8k',
    available: true,
    imageUrl: defaultDoctorImages['doc-10'],
  },
  {
    id: 'doc-11',
    name: 'Dr. Manoj Chawla',
    speciality: 'Diabetologist',
    category: 'General',
    degrees: 'MD, DM',
    experienceYears: 13,
    rating: 4.7,
    reviewsCountFormatted: '5.3k',
    available: true,
    imageUrl: defaultDoctorImages['doc-11'],
  },
  {
    id: 'doc-12',
    name: 'Dr. Pooja Agarwal',
    speciality: 'Pediatrician',
    category: 'Pediatrician',
    degrees: 'MD, FIAP',
    experienceYears: 9,
    rating: 4.8,
    reviewsCountFormatted: '4.6k',
    available: true,
    imageUrl: defaultDoctorImages['doc-12'],
  },
  {
    id: 'doc-13',
    name: 'Dr. Sanjay Kulkarni',
    speciality: 'Orthopedic Surgeon',
    category: 'Orthopedic',
    degrees: 'MS, DNB',
    experienceYears: 16,
    rating: 4.9,
    reviewsCountFormatted: '8.2k',
    available: true,
    imageUrl: defaultDoctorImages['doc-13'],
  },
  {
    id: 'doc-14',
    name: 'Dr. Meera Nambiar',
    speciality: 'Dermatologist',
    category: 'Dermatologist',
    degrees: 'DVD, MD',
    experienceYears: 6,
    rating: 4.6,
    reviewsCountFormatted: '3.1k',
    available: true,
    imageUrl: defaultDoctorImages['doc-14'],
  },
  {
    id: 'doc-15',
    name: 'Dr. Aditya Bansal',
    speciality: 'Cardiologist',
    category: 'Cardiologist',
    degrees: 'MD, DM',
    experienceYears: 11,
    rating: 4.8,
    reviewsCountFormatted: '5.8k',
    available: true,
    imageUrl: defaultDoctorImages['doc-15'],
  },
  {
    id: 'doc-16',
    name: 'Dr. Swati Joshi',
    speciality: 'General Physician',
    category: 'General',
    degrees: 'MBBS',
    experienceYears: 8,
    rating: 4.7,
    reviewsCountFormatted: '4.9k',
    available: true,
    imageUrl: defaultDoctorImages['doc-16'],
  },
  {
    id: 'doc-17',
    name: 'Dr. Harish Nambisan',
    speciality: 'ENT Specialist',
    category: 'General',
    degrees: 'MS (ENT)',
    experienceYears: 12,
    rating: 4.8,
    reviewsCountFormatted: '6.3k',
    available: true,
    imageUrl: defaultDoctorImages['doc-17'],
  },
  {
    id: 'doc-18',
    name: 'Dr. Divya Ranganathan',
    speciality: 'Gynecologist',
    category: 'General',
    degrees: 'MS, DGO',
    experienceYears: 14,
    rating: 4.9,
    reviewsCountFormatted: '11k',
    available: true,
    imageUrl: defaultDoctorImages['doc-18'],
  },
  {
    id: 'doc-19',
    name: 'Dr. Vivek Malhotra',
    speciality: 'Pulmonologist',
    category: 'General',
    degrees: 'MD, DNB',
    experienceYears: 13,
    rating: 4.8,
    reviewsCountFormatted: '7.1k',
    available: true,
    imageUrl: defaultDoctorImages['doc-19'],
  },
  {
    id: 'doc-20',
    name: 'Dr. Sunita Kulkarni',
    speciality: 'Neurologist',
    category: 'General',
    degrees: 'DM (Neuro)',
    experienceYears: 15,
    rating: 4.9,
    reviewsCountFormatted: '9.5k',
    available: true,
    imageUrl: defaultDoctorImages['doc-20'],
  },
];

const categories = [
  'All',
  'General',
  'Cardiologist',
  'Pediatrician',
  'Dermatologist',
  'Orthopedic',
] as const;

export const DoctorSearchScreen: React.FC<RootStackScreenProps<'DoctorSearch'>> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    route.params?.initialCategory || 'All'
  );
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter 20 doctors based on search text and selected category
  const filteredDoctors = useMemo(() => {
    return doctorSearchDirectory.filter((doc) => {
      const matchesCategory =
        selectedCategory === 'All' || doc.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.speciality.toLowerCase().includes(q) ||
        doc.degrees.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleDoctorPress = (doc: DoctorListItem) => {
    navigation.navigate('DoctorDetails', {
      doctorId: doc.id,
      doctorName: doc.name,
    });
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      {/* 1. Header Bar: < Our Doctors [filter] */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.headerIconButton}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

          <AppText variant="lg" weight="bold" color={theme.colors.text} style={styles.headerTitle}>
            Our Doctors
          </AppText>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Filter doctors"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.headerIconButton}
          >
            <SlidersHorizontal size={20} color={theme.colors.text} />
          </TouchableOpacity>
      </View>

      {/* 2. Search Bar */}
      <View style={styles.searchBarContainer}>
          <View style={[styles.searchBarBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Search size={18} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search doctors..."
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.searchInput, { color: theme.colors.text }]}
              autoFocus={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <X size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 3. Horizontal Category Chips */}
        <View style={styles.chipsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${cat}`}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.chipPill,
                    isSelected
                      ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                    : {
              backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.border,
                      },
                ]}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
            <AppText
              variant="xs"
              weight={isSelected ? 'bold' : 'medium'}
              color={isSelected ? theme.colors.white : theme.colors.textSecondary}
              style={styles.chipText}
            >
              {cat}
            </AppText>
          </TouchableOpacity>
          );
          })}
        </ScrollView>
      </View>

      {/* 4. Doctor List (20 Doctors) */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No Doctors Found"
            description={`No specialists found matching "${searchQuery}". Try a different name or speciality.`}
            actionTitle="Reset Search"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        }
        renderItem={({ item }) => {
          const isBookmarked = bookmarkedIds.has(item.id);

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Doctor ${item.name}, ${item.speciality}`}
              activeOpacity={0.7}
              onPress={() => handleDoctorPress(item)}
              style={[styles.doctorRow, { borderBottomColor: theme.colors.border }]}
            >
              {/* Doctor Avatar Photo */}
                <View
                  style={[
                    styles.avatarContainer,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Middle Info Column */}
                <View style={styles.doctorInfo}>
                    <AppText variant="md" weight="bold" color={theme.colors.text} style={styles.doctorName}>
                      {item.name}
                    </AppText>
                      <AppText variant="xs" color={theme.colors.textSecondary} style={styles.doctorSpeciality}>
                        {item.speciality}
                      </AppText>
                        <AppText variant="xs" color={theme.colors.textMuted} style={styles.doctorDegrees}>
                          {item.degrees} • {item.experienceYears} years exp
                        </AppText>

                        {/* Rating row */}
                        <View style={styles.ratingRow}>
                          <Star size={14} color="#F59E0B" fill="#F59E0B" />
                            <AppText variant="xs" weight="bold" color={theme.colors.text} style={{ marginLeft: 4 }}>
                              {item.rating}
                            </AppText>
                              <AppText variant="xs" color={theme.colors.textMuted} style={{ marginLeft: 2 }}>
                                ({item.reviewsCountFormatted})
                              </AppText>
                            </View>
                        </View>

                        {/* Right Column: Bookmark + Available Pill */}
                        <View style={styles.doctorRightCol}>
                          <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="Bookmark doctor"
                            onPress={() => toggleBookmark(item.id)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={styles.bookmarkButton}
                          >
                            <Bookmark
                              size={20}
                              color={theme.colors.text}
                              fill={isBookmarked ? theme.colors.text : 'none'}
                            />
                          </TouchableOpacity>

                              <View
                                style={[
                                  styles.availablePill,
                                  { backgroundColor: theme.colors.successLight },
                                ]}
                              >
                                <AppText variant="xs" weight="semibold" color={theme.colors.success} style={styles.availableText}>
                                  Available
                                </AppText>
                              </View>
                          </View>
                        </TouchableOpacity>
                        );
        }}
      />
                      </SafeAreaView>
                      );
};

                      const styles = StyleSheet.create({
                        safeArea: {
                        flex: 1,
  },
                      headerBar: {
                        flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
  },
                      headerIconButton: {
                        width: 36,
                      height: 36,
                      alignItems: 'center',
                      justifyContent: 'center',
  },
                      headerTitle: {
                        fontSize: 18,
                      lineHeight: 22,
  },
                      searchBarContainer: {
                        paddingHorizontal: 16,
                      paddingBottom: 10,
  },
                      searchBarBox: {
                        flexDirection: 'row',
                      alignItems: 'center',
                      height: 46,
                      borderRadius: 23,
                      paddingHorizontal: 14,
  },
                      searchInput: {
                        flex: 1,
                      fontSize: 14,
                      height: '100%',
  },
                      chipsWrapper: {
                        marginBottom: 8,
  },
                      chipsContainer: {
                        flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      gap: 8,
  },
                      chipPill: {
                        paddingHorizontal: 16,
                      paddingVertical: 7,
                      borderRadius: 18,
                      borderWidth: 1,
  },
                      chipInactive: { },
                      chipText: {
                        fontSize: 12.5,
                      lineHeight: 16,
  },
                      listContent: {
                        paddingBottom: 24,
  },
                      doctorRow: {
                        flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderBottomWidth: StyleSheet.hairlineWidth,
  },
                      avatarContainer: {
                        width: 70,
                      height: 70,
                      borderRadius: 35,
                      overflow: 'hidden',
  },
                      avatarImage: {
                        width: '100%',
                      height: '100%',
  },
                      doctorInfo: {
                        flex: 1,
                      paddingLeft: 14,
                      justifyContent: 'center',
  },
                      doctorName: {
                        fontSize: 16,
                      lineHeight: 20,
  },
                      doctorSpeciality: {
                        fontSize: 13,
                      lineHeight: 17,
                      marginTop: 2,
  },
                      doctorDegrees: {
                        fontSize: 11.5,
                      lineHeight: 15,
                      marginTop: 2,
  },
                      ratingRow: {
                        flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 4,
  },
                      doctorRightCol: {
                        alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      height: 64,
  },
                      bookmarkButton: {
                        padding: 2,
  },
                      availablePill: {
                      paddingHorizontal: 10,
                      paddingVertical: 3.5,
                      borderRadius: 12,
  },
                      availableText: {
                        fontSize: 11,
                      lineHeight: 13,
  },
});
