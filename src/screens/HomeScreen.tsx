import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Zap,
  ChevronDown,
  Search,
  User,
  AlertTriangle,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  HomeScreenSkeleton,
  DeveloperSettingsModal,
  ErrorState,
  EmptyState,
} from '../components/common';
import { DynamicSectionRenderer, DiwaliDecoration } from '../components/home';
import { useRemoteConfig } from '../hooks/useRemoteConfig';
import type { TabScreenProps } from '../types/navigation';

export const HomeScreen: React.FC<TabScreenProps<'Home'>> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0
  );

  const {
    config,
    loading,
    refreshing,
    error,
    isFromCache,
    activeConfigId,
    refresh,
    switchTheme,
  } = useRemoteConfig();

  const [devModalVisible, setDevModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.colors.background,
          paddingTop: topInset,
        },
      ]}
    >
      {/* Offline Cache Notice if applicable */}
      {isFromCache && (
        <View style={[styles.offlineBanner, { backgroundColor: theme.colors.warningLight }]}>
          <AlertTriangle size={14} color={theme.colors.warning} style={{ marginRight: 6 }} />
          <AppText variant="xs" weight="medium" color={theme.colors.text} style={{ flex: 1 }}>
            Showing cached content. Offline-ready healthcare.
          </AppText>
          <TouchableOpacity onPress={refresh} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <AppText variant="xs" weight="bold" color={theme.colors.primary}>
              Retry
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Scrollable Content */}
      {loading && !config ? (
        <HomeScreenSkeleton />
      ) : error && !config ? (
        <ErrorState
          title="Unable to Load Home Screen"
          message={error}
          onRetry={refresh}
        />
      ) : (
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {/* 1. TOP HEADER (⚡ 15 minutes + Location + Down Arrow + Cashback Pill + Profile Icon) */}
          <View style={styles.topBrandBar}>
            {/* Left: ⚡ 15 minutes + Location + Down arrow */}
            <View style={styles.locationContainer}>
              <View style={styles.deliveryTimeRow}>
                <Zap size={19} color={theme.colors.text} fill={theme.colors.text} style={{ marginRight: 6 }} />
                <AppText variant="lg" weight="bold" color={theme.colors.text} style={styles.deliveryTimeText}>
                  15 minutes
                </AppText>
                {activeConfigId === 'diwali' && (
                  <View style={styles.diwaliPill}>
                    <AppText variant="xs" weight="bold" color="#C2410C">
                      🪔 Diwali
                    </AppText>
                  </View>
                )}
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.addressRow}
                accessibilityRole="button"
                accessibilityLabel="Select location"
                onPress={() => setDevModalVisible(true)}
              >
                <AppText
                  variant="xs"
                  weight="medium"
                  color={theme.colors.textSecondary}
                  numberOfLines={1}
                  style={styles.addressText}
                >
                  Other - 543, 18-3-59/1, Banjara Hills, Hyd...
                </AppText>
                <ChevronDown size={14} color={theme.colors.text} style={{ marginLeft: 3 }} />
              </TouchableOpacity>
            </View>

            {/* Right: Profile Icon */}
            <View style={styles.brandRight}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Profile"
                onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
                onLongPress={() => setDevModalVisible(true)}
                style={[
                  styles.profileCircleButton,
                  {
                    borderColor: theme.colors.text,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <User size={19} color={theme.colors.text} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. SEARCH BAR (Navigates to DoctorSearch on tap) */}
          <TouchableOpacity
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Search doctors, tests, or services"
            onPress={() => navigation.navigate('DoctorSearch')}
            style={styles.searchContainer}
          >
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Search size={18} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
              <AppText variant="sm" color={theme.colors.textMuted} style={{ flex: 1 }}>
                Search doctors, tests, or services...
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Diwali Festive Decoration (only active when in Diwali Mode) */}
          {activeConfigId === 'diwali' && <DiwaliDecoration />}

          {/* 4. DYNAMIC HOME SECTIONS RENDERED ACCORDING TO REMOTE CONFIG */}
          {config?.sections.map((section) => (
            <DynamicSectionRenderer
              key={section.id}
              section={section}
              scrollY={scrollY}
            />
          ))}

          {/* Safe empty state if config had 0 sections */}
          {config?.sections.length === 0 && (
            <EmptyState
              title="No Sections Configured"
              description="Pull down to refresh or check Developer Controls to reset active configuration."
              actionTitle="Refresh Remote Config"
              onAction={refresh}
            />
          )}

          <View style={{ height: 28 }} />
        </Animated.ScrollView>
      )
      }

      {/* Developer Controls Modal */}
      <DeveloperSettingsModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
        onConfigSwitched={(targetId) => {
          switchTheme(targetId);
          setDevModalVisible(false);
        }}
        activeConfigId={activeConfigId}
      />
    </View >
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  topBrandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  locationContainer: {
    flex: 1,
    paddingRight: 8,
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diwaliPill: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  deliveryTimeText: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 23,
    letterSpacing: -0.3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  addressText: {
    fontSize: 12,
    lineHeight: 16,
    maxWidth: 220,
  },
  brandRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileCircleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
