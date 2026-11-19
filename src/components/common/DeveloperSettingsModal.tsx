import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  X,
  Sparkles,
  Sliders,
  RefreshCw,
  AlertTriangle,
  Zap,
  CheckCircle,
} from 'lucide-react-native';
import { useTheme } from '../../theme';
import { AppText, AppButton, AppCard, AppBadge } from '../common';
import {
  developerSettingsService,
  DeveloperSettings,
} from '../../services/developerSettings';

interface DeveloperSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfigSwitched: (configId: 'normal' | 'diwali') => void;
  activeConfigId: 'normal' | 'diwali';
}

export const DeveloperSettingsModal: React.FC<DeveloperSettingsModalProps> = ({
  visible,
  onClose,
  onConfigSwitched,
  activeConfigId,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = useState<DeveloperSettings>(
    developerSettingsService.getSettings()
  );

  useEffect(() => {
    if (visible) {
      setSettings(developerSettingsService.getSettings());
    }
  }, [visible]);

  const toggleConfig = async (target: 'normal' | 'diwali') => {
    await developerSettingsService.updateSettings({ activeConfigId: target });
    setSettings((prev) => ({ ...prev, activeConfigId: target }));
    onConfigSwitched(target);
  };

  const handleToggleSetting = async (key: keyof DeveloperSettings, value: boolean) => {
    const updated = await developerSettingsService.updateSettings({ [key]: value });
    setSettings({ ...updated });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerTitleGroup}>
              <Sliders size={20} color={theme.colors.primary} />
              <AppText variant="lg" weight="bold" style={{ marginLeft: 8 }}>
                Developer & Admin Controls
              </AppText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { minHeight: 44, minWidth: 44 }]}
              accessibilityRole="button"
              accessibilityLabel="Close developer settings"
            >
              <X size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={[styles.body, { padding: theme.spacing.md }]}>
            {/* Theme & Remote Config Switcher */}
            <AppText variant="md" weight="bold" style={{ marginBottom: 8 }}>
              Remote Configuration (GET /config)
            </AppText>

            <View style={styles.configToggleRow}>
              {/* Normal Config Button */}
              <TouchableOpacity
                onPress={() => toggleConfig('normal')}
                style={[
                  styles.configOptionCard,
                  {
                    borderColor:
                      activeConfigId === 'normal'
                        ? theme.colors.primary
                        : theme.colors.border,
                    backgroundColor:
                      activeConfigId === 'normal'
                        ? theme.colors.primaryLight
                        : theme.colors.surfaceVariant,
                  },
                ]}
              >
                <AppText
                  variant="sm"
                  weight="bold"
                  color={
                    activeConfigId === 'normal'
                      ? theme.colors.primary
                      : theme.colors.text
                  }
                >
                  Normal Theme
                </AppText>
                <AppText variant="xs" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
                  Clinical Teal, Standard Order
                </AppText>
                {activeConfigId === 'normal' && (
                  <AppBadge label="Active" variant="primary" style={{ marginTop: 6 }} />
                )}
              </TouchableOpacity>

              {/* Diwali Config Button */}
              <TouchableOpacity
                onPress={() => toggleConfig('diwali')}
                style={[
                  styles.configOptionCard,
                  {
                    borderColor:
                      activeConfigId === 'diwali'
                        ? '#C2410C'
                        : theme.colors.border,
                    backgroundColor:
                      activeConfigId === 'diwali'
                        ? '#FFEDD5'
                        : theme.colors.surfaceVariant,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Sparkles size={14} color="#C2410C" style={{ marginRight: 4 }} />
                  <AppText
                    variant="sm"
                    weight="bold"
                    color={activeConfigId === 'diwali' ? '#C2410C' : theme.colors.text}
                  >
                    Diwali Theme
                  </AppText>
                </View>
                <AppText variant="xs" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
                  Festive Saffron, Reordered
                </AppText>
                {activeConfigId === 'diwali' && (
                  <AppBadge label="🪔 Active" variant="secondary" style={{ marginTop: 6 }} />
                )}
              </TouchableOpacity>
            </View>

            <AppCard style={{ marginTop: 12, marginBottom: 16 }}>
              <AppText variant="xs" color={theme.colors.textSecondary}>
                Switching configuration triggers dynamic re-theming, banner updates, section reordering, and background changes on the fly with zero screen duplication.
              </AppText>
            </AppCard>

            {/* Backend Simulation Controls */}
            <AppText variant="md" weight="bold" style={{ marginVertical: 8 }}>
              Backend Simulator (Axios)
            </AppText>

            {/* Latency */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <Zap size={18} color={theme.colors.primary} />
                <View style={{ marginLeft: 10 }}>
                  <AppText variant="sm" weight="semibold">
                    Simulate Network Latency
                  </AppText>
                  <AppText variant="xs" color={theme.colors.textMuted}>
                    600ms realistic delay
                  </AppText>
                </View>
              </View>
              <Switch
                value={settings.simulateLatency}
                onValueChange={(val) => handleToggleSetting('simulateLatency', val)}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={settings.simulateLatency ? theme.colors.primary : theme.colors.surfaceVariant}
              />
            </View>

            {/* API Failure */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <AlertTriangle size={18} color={theme.colors.error} />
                <View style={{ marginLeft: 10 }}>
                  <AppText variant="sm" weight="semibold">
                    Simulate API Failure (500)
                  </AppText>
                  <AppText variant="xs" color={theme.colors.textMuted}>
                    Tests offline caching & retry
                  </AppText>
                </View>
              </View>
              <Switch
                value={settings.simulateApiFailure}
                onValueChange={(val) => handleToggleSetting('simulateApiFailure', val)}
                trackColor={{ false: theme.colors.border, true: theme.colors.errorLight }}
                thumbColor={settings.simulateApiFailure ? theme.colors.error : theme.colors.surfaceVariant}
              />
            </View>

            {/* Empty Responses */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <RefreshCw size={18} color={theme.colors.warning} />
                <View style={{ marginLeft: 10 }}>
                  <AppText variant="sm" weight="semibold">
                    Simulate Empty Responses
                  </AppText>
                  <AppText variant="xs" color={theme.colors.textMuted}>
                    Tests empty states
                  </AppText>
                </View>
              </View>
              <Switch
                value={settings.simulateEmptyResponses}
                onValueChange={(val) => handleToggleSetting('simulateEmptyResponses', val)}
                trackColor={{ false: theme.colors.border, true: theme.colors.warningLight }}
                thumbColor={settings.simulateEmptyResponses ? theme.colors.warning : theme.colors.surfaceVariant}
              />
            </View>

            {/* Slot Conflict 409 */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <AlertTriangle size={18} color={theme.colors.secondary} />
                <View style={{ marginLeft: 10 }}>
                  <AppText variant="sm" weight="semibold">
                    Simulate Slot Conflict (409)
                  </AppText>
                  <AppText variant="xs" color={theme.colors.textMuted}>
                    Tests slot booking race conditions
                  </AppText>
                </View>
              </View>
              <Switch
                value={settings.simulateBookingConflict}
                onValueChange={(val) => handleToggleSetting('simulateBookingConflict', val)}
                trackColor={{ false: theme.colors.border, true: theme.colors.secondaryLight }}
                thumbColor={settings.simulateBookingConflict ? theme.colors.secondary : theme.colors.surfaceVariant}
              />
            </View>

            {/* Cache Reset Option */}
            <AppButton
              title="Clear Local Storage & Cache"
              variant="outline"
              size="sm"
              icon={<RefreshCw size={14} color={theme.colors.error} />}
              style={{ marginTop: 16, borderColor: theme.colors.error }}
              textStyle={{ color: theme.colors.error }}
              onPress={async () => {
                await developerSettingsService.updateSettings({
                  simulateApiFailure: false,
                  simulateBookingConflict: false,
                  simulateEmptyResponses: false,
                });
                alert('Cache reset successfully.');
              }}
            />

            <AppButton
              title="Done"
              variant="primary"
              style={{ marginTop: 16 }}
              onPress={onClose}
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingBottom: 24,
  },
  configToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  configOptionCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    minHeight: 48,
  },
  toggleLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
