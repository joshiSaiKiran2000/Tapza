import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Moon,
  Sun,
  ShieldCheck,
  Flame,
} from 'lucide-react-native';
import { useTheme, useThemeController } from '../theme';
import { useRemoteConfig } from '../hooks/useRemoteConfig';
import { AppText, AppCard, AppBadge, AppHeader } from '../components/common';
import type { TabScreenProps } from '../types/navigation';

export const ProfileScreen: React.FC<TabScreenProps<'Profile'>> = () => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeController();
  const { activeConfigId, switchTheme } = useRemoteConfig();
  const isDiwaliMode = activeConfigId === 'diwali';

  const handleToggleDiwali = async (val: boolean) => {
    await switchTheme(val ? 'diwali' : 'normal');
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader
        title="Profile"
        subtitle="Account settings & preferences"
        style={{ backgroundColor: theme.colors.surface }}
      />
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing.md, backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <AppCard style={styles.userCard}>
          <View style={styles.avatarRow}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                <User size={30} color={theme.colors.white} />
              </View>
              <View style={styles.avatarInfo}>
                <AppText variant="lg" weight="bold" color={theme.colors.text}>
                  Aarav Sharma
                </AppText>
                <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                  +91 98765 43210 • Hyderabad, Telangana
                </AppText>
                <AppBadge label="Verified Patient" variant="success" style={{ marginTop: 6 }} />
              </View>
            </View>
        </AppCard>

        {/* Preferences */}
        <AppText
          variant="md"
          weight="bold"
          color={theme.colors.text}
          style={{ marginVertical: theme.spacing.sm }}
        >
          App Settings
        </AppText>

        {/* 1. Diwali Festive Mode Switch */}
        <AppCard style={{ marginBottom: theme.spacing.sm }}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconText}>
              <View
                style={[
                  styles.diwaliIconContainer,
                  {
                    backgroundColor: isDiwaliMode
                      ? '#FFEDD5'
                      : theme.colors.surfaceVariant,
                  },
                ]}
              >
                <Flame
                  size={20}
                  color={isDiwaliMode ? '#C2410C' : theme.colors.textSecondary}
                  fill={isDiwaliMode ? '#F59E0B' : 'none'}
                />
              </View>
                  <View style={{ marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AppText variant="md" weight="medium" color={theme.colors.text}>
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
                  <AppText variant="xs" color={theme.colors.textSecondary}>
                    {isDiwaliMode
                      ? 'Diwali offers & festive decoration active'
                      : 'Off • Normal healthcare offers'}
                  </AppText>
              </View>
          </View>
          <Switch
            testID="diwali-mode-switch"
            accessibilityRole="switch"
            accessibilityLabel="Toggle Diwali mode"
            value={isDiwaliMode}
            onValueChange={handleToggleDiwali}
            trackColor={{
              false: theme.colors.border,
              true: '#FED7AA',
            }}
            thumbColor={isDiwaliMode ? '#C2410C' : theme.colors.surfaceVariant}
          />
        </View>
      </AppCard>

              {/* 2. Dark Mode Switch */ }
              < AppCard style={{ marginBottom: theme.spacing.sm }}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconText}>
                {isDark ? (
                  <Moon size={20} color={theme.colors.primary} />
                ): (
                    <Sun size = { 20 } color = {theme.colors.primary} />
              )}
            <View style={{ marginLeft: 12 }}>
              <AppText variant="md" weight="medium" color={theme.colors.text}>
                Dark Mode
              </AppText>
                    <AppText variant="xs" color={theme.colors.textSecondary}>
                      {isDark ? 'Dark mode enabled' : 'Light mode enabled'}
                    </AppText>
                </View>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                  thumbColor={isDark ? theme.colors.primary : theme.colors.surfaceVariant}
                />
            </View>
          </AppCard>

          {/* 3. Language Setting */}
          <AppCard style={{ marginBottom: theme.spacing.sm }}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconText}>
                <ShieldCheck size={20} color={theme.colors.primary} />
                <View style={{ marginLeft: 12 }}>
                  <AppText variant="md" weight="medium" color={theme.colors.text}>
                    Language (भाषा)
                  </AppText>
                    <AppText variant="xs" color={theme.colors.textSecondary}>
                      English / हिन्दी
                    </AppText>
                </View>
        </View>
        <AppBadge label="EN / HI" variant="secondary" />
      </View>
    </AppCard>

        {/* About App */ }
        <AppText
          variant="md"
          weight="bold"
          color={theme.colors.text}
          style={{ marginVertical: theme.spacing.sm }}
        >
          About Tapza Care
        </AppText>

        <AppCard>
          <View style={styles.infoRow}>
            <AppText variant="sm" color={theme.colors.textSecondary}>
              Application Version
            </AppText>
            <AppText variant="sm" weight="semibold" color={theme.colors.text}>
              v1.0.0 (Expo SDK 58)
            </AppText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.infoRow}>
            <AppText variant="sm" color={theme.colors.textSecondary}>
              Region Support
            </AppText>
            <AppText variant="sm" weight="semibold" color={theme.colors.primary}>
              Hyderabad, India
            </AppText>
          </View>
        </AppCard>
      </ScrollView >
    </SafeAreaView >
  );
};

    const styles = StyleSheet.create({
      safeArea: {
        flex: 1,
      },
        content: {
          paddingBottom: 28,
        },
          userCard: {
            marginBottom: 16,
            borderRadius: 18,
          },
            avatarRow: {
              flexDirection: 'row',
              alignItems: 'center',
            },
              avatar: {
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
              },
                avatarInfo: {
                  marginLeft: 14,
                  flex: 1,
                },
                  settingRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 44,
                  },
                    settingIconText: {
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                      marginRight: 10,
                    },
                      diwaliIconContainer: {
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                        infoRow: {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: 4,
                        },
                        divider: {
                          height: 1,
                          marginVertical: 10,
                        },
                      });
