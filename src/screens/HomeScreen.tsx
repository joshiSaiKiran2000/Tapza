import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Sliders,
  Sparkles,
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
import { DynamicSectionRenderer } from '../components/home';
import { useRemoteConfig } from '../hooks/useRemoteConfig';
import type { TabScreenProps } from '../types/navigation';

export const HomeScreen: React.FC<TabScreenProps<'Home'>> = ({ navigation }) => {
  const theme = useTheme();
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
  const scrollY = React.useRef(new Animated.Value(0)).current;

    // Header elevation shadow on scroll
    const headerElevation = scrollY.interpolate({
      inputRange: [0, 20],
      outputRange: [0, 4],
      extrapolate: 'clamp',
    });

    return(
        < SafeAreaView
      edges = { ['top', 'left', 'right']}
      style = { [styles.safeArea, { backgroundColor: theme.colors.background }]}
        >
        {/* Top Header with Hyderabad Location & Dev Settings trigger */ }
        < Animated.View
        style = {
        [
        styles.topBar,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          elevation: headerElevation,
        },
        ]}
        >
        <View style={styles.topBarLeft}>
          <View style={styles.locationRow}>
            <MapPin size={16} color={theme.colors.primary} />
            <AppText variant="sm" weight="bold" style={{ marginLeft: 4 }} numberOfLines={1}>
              Banjara Hills, Hyderabad
            </AppText>
          </View>
          <AppText variant="xs" color={theme.colors.textMuted} numberOfLines={1} style={{ marginTop: 1 }}>
            Care Hospitals & 24 Clinics nearby
          </AppText>
        </View>

        <View style={styles.topBarRight}>
          {/* Active Config Indicator Pill */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Switch remote configuration theme"
            onPress={() => setDevModalVisible(true)}
            style={[
              styles.themeBadgePill,
              {
                backgroundColor:
                  activeConfigId === 'diwali'
                    ? '#FFEDD5'
                    : theme.colors.primaryLight,
                borderColor:
                  activeConfigId === 'diwali'
                    ? '#C2410C'
                    : theme.colors.primary,
              },
            ]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            {activeConfigId === 'diwali' ? (
              <Sparkles size={12} color="#C2410C" style={{ marginRight: 3 }} />
            ) : null}
            <AppText
              variant="xs"
              weight="bold"
              color={activeConfigId === 'diwali' ? '#C2410C' : theme.colors.primary}
              style={{ fontSize: 11 }}
            >
              {activeConfigId === 'diwali' ? '🪔 Diwali' : 'Teal'}
            </AppText>
          </TouchableOpacity>

  {/* Developer / Admin Controls Modal Trigger */ }
  < TouchableOpacity
accessibilityRole = "button"
accessibilityLabel = "Open Developer Controls"
onPress = {() => setDevModalVisible(true)}
style = { [styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}
hitSlop = {{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
  <Sliders size={18} color={theme.colors.text} />
          </TouchableOpacity >
        </View >
      </Animated.View >

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
  )
}

      {/* Main Content Area */}
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
          {/* Dynamic Section Renderer with Hero Parallax scrollY passed */}
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

          <View style={{ height: 24 }} />
        </ Animated.ScrollView>
      )}

      {/* Developer Controls Modal */ }
  <DeveloperSettingsModal
    visible={devModalVisible}
    onClose={() => setDevModalVisible(false)}
    onConfigSwitched={(targetId) => {
      switchTheme(targetId);
      setDevModalVisible(false);
    }}
    activeConfigId={activeConfigId}
  />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
    },
      topBarLeft: {
        flex: 1,
        paddingRight: 10,
      },
        locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
          topBarRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          },
            themeBadgePill: {
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: 14,
              borderWidth: 1,
            },
              iconButton: {
                width: 38,
                height: 38,
                borderRadius: 19,
                alignItems: 'center',
                justifyContent: 'center',
              },
                offlineBanner: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                },
                  scrollContent: {
                    paddingBottom: 24,
                  },
                });
