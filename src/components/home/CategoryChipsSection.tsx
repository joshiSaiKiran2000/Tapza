import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Heart,
  Baby,
  Stethoscope,
  Smile,
  Activity,
  Sparkles,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react-native';
import { CategoryChipsData, CategoryChipItem, BackgroundConfig } from '../../config/types';
import { useTheme } from '../../theme';
import { AppText } from '../common';
import { SectionBackground } from './SectionBackground';

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Baby,
  Stethoscope,
  Smile,
  Activity,
  Sparkles,
  ShieldCheck,
};

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
  const [selectedId, setSelectedId] = useState<string>(data.categories[0]?.id || 'cat-all');

  const handlePress = (cat: CategoryChipItem) => {
    setSelectedId(cat.id);
    onSelectCategory?.(cat);
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
        {data.categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const IconComponent = iconMap[cat.icon] || Sparkles;

          const chipBg = isSelected
            ? theme.colors.primary
            : cat.isSpecial
              ? theme.colors.secondaryLight
              : theme.colors.surface;

          const chipBorder = isSelected
            ? theme.colors.primary
            : cat.isSpecial
              ? theme.colors.secondary
              : theme.colors.border;

          const textColor = isSelected
            ? theme.colors.white
            : cat.isSpecial
              ? theme.colors.secondary
              : theme.colors.text;

          const iconColor = isSelected
            ? theme.colors.white
            : cat.isSpecial
              ? theme.colors.secondary
              : theme.colors.primary;

          return (
            <TouchableOpacity
              key={cat.id}
              accessibilityRole="button"
              accessibilityLabel={`${cat.label} category chip`}
              accessibilityState={{ selected: isSelected }}
              activeOpacity={0.7}
              onPress={() => handlePress(cat)}
              style={[
                styles.chip,
                {
                  backgroundColor: chipBg,
                  borderColor: chipBorder,
                  borderRadius: theme.borderRadius.full,
                  marginRight: theme.spacing.sm,
                  minHeight: 44,
                  minWidth: 44,
                },
              ]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <IconComponent size={16} color={iconColor} style={{ marginRight: 6 }} />
              <View>
                <AppText variant="sm" weight={isSelected ? 'bold' : 'medium'} color={textColor}>
                  {cat.label}
                </AppText>
                {cat.hindiLabel ? (
                  <AppText
                    variant="xs"
                    color={isSelected ? 'rgba(255,255,255,0.8)' : theme.colors.textMuted}
                    style={{ fontSize: 10, lineHeight: 12 }}
                  >
                    {cat.hindiLabel}
                  </AppText>
                ) : null}
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
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
});
