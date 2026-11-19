import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pill,
  ChevronRight,
  Stethoscope,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  AppButton,
  AppCard,
  AppBadge,
  AppHeader,
  PrescriptionListSkeleton,
  EmptyState,
  ErrorState,
} from '../components/common';
import { DoseProgressBar } from '../components/prescriptions';
import { usePrescriptions } from '../hooks/usePrescriptions';
import type { TabScreenProps } from '../types/navigation';

export const PrescriptionsScreen: React.FC<TabScreenProps<'Prescriptions'>> = ({ navigation }) => {
  const theme = useTheme();
  const {
    prescriptions,
    loading,
    refreshing,
    error,
    doseProgress,
    refresh,
  } = usePrescriptions();

  return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      >
        <AppHeader
          title="Prescriptions & Reminders"
          subtitle="Manage medicines, timings & daily dose tracker"
        />

        {loading && !refreshing ? (
          <PrescriptionListSkeleton />
        ) : error && prescriptions.length === 0 ? (
          <ErrorState
            title="Could Not Load Prescriptions"
            message={error}
            onRetry={refresh}
          />
        ) : prescriptions.length === 0 ? (
          <EmptyState
            icon={Pill}
            title="No Prescriptions Found"
            description="You do not have any active or past electronic prescriptions logged."
            actionTitle="Refresh"
            onAction={refresh}
          />
        ) : (
          <ScrollView
            contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          >
            {/* Daily Dose Progress Tracker */}
            <DoseProgressBar
              totalDoses={doseProgress.total}
              completedDoses={doseProgress.completed}
            />

            <AppText variant="md" weight="bold" style={{ marginBottom: theme.spacing.sm }}>
              Your Prescriptions ({prescriptions.length})
            </AppText>

            {prescriptions.map((rx) => {
              const isActive = rx.status === 'active';
              return (
                <AppCard key={rx.id} style={{ marginBottom: theme.spacing.md }}>
                  <View style={styles.cardHeader}>
                    <View
                      style={[
                        styles.iconBox,
                        {
                          backgroundColor: isActive
                            ? theme.colors.primaryLight
                            : theme.colors.surfaceVariant,
                        },
                      ]}
                    >
                      <Pill
                        size={22}
                        color={isActive ? theme.colors.primary : theme.colors.textMuted}
                      />
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={styles.titleRow}>
                        <AppText variant="md" weight="bold" style={{ flex: 1 }}>
                          {rx.diagnosis}
                        </AppText>
                        <AppBadge
                          label={isActive ? 'Active Course' : 'Completed'}
                          variant={isActive ? 'success' : 'info'}
                        />
                      </View>

                      {rx.diagnosisHindi ? (
                        <AppText variant="xs" color={theme.colors.textMuted} style={{ fontStyle: 'italic', marginTop: 1 }}>
                          {rx.diagnosisHindi}
                        </AppText>
                      ) : null}

                      <View style={[styles.doctorRow, { marginTop: 4 }]}>
                        <Stethoscope size={14} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
                        <AppText variant="xs" color={theme.colors.textSecondary}>
                          {rx.doctorName} • {rx.clinicName}
                        </AppText>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

                  <View style={styles.infoRow}>
                    <View>
                      <AppText variant="xs" color={theme.colors.textMuted}>
                        Prescribed On
                      </AppText>
                      <AppText variant="sm" weight="semibold">
                        {rx.prescribedDate}
                      </AppText>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <AppText variant="xs" color={theme.colors.textMuted}>
                        Medicines
                      </AppText>
                      <AppText variant="sm" weight="bold" color={theme.colors.primary}>
                        {rx.medicines.length} Prescribed
                      </AppText>
                    </View>
                  </View>

                  <AppButton
                    title="View Medicines & Schedule"
                    variant="outline"
                    size="sm"
                    icon={<ChevronRight size={16} color={theme.colors.primary} />}
                    iconPosition="right"
                    style={{ marginTop: theme.spacing.md }}
                    onPress={() =>
                      navigation.navigate('PrescriptionDetails', { prescriptionId: rx.id })
                    }
                  />
                </AppCard>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
      );
                        };

      const styles = StyleSheet.create({
        safeArea: {
        flex: 1,
  },
      content: {
        paddingBottom: 24,
  },
      cardHeader: {
        flexDirection: 'row',
      alignItems: 'flex-start',
  },
      iconBox: {
        width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
  },
      titleRow: {
        flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
      doctorRow: {
        flexDirection: 'row',
      alignItems: 'center',
  },
      divider: {
        height: 1,
      marginVertical: 12,
  },
      infoRow: {
        flexDirection: 'row',
      justifyContent: 'space-between',
  },
});
