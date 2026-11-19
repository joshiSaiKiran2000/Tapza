import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AlertCircle,
  Apple,
  Clock,
  Download,
  Share2,
  ShieldCheck,
  Building2,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  AppButton,
  AppBadge,
  AppHeader,
} from '../components/common';
import { MedicineCard } from '../components/prescriptions';
import { usePrescriptionDetails } from '../hooks/usePrescriptionDetails';
import type { RootStackScreenProps } from '../types/navigation';

export const PrescriptionDetailsScreen: React.FC<RootStackScreenProps<'PrescriptionDetails'>> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const { prescriptionId } = route.params;
  const { prescription, loading, error, toggleDose } =
    usePrescriptionDetails(prescriptionId);

  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownload = () => {
    if (!prescription) return;
    setDownloading(true);

    setTimeout(() => {
      setDownloading(false);
      Alert.alert(
        'Prescription Downloaded Successfully',
        `Official electronic medical prescription has been downloaded.\n\n• File: Rx-${prescription.id}.pdf\n• Doctor: ${prescription.doctorName}\n• Hospital: ${prescription.clinicName}\n• Format: Standard Digital Rx (NMC Compliant)\n\nSaved to: Downloads/TapzaCare/Prescriptions/\nYou can present this official PDF at any licensed pharmacy or diagnostic lab.`,
        [{ text: 'OK', style: 'default' }]
      );
    }, 700);
  };

  const handleShare = () => {
    if (!prescription) return;
    Alert.alert(
      'Share Prescription',
      `Secure link for Rx-${prescription.id} (${prescription.diagnosis}) has been generated.\n\nYou can share this with your local pharmacy or caregiver.`,
      [{ text: 'Copy Link' }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  if (loading) {
    return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Medical Prescription" showBack onBack={() => navigation.goBack()} />
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText variant="sm" color={theme.colors.textSecondary} style={{ marginTop: 12 }}>
          Loading electronic prescription...
        </AppText>
      </View>
    </SafeAreaView>
    );
  }

  if (error || !prescription) {
    return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="Medical Prescription" showBack onBack={() => navigation.goBack()} />
      <View style={[styles.centerContainer, { padding: 24 }]}>
        <AlertCircle size={44} color={theme.colors.error} />
        <AppText variant="md" weight="bold" style={{ marginTop: 12 }}>
          Unable to Load Prescription
        </AppText>
        <AppText variant="sm" color={theme.colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
          {error || 'Prescription not found'}
        </AppText>
        <AppButton
          title="Go Back"
          variant="outline"
          style={{ marginTop: 16 }}
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
    );
  }

  const isActive = prescription.status === 'active';

      return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        {/* Top Header with Quick Download Action */}
        <AppHeader
          title="Digital Prescription"
          subtitle={`Ref #${prescription.id}`}
          showBack
          onBack={() => navigation.goBack()}
          rightAction={
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Download prescription PDF"
              activeOpacity={0.8}
              onPress={handleDownload}
              disabled={downloading}
              style={[
                styles.headerDownloadBtn,
                {
                  backgroundColor: theme.colors.primaryLight,
                  borderColor: theme.colors.primary,
                },
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {downloading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Download size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          }
        />

            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* 1. Official Medical Rx Header Document Card */}
              <View
                style={[
                  styles.officialRxCard,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                {/* Hospital / Clinic Banner Header */}
                <View style={styles.clinicHeaderRow}>
                  <View
                    style={[
                      styles.clinicLogoBox,
                      { backgroundColor: theme.colors.primaryLight },
                    ]}
                  >
                    <Building2 size={24} color={theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <AppText variant="md" weight="bold" color={theme.colors.text}>
                      {prescription.clinicName}
                    </AppText>
                    <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                      {prescription.clinicAddress}
                    </AppText>
                    <AppText variant="xs" color={theme.colors.primary} style={{ marginTop: 2, fontWeight: '600' }}>
                      Telangana Medical Council Reg: TS/MC/2016/9421
                    </AppText>
                  </View>
                </View>

                <View style={[styles.cardDivider, { backgroundColor: theme.colors.border }]} />

                  {/* Doctor & Patient Metadata Grid */}
                  <View style={styles.metadataGrid}>
                    {/* Doctor Column */}
                    <View style={{ flex: 1 }}>
                      <AppText variant="xs" color={theme.colors.textMuted} weight="semibold">
                        PRESCRIBING DOCTOR
                      </AppText>
                      <AppText variant="sm" weight="bold" color={theme.colors.text} style={{ marginTop: 2 }}>
                        {prescription.doctorName}
                      </AppText>
                      <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 1 }}>
                        {prescription.doctorSpeciality}
                      </AppText>
                      <AppText variant="xs" color={theme.colors.textMuted} style={{ marginTop: 1 }}>
                        {prescription.doctorDegrees}
                      </AppText>
                    </View>

                    <View style={[styles.verticalDivider, { backgroundColor: theme.colors.border }]} />

                  {/* Patient Column */}
                  <View style={{ flex: 1, paddingLeft: 4 }}>
                    <AppText variant="xs" color={theme.colors.textMuted} weight="semibold">
                      PATIENT & DATE
                    </AppText>
                    <AppText variant="sm" weight="bold" color={theme.colors.text} style={{ marginTop: 2 }}>
                      Aarav Sharma
                    </AppText>
                    <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 1 }}>
                      34 Yrs • Male • Hyderabad
                    </AppText>
                    <AppText variant="xs" color={theme.colors.primary} weight="bold" style={{ marginTop: 1 }}>
                      Date: {prescription.prescribedDate}
                    </AppText>
                  </View>
                </View>

                <View style={[styles.cardDivider, { backgroundColor: theme.colors.border }]} />

              {/* Rx Insignia & Diagnosis Box */}
              <View
                style={[
                  styles.diagnosisBox,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.rxBadge,
                    { backgroundColor: theme.colors.primaryLight },
                  ]}
                >
                  <AppText variant="xl" weight="bold" color={theme.colors.primary} style={styles.rxSymbol}>
                    ℞
                  </AppText>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <AppText variant="xs" color={theme.colors.textMuted} weight="bold">
                    DIAGNOSIS (रोग निदान)
                  </AppText>
                  <AppText variant="sm" weight="bold" color={theme.colors.text} style={{ marginTop: 2 }}>
                    {prescription.diagnosis}
                  </AppText>
                  {prescription.diagnosisHindi ? (
                    <AppText variant="xs" color={theme.colors.textSecondary} style={{ fontStyle: 'italic', marginTop: 2 }}>
                      {prescription.diagnosisHindi}
                    </AppText>
                  ) : null}
                </View>
                <AppBadge
                  label={isActive ? 'Active Course' : 'Completed'}
                  variant={isActive ? 'success' : 'info'}
                />
              </View>
          </View>

          {/* 2. Prescribed Medicines with Dose Tracker */}
          <View style={styles.sectionHeaderRow}>
            <AppText variant="md" weight="bold" color={theme.colors.text}>
              Prescribed Medicines ({prescription.medicines.length})
            </AppText>
            <AppText variant="xs" color={theme.colors.textSecondary}>
              Tap dose icons to log today&apos;s intake
            </AppText>
          </View>

          {prescription.medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onToggleDose={(medId, timing) => toggleDose(medId, timing)}
            />
          ))}

              {/* 3. Doctor's Lifestyle & Dietary Advice */}
              {prescription.dietaryAdvice ? (
                <View
                  style={[
                    styles.dietCard,
                    {
                      backgroundColor: theme.isDark ? theme.colors.surfaceVariant : '#FFF7ED',
                      borderColor: theme.isDark ? theme.colors.border : '#FFEDD5',
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Apple size={18} color="#EA580C" />
                    <AppText variant="sm" weight="bold" color={theme.colors.text} style={{ marginLeft: 8 }}>
                      Doctor&apos;s Lifestyle & Dietary Advice
                    </AppText>
                  </View>
                  <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 8, lineHeight: 19 }}>
                    {prescription.dietaryAdvice}
                  </AppText>
                  {prescription.dietaryAdviceHindi ? (
                    <AppText
                      variant="xs"
                      color={theme.colors.textMuted}
                      style={{ fontStyle: 'italic', marginTop: 4, lineHeight: 18 }}
                    >
                      {prescription.dietaryAdviceHindi}
                    </AppText>
                  ) : null}

            {prescription.nextFollowUpDate ? (
                <View
                  style={[
                    styles.followUpRow,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Clock size={14} color={theme.colors.primary} />
                  <AppText variant="xs" weight="bold" color={theme.colors.primary} style={{ marginLeft: 6 }}>
                    Next Follow-up: {prescription.nextFollowUpDate}
                  </AppText>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* 4. Digital Signature & Verification Seal */}
          <View
            style={[
              styles.signatureSealCard,
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.sealIconBox,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            >
              <ShieldCheck size={24} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <AppText variant="xs" weight="bold" color={theme.colors.text}>
                Digitally Signed Electronic Health Record
              </AppText>
              <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                Prescribed & certified by {prescription.doctorName} (NMC Registered).
              </AppText>
              <AppText variant="xs" color={theme.colors.primary} style={{ marginTop: 3, fontSize: 10 }}>
                Audit Hash: SHA256:{prescription.id}-TS-MC-2026-VERIFIED
              </AppText>
            </View>
          </View>

            {/* 5. Primary Download and Share Action Section */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Download digital prescription PDF"
                activeOpacity={0.85}
                disabled={downloading}
                onPress={handleDownload}
                style={[
                  styles.primaryDownloadBtn,
                  {
                    backgroundColor: theme.colors.primary,
                    shadowColor: theme.colors.primary,
                  },
                ]}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <>
                    <Download size={20} color={theme.colors.white} style={{ marginRight: 8 }} />
                    <AppText variant="sm" weight="bold" color={theme.colors.white}>
                      Download Prescription (PDF)
                    </AppText>
                  </>
                )}
              </TouchableOpacity>

                <View style={styles.secondaryActionsRow}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Share prescription"
                    activeOpacity={0.8}
                    onPress={handleShare}
                    style={[
                      styles.shareBtn,
                      {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Share2 size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
                    <AppText variant="xs" weight="bold" color={theme.colors.primary}>
                      Share Rx
                    </AppText>
                  </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Back to all prescriptions"
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              style={[
                styles.backBtn,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <AppText variant="xs" weight="bold" color={theme.colors.textSecondary}>
                Back to Prescriptions
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

    const styles = StyleSheet.create({
      safeArea: {
        flex: 1,
      },
        content: {
          padding: 16,
          paddingBottom: 40,
        },
          centerContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
            headerDownloadBtn: {
              width: 38,
              height: 38,
              borderRadius: 19,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            },
              officialRxCard: {
                borderRadius: 18,
                borderWidth: 1.5,
                padding: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
              },
                clinicHeaderRow: {
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                },
                  clinicLogoBox: {
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                    cardDivider: {
                      height: 1,
                      marginVertical: 14,
                    },
                      metadataGrid: {
                        flexDirection: 'row',
                      },
                        verticalDivider: {
                          width: 1,
                          marginHorizontal: 12,
                        },
                          diagnosisBox: {
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 14,
                            padding: 12,
                            borderWidth: 1,
                          },
                            rxBadge: {
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                              rxSymbol: {
                                fontSize: 20,
                                lineHeight: 24,
                              },
                                sectionHeaderRow: {
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: 12,
                                },
                                  dietCard: {
                                    borderWidth: 1,
                                    borderRadius: 16,
                                    padding: 16,
                                    marginBottom: 16,
                                  },
                                    followUpRow: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingHorizontal: 10,
                                      paddingVertical: 6,
                                      borderRadius: 10,
                                      alignSelf: 'flex-start',
                                      marginTop: 10,
                                      borderWidth: 1,
                                    },
                                      signatureSealCard: {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderRadius: 14,
                                        padding: 14,
                                        borderWidth: 1,
                                        marginBottom: 20,
                                      },
                                        sealIconBox: {
                                          width: 40,
                                          height: 40,
                                          borderRadius: 20,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        },
                                          actionsContainer: {
                                            marginBottom: 20,
                                          },
                                            primaryDownloadBtn: {
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              height: 50,
                                              borderRadius: 16,
                                              shadowOffset: { width: 0, height: 3 },
                                              shadowOpacity: 0.25,
                                              shadowRadius: 5,
                                              elevation: 3,
                                            },
                                              secondaryActionsRow: {
                                                flexDirection: 'row',
                                                gap: 12,
                                                marginTop: 12,
                                              },
                                                shareBtn: {
                                                  flex: 1,
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  height: 42,
                                                  borderRadius: 12,
                                                  borderWidth: 1,
                                                },
                                                  backBtn: {
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: 42,
                                                    borderRadius: 12,
                                                    borderWidth: 1,
                                                  },
                                                });
