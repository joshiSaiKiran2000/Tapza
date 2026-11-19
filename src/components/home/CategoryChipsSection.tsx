import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Stethoscope,
  FlaskConical,
  ShieldPlus,
  Bandage,
  Heart,
  Baby,
  Smile,
  Activity,
  Sparkles,
  LucideIcon,
} from 'lucide-react-native';
import { CategoryChipsData, CategoryChipItem, BackgroundConfig } from '../../config/types';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';

const iconMap: Record<string, LucideIcon> = {
  Consult: Stethoscope,
  'Lab Tests': FlaskConical,
  Pharmacy: ShieldPlus,
  Vaccines: Bandage,
  Stethoscope,
  FlaskConical,
  ShieldPlus,
  Bandage,
  Heart,
  Baby,
  Smile,
  Activity,
  Sparkles,
};

// Pastel color palette matching the screenshot
const pastelPalette = [
  { bg: '#E0F2FE', icon: '#0284C7' }, // Soft Sky Blue
  { bg: '#F3E8FF', icon: '#9333EA' }, // Soft Lavender/Purple
  { bg: '#DCFCE7', icon: '#16A34A' }, // Soft Mint Green
  { bg: '#FFEDD5', icon: '#EA580C' }, // Soft Peach/Orange
  { bg: '#FEE2E2', icon: '#DC2626' }, // Soft Rose
  { bg: '#FEF3C7', icon: '#D97706' }, // Soft Amber
];

interface CategoryChipsSectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  background: BackgroundConfig;
  data: CategoryChipsData;
  onSelectCategory?: (category: CategoryChipItem) => void;
}

export const CategoryChipsSection: React.FC<CategoryChipsSectionProps> = ({
  title,
  subtitle,
  background,
  data,
  onSelectCategory,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedId, setSelectedId] = useState<string>(data.categories[0]?.id || 'cat-1');

  const handlePress = (cat: CategoryChipItem) => {
    setSelectedId(cat.id);
    onSelectCategory?.(cat);
    // Navigate to doctor details or doctors list
    navigation.navigate('DoctorDetails', { doctorId: 'doc-1' });
  };

  // We display the top 4 services across the screen row as shown in the design
  const displayItems = data.categories.slice(0, 4);

  return (
    <SectionBackground background={background} style={styles.sectionContainer}>
      {title ? (
        <View style={styles.headerRow}>
          <AppText variant="md" weight="bold" color={theme.colors.text}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      ) : null}
      <View style={styles.tilesRow}>
        {displayItems.map((cat, index) => {
          const colorPair = pastelPalette[index % pastelPalette.length];
          const IconComponent =
            iconMap[cat.label] || iconMap[cat.icon] || Stethoscope;

          return (
            <TouchableOpacity
              key={cat.id}
              accessibilityRole="button"
              accessibilityLabel={`${cat.label} service tile`}
              activeOpacity={0.75}
              onPress={() => handlePress(cat)}
              style={styles.tileWrapper}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              {/* Rounded Square with soft pastel background */}
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: colorPair.bg,
                  },
                ]}
              >
                <IconComponent size={24} color={colorPair.icon} />
              </View>

              {/* Label underneath */}
              <AppText
                variant="xs"
                weight="semibold"
                color={theme.colors.text}
                align="center"
                style={styles.tileLabel}
                numberOfLines={1}
              >
                {cat.label}
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
    marginVertical: 8,
  },
  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  tilesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  tileWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 78,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tileLabel: {
    marginTop: 8,
    fontSize: 12,
  },
});
