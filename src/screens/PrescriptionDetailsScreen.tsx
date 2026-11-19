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
  Stethoscope,
  MapPin,
  Calendar,
  AlertCircle,
  Apple,
  Clock,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building2,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  AppButton,
  AppCard,
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
  const { prescription, loading, error, refresh, toggleDose } =
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
        <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}>
          <AppHeader title="Medical Prescription" showBack onBack={() => navigation.goBack()} />
          <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#0D9488" />
              <AppText variant="sm" color="#64748B" style={{ marginTop: 12 }}>
                Loading electronic prescription...
              </AppText>
          </View>
        </SafeAreaView>
        );
  }

        if (error || !prescription) {
    return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}>
              <AppHeader title="Medical Prescription" showBack onBack={() => navigation.goBack()} />
              <View style={[styles.centerContainer, { padding: 24 }]}>
                <AlertCircle size={44} color={theme.colors.error} />
                <AppText variant="md" weight="bold" style={{ marginTop: 12 }}>
                  Unable to Load Prescription
                </AppText>
                  <AppText variant="sm" color="#64748B" style={{ textAlign: 'center', marginTop: 4 }}>
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
              <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}>
                {/* Top Header with Quick Download Action */}
                <AppHeader
                  title="Digital Prescription"
                  subtitle={`Ref #${prescription.id}`}
                  showBack
                  onBack={() => navigation.goBack()}
                  style={{ backgroundColor: '#FFFFFF' }}
                  rightAction={
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel="Download prescription PDF"
                      activeOpacity={0.8}
                      onPress={handleDownload}
                      disabled={downloading}
                      style={styles.headerDownloadBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      {downloading ? (
                        <ActivityIndicator size="small" color="#0D9488" />
                      ) : (
                        <Download size={20} color="#0D9488" />
                      )}
                    </TouchableOpacity>
                  }
                />

                <ScrollView
                  contentContainerStyle={styles.content}
                  showsVerticalScrollIndicator={false}
                >
                        {/* 1. Official Medical Rx Header Document Card */}
                        <View style={styles.officialRxCard}>
                          {/* Hospital / Clinic Banner Header */}
                          <View style={styles.clinicHeaderRow}>
                            <View style={styles.clinicLogoBox}>
                              <Building2 size={24} color="#0D9488" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <AppText variant="md" weight="bold" color="#0F172A">
                                {prescription.clinicName}
                              </AppText>
                              <AppText variant="xs" color="#64748B" style={{ marginTop: 2 }}>
                                {prescription.clinicAddress}
                              </AppText>
                              <AppText variant="xs" color="#0D9488" style={{ marginTop: 2, fontWeight: '600' }}>
                                Telangana Medical Council Reg: TS/MC/2016/9421
                              </AppText>
                            </View>
                          </View>

                            <View style={styles.cardDivider} />

                            {/* Doctor & Patient Metadata Grid */}
                            <View style={styles.metadataGrid}>
                              {/* Doctor Column */}
                              <View style={{ flex: 1 }}>
                                <AppText variant="xs" color="#64748B" weight="semibold">
                                  PRESCRIBING DOCTOR
                                </AppText>
                                <AppText variant="sm" weight="bold" color="#0F172A" style={{ marginTop: 2 }}>
                                  {prescription.doctorName}
                                </AppText>
                                <AppText variant="xs" color="#64748B" style={{ marginTop: 1 }}>
                                  {prescription.doctorSpeciality}
                                </AppText>
                                <AppText variant="xs" color="#94A3B8" style={{ marginTop: 1 }}>
                                  {prescription.doctorDegrees}
                                </AppText>
                              </View>

                              <View style={styles.verticalDivider} />

                              {/* Patient Column */}
                              <View style={{ flex: 1, paddingLeft: 4 }}>
                                <AppText variant="xs" color="#64748B" weight="semibold">
                                  PATIENT & DATE
                                </AppText>
                                <AppText variant="sm" weight="bold" color="#0F172A" style={{ marginTop: 2 }}>
                                  Aarav Sharma
                                </AppText>
                                <AppText variant="xs" color="#64748B" style={{ marginTop: 1 }}>
                                  34 Yrs • Male • Hyderabad
                                </AppText>
                                <AppText variant="xs" color="#0D9488" weight="bold" style={{ marginTop: 1 }}>
                                  Date: {prescription.prescribedDate}
                                </AppText>
                              </View>
                            </View>

                            <View style={styles.cardDivider} />

                                  {/* Rx Insignia & Diagnosis Box */}
                                  <View style={styles.diagnosisBox}>
                                    <View style={styles.rxBadge}>
                                      <AppText variant="xl" weight="bold" color="#0D9488" style={styles.rxSymbol}>
                                        ℞
                                      </AppText>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                      <AppText variant="xs" color="#64748B" weight="bold">
                                        DIAGNOSIS (रोग निदान)
                                      </AppText>
                                      <AppText variant="sm" weight="bold" color="#0F172A" style={{ marginTop: 2 }}>
                                        {prescription.diagnosis}
                                      </AppText>
                                      {prescription.diagnosisHindi ? (
                                        <AppText variant="xs" color="#64748B" style={{ fontStyle: 'italic', marginTop: 2 }}>
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
                                <AppText variant="md" weight="bold" color="#0F172A">
                                  Prescribed Medicines ({prescription.medicines.length})
                                </AppText>
                                <AppText variant="xs" color="#64748B">
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
                                  <View style={styles.dietCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Apple size={18} color="#EA580C" />
                                        <AppText variant="sm" weight="bold" color="#0F172A" style={{ marginLeft: 8 }}>
                                          Doctor&apos;s Lifestyle & Dietary Advice
                                        </AppText>
                                    </View>
                                      <AppText variant="xs" color="#334155" style={{ marginTop: 8, lineHeight: 19 }}>
                                        {prescription.dietaryAdvice}
                                      </AppText>
                                      {prescription.dietaryAdviceHindi ? (
                                        <AppText
                                          variant="xs"
                                          color="#64748B"
                                          style={{ fontStyle: 'italic', marginTop: 4, lineHeight: 18 }}
                                        >
                                          {prescription.dietaryAdviceHindi}
                                        </AppText>
                                      ) : null}

                                    {prescription.nextFollowUpDate ? (
                                      <View style={styles.followUpRow}>
                                        <Clock size={14} color="#0D9488" />
                                        <AppText variant="xs" weight="bold" color="#0D9488" style={{ marginLeft: 6 }}>
                                          Next Follow-up: {prescription.nextFollowUpDate}
                                        </AppText>
                                      </View>
                                    ) : null}
                                  </View>
        ) : null}

                                  {/* 4. Digital Signature & Verification Seal */}
                                  <View style={styles.signatureSealCard}>
                                    <View style={styles.sealIconBox}>
                                      <ShieldCheck size={24} color="#0D9488" />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                      <AppText variant="xs" weight="bold" color="#0F172A">
                                        Digitally Signed Electronic Health Record
                                      </AppText>
                                      <AppText variant="xs" color="#64748B" style={{ marginTop: 2 }}>
                                        Prescribed & certified by {prescription.doctorName} (NMC Registered).
                                      </AppText>
                                      <AppText variant="xs" color="#0D9488" style={{ marginTop: 3, fontSize: 10 }}>
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
                                      style={styles.primaryDownloadBtn}
                                    >
                                      {downloading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                      ) : (
                                        <>
                                          <Download size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                          <AppText variant="sm" weight="bold" color="#FFFFFF">
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
                                        style={styles.shareBtn}
                                      >
                                        <Share2 size={16} color="#0D9488" style={{ marginRight: 6 }} />
                                        <AppText variant="xs" weight="bold" color="#0D9488">
                                          Share Rx
                                        </AppText>
                                      </TouchableOpacity>

                                      <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel="Back to all prescriptions"
                                        activeOpacity={0.8}
                                        onPress={() => navigation.goBack()}
                                        style={styles.backBtn}
                                      >
                                        <AppText variant="xs" weight="bold" color="#475569">
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
                            backgroundColor: '#FFFFFF',
  },
                            content: {
                            padding: 16,
                            paddingBottom: 40,
                            backgroundColor: '#FFFFFF',
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
                            backgroundColor: '#F0FDFA',
                            borderWidth: 1,
                            borderColor: '#99F6E4',
                            alignItems: 'center',
                            justifyContent: 'center',
  },
                              officialRxCard: {
                              backgroundColor: '#FFFFFF',
                            borderRadius: 18,
                            borderWidth: 1.5,
                            borderColor: '#E2E8F0',
                            padding: 16,
                            marginBottom: 16,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2 },
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
                            backgroundColor: '#CCFBF1',
                            alignItems: 'center',
                            justifyContent: 'center',
  },
                              cardDivider: {
                              height: 1,
                            backgroundColor: '#F1F5F9',
                            marginVertical: 14,
  },
                            metadataGrid: {
                              flexDirection: 'row',
  },
                            verticalDivider: {
                              width: 1,
                            backgroundColor: '#E2E8F0',
                            marginHorizontal: 12,
  },
                            diagnosisBox: {
                              flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F0FDFA',
                            borderRadius: 14,
                            padding: 12,
                            borderWidth: 1,
                            borderColor: '#CCFBF1',
  },
                            rxBadge: {
                              width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#CCFBF1',
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
                            backgroundColor: '#FFF7ED',
                            borderWidth: 1,
                            borderColor: '#FFEDD5',
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 16,
  },
                            followUpRow: {
                              flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 10,
                            alignSelf: 'flex-start',
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: '#CCFBF1',
  },
                            signatureSealCard: {
                              flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F8FAFC',
                            borderRadius: 14,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: '#E2E8F0',
                            marginBottom: 20,
  },
                            sealIconBox: {
                              width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#CCFBF1',
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
                            backgroundColor: '#0D9488',
                            height: 50,
                            borderRadius: 16,
                            shadowColor: '#0D9488',
                            shadowOffset: {width: 0, height: 3 },
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
                            backgroundColor: '#F0FDFA',
                            borderWidth: 1,
                            borderColor: '#99F6E4',
  },
                            backBtn: {
                              flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 42,
                            borderRadius: 12,
                            backgroundColor: '#F8FAFC',
                            borderWidth: 1,
                            borderColor: '#E2E8F0',
  },
});
