import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Flame,
  Palette,
  Type,
  RotateCcw,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react-native';
import { useTheme, useThemeController, FontScale } from '../theme';
import { useRemoteConfig } from '../hooks/useRemoteConfig';
import { AppText, AppCard, AppBadge, AppButton } from '../components/common';
import type { RootStackScreenProps } from '../types/navigation';

// Curated Background Color Palettes
const BG_PALETTES = [
  { label: 'Default Slate', color: '#F8FAFC', textColor: '#0F172A' },
  { label: 'Crisp White', color: '#FFFFFF', textColor: '#0F172A' },
  { label: 'Warm Cream', color: '#FFFBEB', textColor: '#78350F' },
  { label: 'Mint Mist', color: '#F0FDF4', textColor: '#064E3B' },
  { label: 'Soft Rose', color: '#FFF1F2', textColor: '#881337' },
  { label: 'Lavender Sky', color: '#FAF5FF', textColor: '#581C87' },
  { label: 'Midnight Navy', color: '#0F172A', textColor: '#F8FAFC' },
  { label: 'Deep Charcoal', color: '#18181B', textColor: '#F4F4F5' },
];

// Curated Text Color Palettes
const TEXT_PALETTES = [
  { label: 'Default Slate', color: '#0F172A' },
  { label: 'Pure Black', color: '#000000' },
  { label: 'Deep Indigo', color: '#1E1B4B' },
  { label: 'Emerald Forest', color: '#064E3B' },
  { label: 'Royal Ruby', color: '#881337' },
  { label: 'Warm Amber', color: '#78350F' },
  { label: 'Cobalt Blue', color: '#1D4ED8' },
  { label: 'Pure White', color: '#FFFFFF' },
];

const FONT_SCALES: { id: FontScale; label: string; desc: string }[] = [
  { id: 'small', label: 'Small', desc: '88% • Compact' },
  { id: 'normal', label: 'Normal', desc: '100% • Standard' },
  { id: 'large', label: 'Large', desc: '116% • Comfortable' },
  { id: 'xl', label: 'Extra Large', desc: '132% • High Visibility' },
];

export const AdminPanelScreen: React.FC<RootStackScreenProps<'AdminPanel'>> = ({ navigation }) => {
  const theme = useTheme();
  const {
    customBgColor,
    customTextColor,
    fontScale,
    setCustomBackgroundColor,
    setCustomTextColor,
    setFontScale,
    resetCustomStyles,
  } = useThemeController();

  const { activeConfigId, switchTheme } = useRemoteConfig();
  const isDiwaliMode = activeConfigId === 'diwali';

  const [customBgInput, setCustomBgInput] = useState('');
  const [customTextInput, setCustomTextInput] = useState('');

  const handleToggleDiwali = async (val: boolean) => {
    await switchTheme(val ? 'diwali' : 'normal');
  };

  const handleApplyCustomBg = () => {
    const trimmed = customBgInput.trim();
    if (!trimmed.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
      Alert.alert('Invalid Hex Color', 'Please enter a valid hex color code (e.g. #F0F4F8).');
      return;
    }
    setCustomBackgroundColor(trimmed);
    setCustomBgInput('');
  };

  const handleApplyCustomText = () => {
    const trimmed = customTextInput.trim();
    if (!trimmed.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
      Alert.alert('Invalid Hex Color', 'Please enter a valid hex color code (e.g. #1E293B).');
      return;
    }
    setCustomTextColor(trimmed);
    setCustomTextInput('');
  };

  const handleReset = () => {
    resetCustomStyles();
    Alert.alert('Styles Reset', 'Background color, text color, and font scale restored to defaults.');
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      {/* Top Header */}
      <View style={[styles.headerBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <AppText variant="lg" weight="bold" color={theme.colors.text}>
            Admin Panel
          </AppText>
          <AppText variant="xs" color={theme.colors.textSecondary}>
            Diwali mode, colors & typography customizations
          </AppText>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Reset styles"
          onPress={handleReset}
          style={styles.resetHeaderBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <RotateCcw size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing.md, backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. LIVE PREVIEW CARD */}
        <AppText variant="xs" weight="bold" color={theme.colors.textSecondary} style={styles.sectionHeader}>
          LIVE REAL-TIME PREVIEW
        </AppText>
        <AppCard style={[styles.previewCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
          <View style={styles.previewHeaderRow}>
            <Layers size={18} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <AppText variant="sm" weight="bold" color={theme.colors.text}>
              Screen & Typography Preview
            </AppText>
          </View>

          <AppText variant="lg" weight="bold" color={theme.colors.text} style={{ marginTop: 8 }}>
            Tapza Healthcare System
          </AppText>
          <AppText variant="sm" color={theme.colors.text} style={{ marginTop: 4 }}>
            This text dynamically adapts to your selected font size and text color. The card background reflects your customized screen background.
          </AppText>

          <View style={styles.previewPillsRow}>
            <AppBadge
              label={`BG: ${customBgColor || 'Default'}`}
              variant="info"
              style={{ marginRight: 6, marginBottom: 4 }}
            />
            <AppBadge
              label={`Text: ${customTextColor || 'Default'}`}
              variant="info"
              style={{ marginRight: 6, marginBottom: 4 }}
            />
            <AppBadge
              label={`Font: ${fontScale.toUpperCase()}`}
              variant="primary"
              style={{ marginRight: 6, marginBottom: 4 }}
            />
            <AppBadge
              label={isDiwaliMode ? '🪔 Diwali ON' : 'Diwali OFF'}
              variant={isDiwaliMode ? 'secondary' : 'info'}
              style={{ marginBottom: 4 }}
            />
          </View>
        </AppCard>

        {/* 2. DIWALI FESTIVE MODE SECTION */}
        <AppText variant="xs" weight="bold" color={theme.colors.textSecondary} style={styles.sectionHeader}>
          FESTIVAL & PROMOTIONS
        </AppText>
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconText}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isDiwaliMode ? '#FFEDD5' : theme.colors.surfaceVariant },
                ]}
              >
                <Flame
                  size={22}
                  color={isDiwaliMode ? '#C2410C' : theme.colors.textSecondary}
                  fill={isDiwaliMode ? '#F59E0B' : 'none'}
                />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppText variant="md" weight="bold" color={theme.colors.text}>
                    Diwali Mode
                  </AppText>
                  {isDiwaliMode && (
                    <AppBadge
                      label="🪔 Active"
                      variant="secondary"
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </View>
                <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                  {isDiwaliMode
                    ? 'Festive offers (DIWALI35), Toran decoration & warm theme active'
                    : 'Off • Standard clinical offers (FIRSTCARE) & normal layout'}
                </AppText>
              </View>
            </View>
            <Switch
              testID="admin-diwali-mode-switch"
              accessibilityRole="switch"
              accessibilityLabel="Toggle Diwali mode"
              value={isDiwaliMode}
              onValueChange={handleToggleDiwali}
              trackColor={{ false: theme.colors.border, true: '#FED7AA' }}
              thumbColor={isDiwaliMode ? '#C2410C' : theme.colors.surfaceVariant}
            />
          </View>
        </AppCard>

        {/* 3. BACKGROUND COLOR SECTION */}
        <AppText variant="xs" weight="bold" color={theme.colors.textSecondary} style={styles.sectionHeader}>
          SCREEN BACKGROUND COLOR
        </AppText>
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.paletteGrid}>
            {BG_PALETTES.map((item) => {
              const isSelected = customBgColor === item.color || (!customBgColor && item.color === '#F8FAFC');
              return (
                <TouchableOpacity
                  key={`bg-${item.color}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Select background ${item.label}`}
                  onPress={() => setCustomBackgroundColor(item.color)}
                  style={[
                    styles.paletteChip,
                    {
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: item.color, borderColor: '#CBD5E1' }]}>
                    {isSelected && <Check size={14} color={item.textColor || '#0F172A'} />}
                  </View>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <AppText variant="xs" weight="bold" color={theme.colors.text} numberOfLines={1}>
                      {item.label}
                    </AppText>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      {item.color}
                    </AppText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Hex Color Input */}
          <View style={[styles.customInputRow, { borderTopColor: theme.colors.border }]}>
            <TextInput
              style={[
                styles.hexInput,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="#E2E8F0"
              placeholderTextColor={theme.colors.textMuted}
              value={customBgInput}
              onChangeText={setCustomBgInput}
              autoCapitalize="characters"
              maxLength={7}
            />
            <AppButton
              title="Set Custom BG"
              size="sm"
              variant="outline"
              onPress={handleApplyCustomBg}
              style={{ marginLeft: 8 }}
            />
          </View>
        </AppCard>

        {/* 4. TEXT COLOR SECTION */}
        <AppText variant="xs" weight="bold" color={theme.colors.textSecondary} style={styles.sectionHeader}>
          TEXT & TYPOGRAPHY COLOR
        </AppText>
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.paletteGrid}>
            {TEXT_PALETTES.map((item) => {
              const isSelected = customTextColor === item.color || (!customTextColor && item.color === '#0F172A');
              return (
                <TouchableOpacity
                  key={`text-${item.color}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Select text color ${item.label}`}
                  onPress={() => setCustomTextColor(item.color)}
                  style={[
                    styles.paletteChip,
                    {
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: item.color, borderColor: '#CBD5E1' }]}>
                    {isSelected && <Check size={14} color={item.color === '#FFFFFF' ? '#0F172A' : '#FFFFFF'} />}
                  </View>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <AppText variant="xs" weight="bold" color={theme.colors.text} numberOfLines={1}>
                      {item.label}
                    </AppText>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      {item.color}
                    </AppText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Hex Text Color Input */}
          <View style={[styles.customInputRow, { borderTopColor: theme.colors.border }]}>
            <TextInput
              style={[
                styles.hexInput,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="#1E293B"
              placeholderTextColor={theme.colors.textMuted}
              value={customTextInput}
              onChangeText={setCustomTextInput}
              autoCapitalize="characters"
              maxLength={7}
            />
            <AppButton
              title="Set Custom Text"
              size="sm"
              variant="outline"
              onPress={handleApplyCustomText}
              style={{ marginLeft: 8 }}
            />
          </View>
        </AppCard>

        {/* 5. FONT SIZE & SCALING SECTION */}
        <AppText variant="xs" weight="bold" color={theme.colors.textSecondary} style={styles.sectionHeader}>
          FONT SIZE & SCALING
        </AppText>
        <AppCard style={{ marginBottom: theme.spacing.lg }}>
          <View style={styles.fontScaleRow}>
            {FONT_SCALES.map((item) => {
              const isSelected = fontScale === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Font size ${item.label}`}
                  onPress={() => setFontScale(item.id)}
                  style={[
                    styles.fontScaleCard,
                    {
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: isSelected ? theme.colors.primaryLight : theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Type
                      size={item.id === 'small' ? 14 : item.id === 'normal' ? 17 : item.id === 'large' ? 20 : 23}
                      color={isSelected ? theme.colors.primary : theme.colors.text}
                    />
                    {isSelected && (
                      <Check size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
                    )}
                  </View>
                  <AppText
                    variant="sm"
                    weight="bold"
                    color={isSelected ? theme.colors.primary : theme.colors.text}
                    style={{ marginTop: 6 }}
                  >
                    {item.label}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                    {item.desc}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </AppCard>

        {/* Revert / Reset Button */}
        <AppButton
          title="Reset All Theme Styles to Defaults"
          variant="outline"
          size="md"
          icon={<RotateCcw size={16} color={theme.colors.error} />}
          onPress={handleReset}
          style={{ borderColor: theme.colors.error, marginBottom: 24 }}
          textStyle={{ color: theme.colors.error }}
        />
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleGroup: {
    flex: 1,
  },
  resetHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 32,
  },
  sectionHeader: {
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
    marginLeft: 2,
  },
  previewCard: {
    marginBottom: 16,
    borderWidth: 1.5,
    borderRadius: 16,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  settingIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  paletteChip: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  colorSwatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  hexInput: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  fontScaleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fontScaleCard: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 12,
    borderRadius: 14,
  },
});
