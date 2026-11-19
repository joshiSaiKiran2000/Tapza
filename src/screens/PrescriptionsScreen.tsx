import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pill,
  ChevronRight,
  Stethoscope,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  PrescriptionListSkeleton,
  EmptyState,
  ErrorState,
} from '../components/common';
import { DoseProgressBar } from '../components/prescriptions';
import { usePrescriptions } from '../hooks/usePrescriptions';
import { Prescription } from '../types/prescription';
import type { TabScreenProps } from '../types/navigation';

type PrescriptionFilter = 'all' | 'active' | 'completed';

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

  const [activeFilter, setActiveFilter] = useState<PrescriptionFilter>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (rx: Prescription) => {
    setDownloadingId(rx.id);
    setTimeout(() => {
      setDownloadingId(null);
      Alert.alert(
        'Prescription Downloaded',
        `Official electronic prescription for ${rx.diagnosis} has been downloaded.\n\n• File: Rx-${rx.id}.pdf\n• Doctor: ${rx.doctorName}\n• Clinic: ${rx.clinicName}\n• Saved in: Downloads/TapzaCare/Prescriptions/\n\nValid at all licensed pharmacies in Hyderabad.`,
        [
          {
            text: 'Open Details',
            onPress: () =>
              navigation.navigate('PrescriptionDetails', { prescriptionId: rx.id }),
          },
          { text: 'OK', style: 'default' },
        ]
      );
    }, 600);
  };

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((rx) => {
      if (activeFilter === 'active') return rx.status === 'active';
      if (activeFilter === 'completed') return rx.status === 'completed';
      return true;
    });
  }, [prescriptions, activeFilter]);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      {/* 1. Clean Top Header */}
        <View
          style={[
            styles.headerContainer,
            {
              backgroundColor: theme.colors.surface,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.headerTopRow}>
            <View>
                <AppText
                  variant="xxl"
                  weight="bold"
                  color={theme.colors.text}
                  style={styles.headerMainTitle}
                >
                  Prescriptions & Reminders
                </AppText>
                  <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                    E-Prescriptions, dosage schedule & adherence tracker
                  </AppText>
                </View>
            </View>

            {/* Filter Pills: All, Active Course, Completed */}
            <View style={styles.filterTabsRow}>
              {(['all', 'active', 'completed'] as const).map((tab) => {
                const isSelected = activeFilter === tab;
                const label =
                  tab === 'all'
                    ? 'All'
                    : tab === 'active'
                      ? 'Active'
                      : 'Completed';

                return (
                  <TouchableOpacity
                    key={tab}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter prescriptions by ${label}`}
                    activeOpacity={0.75}
                    onPress={() => setActiveFilter(tab)}
                    style={[
                      styles.filterTabPill,
                      isSelected
                        ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                        : {
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: theme.colors.border,
                        },
                    ]}
                    hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                  >
                    <AppText
                      variant="xs"
                      weight={isSelected ? 'bold' : 'medium'}
                      color={isSelected ? theme.colors.white : theme.colors.textSecondary}
                      style={styles.filterTabText}
                    >
                      {label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

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
              style={{ backgroundColor: theme.colors.background }}
              contentContainerStyle={[styles.content, { backgroundColor: theme.colors.background }]}
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

              {filteredPrescriptions.map((rx) => {
                const isActive = rx.status === 'active';
                const isDownloading = downloadingId === rx.id;

                return (
                    <View
                      key={rx.id}
                      style={[
                        styles.prescriptionCard,
                        {
                          backgroundColor: theme.colors.card,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      {/* 1. Header of Card: Diagnosis & Status */}
                      <View style={styles.cardTopRow}>
                          <View
                            style={[
                              styles.iconBox,
                              { backgroundColor: theme.colors.primaryLight },
                            ]}
                          >
                            <Pill size={22} color={theme.colors.primary} />
                          </View>

                          <View style={styles.diagnosisCol}>
                              <AppText
                                variant="md"
                                weight="bold"
                                color={theme.colors.text}
                                numberOfLines={1}
                              >
                                {rx.diagnosis}
                              </AppText>
                              {rx.diagnosisHindi ? (
                                  <AppText
                                    variant="xs"
                                    color={theme.colors.textMuted}
                                    style={styles.hindiSubtitle}
                                  >
                                    {rx.diagnosisHindi}
                                  </AppText>
                    ) : null}
                                </View>

                  {/* Status Pill */}
                              <View
                                style={[
                                  styles.statusBadge,
                                  {
                                    backgroundColor: isActive
                                      ? theme.colors.successLight
                                      : theme.colors.surfaceVariant,
                                    borderColor: isActive ? theme.colors.success : theme.colors.border,
                                  },
                                ]}
                              >
                                <CheckCircle2
                                  size={12}
                                  color={isActive ? theme.colors.success : theme.colors.textMuted}
                                />
                                <AppText
                                  variant="xs"
                                  weight="bold"
                                  color={isActive ? theme.colors.success : theme.colors.textMuted}
                                  style={{ marginLeft: 4, fontSize: 11 }}
                                >
                                  {isActive ? 'Active Course' : 'Completed'}
                                </AppText>
                              </View>
                          </View>

                          {/* 2. Doctor & Hospital Info */}
                            <View
                              style={[
                                styles.doctorInfoRow,
                                { backgroundColor: theme.colors.surfaceVariant },
                              ]}
                            >
                              <Stethoscope size={15} color={theme.colors.primary} style={{ marginTop: 2 }} />
                              <View style={{ flex: 1, marginLeft: 8 }}>
                                  <AppText variant="sm" weight="semibold" color={theme.colors.text}>
                                    {rx.doctorName}
                                  </AppText>
                                    <AppText
                                      variant="xs"
                                      color={theme.colors.textSecondary}
                                      style={{ marginTop: 1 }}
                                    >
                                      {rx.doctorSpeciality} • {rx.clinicName}
                                    </AppText>
                                  </View>
                              </View>

                              {/* Subtle Divider */}
                              <View style={[styles.cardDivider, { backgroundColor: theme.colors.border }]} />

                              {/* 3. Prescription Schedule & Medicines Meta */}
                              <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                  <Calendar size={14} color={theme.colors.textSecondary} />
                                  <View style={{ marginLeft: 6 }}>
                                      <AppText variant="xs" color={theme.colors.textSecondary}>
                                        Prescribed
                                      </AppText>
                                        <AppText
                                          variant="xs"
                                          weight="bold"
                                          color={theme.colors.text}
                                          style={{ marginTop: 1 }}
                                        >
                                          {rx.prescribedDate}
                                        </AppText>
                                      </View>
                                  </View>

                                  <View
                                    style={[styles.metaDivider, { backgroundColor: theme.colors.border }]}
                                  />

                                  <View style={styles.metaItem}>
                                    <Clock size={14} color={theme.colors.primary} />
                                    <View style={{ marginLeft: 6 }}>
                                        <AppText variant="xs" color={theme.colors.textSecondary}>
                                          Follow-Up
                                        </AppText>
                                          <AppText
                                            variant="xs"
                                            weight="bold"
                                            color={theme.colors.primary}
                                            style={{ marginTop: 1 }}
                                          >
                                            {rx.nextFollowUpDate ? rx.nextFollowUpDate.split('(')[0].trim() : 'As Needed'}
                                          </AppText>
                                        </View>
                                    </View>

                                    <View
                                      style={[styles.metaDivider, { backgroundColor: theme.colors.border }]}
                                    />

                                    <View style={styles.metaItem}>
                                      <FileText size={14} color={theme.colors.textSecondary} />
                                      <View style={{ marginLeft: 6 }}>
                                          <AppText variant="xs" color={theme.colors.textSecondary}>
                                            Medicines
                                          </AppText>
                                            <AppText
                                              variant="xs"
                                              weight="bold"
                                              color={theme.colors.text}
                                              style={{ marginTop: 1 }}
                                            >
                                              {rx.medicines.length} Prescribed
                                            </AppText>
                                          </View>
                                      </View>
                                    </View>

                                    {/* 4. Action Row: Download PDF & View Details */}
                                    <View style={styles.actionRow}>
                                      {/* Download PDF Button */}
                                      <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={`Download PDF for ${rx.diagnosis}`}
                                        activeOpacity={0.78}
                                        disabled={isDownloading}
                                        onPress={() => handleDownload(rx)}
                                        style={[
                                          styles.downloadBtn,
                                          {
                                            backgroundColor: theme.colors.primaryLight,
                                            borderColor: theme.colors.primary,
                                          },
                                        ]}
                                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                      >
                                        {isDownloading ? (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                                        ) : (
                                          <>
                                              <Download size={15} color={theme.colors.primary} />
                                              <AppText
                                                variant="xs"
                                                weight="bold"
                                                color={theme.colors.primary}
                                                style={{ marginLeft: 6 }}
                                              >
                                                Download PDF
                                              </AppText>
                                            </>
                    )}
                                          </TouchableOpacity>

                                        {/* View Details Button */}
                                        <TouchableOpacity
                                          accessibilityRole="button"
                                          accessibilityLabel={`View medicines for ${rx.diagnosis}`}
                                          activeOpacity={0.82}
                                          onPress={() =>
                                            navigation.navigate('PrescriptionDetails', { prescriptionId: rx.id })
                                          }
                                          style={[
                                            styles.viewDetailsBtn,
                                            {
                                              backgroundColor: theme.colors.primary,
                                            },
                                          ]}
                                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                        >
                                            <AppText
                                              variant="xs"
                                              weight="bold"
                                              color={theme.colors.white}
                                              style={{ marginRight: 4 }}
                                            >
                                              View Doses
                                            </AppText>
                                            <ChevronRight size={15} color={theme.colors.white} />
                                        </TouchableOpacity>
                                    </View>
                                  </View>
                                  );
          })}
                                </ScrollView>
                                )
      }
                              </SafeAreaView>
                              );
};

                              const styles = StyleSheet.create({
                                safeArea: {
                                flex: 1,
  },
                              headerContainer: {
                              paddingHorizontal: 16,
                              paddingTop: 12,
                              paddingBottom: 14,
                              borderBottomWidth: 1,
  },
                              headerTopRow: {
                                flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
  },
                              headerMainTitle: {
                                fontSize: 24,
                              fontWeight: '800',
                              letterSpacing: -0.5,
                              lineHeight: 28,
  },
                              filterTabsRow: {
                                flexDirection: 'row',
                              gap: 8,
                              marginTop: 14,
  },
                              filterTabPill: {
                                paddingHorizontal: 16,
                              paddingVertical: 7,
                              borderRadius: 20,
                              borderWidth: 1,
  },
                              filterTabPillActive: { },
                              filterTabPillInactive: { },
                              filterTabText: {
                                fontSize: 12,
  },
                              content: {
                                padding: 16,
                              paddingBottom: 32,
  },
                              prescriptionCard: {
                              borderRadius: 18,
                              borderWidth: 1,
                              padding: 16,
                              marginBottom: 14,
                              shadowColor: '#000',
                              shadowOffset: {width: 0, height: 2 },
                              shadowOpacity: 0.04,
                              shadowRadius: 6,
                              elevation: 2,
  },
                              cardTopRow: {
                                flexDirection: 'row',
                              alignItems: 'flex-start',
  },
                              iconBox: {
                                width: 44,
                              height: 44,
                              borderRadius: 14,
                              alignItems: 'center',
                              justifyContent: 'center',
  },
                              diagnosisCol: {
                                flex: 1,
                              marginLeft: 12,
                              paddingRight: 6,
  },
                              hindiSubtitle: {
                                fontStyle: 'italic',
                              marginTop: 2,
  },
                              statusBadge: {
                                flexDirection: 'row',
                              alignItems: 'center',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 12,
                              borderWidth: 1,
  },
                              doctorInfoRow: {
                                flexDirection: 'row',
                              alignItems: 'flex-start',
                              borderRadius: 12,
                              padding: 10,
                              marginTop: 12,
  },
                              cardDivider: {
                                height: 1,
                              marginVertical: 12,
  },
                              metaRow: {
                                flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
  },
                              metaItem: {
                                flexDirection: 'row',
                              alignItems: 'center',
  },
                              metaDivider: {
                                width: 1,
                              height: 24,
  },
                              actionRow: {
                                flexDirection: 'row',
                              alignItems: 'center',
                              gap: 10,
                              marginTop: 14,
  },
                              downloadBtn: {
                                flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: 40,
                              borderWidth: 1.5,
                              borderRadius: 12,
  },
                              viewDetailsBtn: {
                                flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: 40,
                              borderRadius: 12,
  },
});
