import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Phone,
  MapPin,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react-native';
import { useTheme, useThemeController } from '../theme';
import { AppText, AppCard, AppBadge, AppHeader } from '../components/common';
import type { TabScreenProps } from '../types/navigation';

export const ProfileScreen: React.FC<TabScreenProps<'Profile'>> = () => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeController();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}
    >
      <AppHeader
        title="Profile"
        subtitle="Account settings & preferences"
        style={{ backgroundColor: '#FFFFFF' }}
      />
      <ScrollView
        style={{ backgroundColor: '#FFFFFF' }}
        contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <AppCard style={styles.userCard}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: '#0D9488' }]}>
              <User size={30} color="#FFFFFF" />
            </View>
            <View style={styles.avatarInfo}>
              <AppText variant="lg" weight="bold" color="#0F172A">
                Aarav Sharma
              </AppText>
              <AppText variant="xs" color="#64748B" style={{ marginTop: 2 }}>
                +91 98765 43210 • Hyderabad, Telangana
              </AppText>
              <AppBadge label="Verified Patient" variant="success" style={{ marginTop: 6 }} />
            </View>
          </View>
        </AppCard>

        {/* Preferences */}
        <AppText variant="md" weight="bold" color="#0F172A" style={{ marginVertical: theme.spacing.sm }}>
          App Settings
        </AppText>

        <AppCard style={{ marginBottom: theme.spacing.sm }}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconText}>
              {isDark ? (
                <Moon size={20} color="#0D9488" />
              ) : (
                <Sun size={20} color="#0D9488" />
              )}
              <View style={{ marginLeft: 12 }}>
                <AppText variant="md" weight="medium" color="#0F172A">
                  Dark Mode
                </AppText>
                <AppText variant="xs" color="#64748B">
                  {isDark ? 'Dark mode enabled' : 'Light mode enabled'}
                </AppText>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E2E8F0', true: '#99F6E4' }}
              thumbColor={isDark ? '#0D9488' : '#F1F5F9'}
            />
          </View>
        </AppCard>

        <AppCard style={{ marginBottom: theme.spacing.sm }}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconText}>
              <ShieldCheck size={20} color="#0D9488" />
              <View style={{ marginLeft: 12 }}>
                <AppText variant="md" weight="medium" color="#0F172A">
                  Language (भाषा)
                </AppText>
                <AppText variant="xs" color="#64748B">
                  English / हिन्दी
                </AppText>
              </View>
            </View>
            <AppBadge label="EN / HI" variant="secondary" />
          </View>
        </AppCard>

        {/* About App */}
        <AppText variant="md" weight="bold" color="#0F172A" style={{ marginVertical: theme.spacing.sm }}>
          About Tapza Care
        </AppText>

  <AppCard>
    <View style={styles.infoRow}>
      <AppText variant="sm" color="#64748B">
        Application Version
      </AppText>
      <AppText variant="sm" weight="semibold" color="#0F172A">
        v1.0.0 (Expo SDK 58)
      </AppText>
    </View>
    <View style={[styles.divider, { backgroundColor: '#F1F5F9' }]} />
    <View style={styles.infoRow}>
      <AppText variant="sm" color="#64748B">
        Region Support
      </AppText>
      <AppText variant="sm" weight="semibold" color="#0D9488">
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
        backgroundColor: '#FFFFFF',
      },
        content: {
          paddingBottom: 28,
          backgroundColor: '#FFFFFF',
        },
          userCard: {
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            borderRadius: 18,
            backgroundColor: '#FFFFFF',
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
