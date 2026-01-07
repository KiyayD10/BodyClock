import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { SettingItem } from '@/components/features/SettingItem';
import { TimePickerModal } from '@/components/features/TimePickerModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SPACING } from '@/constants/theme';
import { AlarmTime } from '@/types/alarm';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { defaultWakeTime, defaultSleepTime, saveDefaultWakeTime, saveDefaultSleepTime, resetAllData } = useSettings();

  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);
  const [showSleepTimePicker, setShowSleepTimePicker] = useState(false);

  const formatTime = (time: AlarmTime) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  const handleSaveWakeTime = async (time: AlarmTime) => {
    try {
      await saveDefaultWakeTime(time);
      setShowWakeTimePicker(false);
      Alert.alert('✅ Berhasil', 'Waktu bangun default diperbarui');
    } catch (error) {
      console.error('Gagal menyimpan waktu bangun:', error);
      Alert.alert('❌ Gagal', 'Gagal menyimpan waktu bangun');
    }
  };

  const handleSaveSleepTime = async (time: AlarmTime) => {
    try {
      await saveDefaultSleepTime(time);
      setShowSleepTimePicker(false);
      Alert.alert('✅ Berhasil', 'Waktu tidur default diperbarui');
    } catch (error) {
      console.error('Gagal menyimpan waktu tidur:', error);
      Alert.alert('❌ Gagal', 'Gagal menyimpan waktu tidur');
    }
  };

  const handleResetData = async () => {

    // resetAllData sudah ada Alert konfirmasinya di dalam hook
    await resetAllData();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" weight="bold">
            Pengaturan
          </Text>
          <Text variant="caption" color="secondary">
            Sesuaikan preferensi aplikasimu
          </Text>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
            Tampilan
          </Text>
          <Card>
            <SettingItem
              icon="🎨"
              title="Mode Gelap"
              description={`Saat ini menggunakan tema ${isDark ? 'gelap' : 'terang'}`}
              rightElement={<ThemeToggle />}
            />
          </Card>
        </View>

        {/* Default Times Section */}
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
            Waktu Default
          </Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon="⏰"
              title="Waktu Bangun"
              description="Jam bangun biasamu"
              value={formatTime(defaultWakeTime)}
              onPress={() => setShowWakeTimePicker(true)}
            />
            <SettingItem
              icon="😴"
              title="Waktu Tidur"
              description="Jam tidur biasamu"
              value={formatTime(defaultSleepTime)}
              onPress={() => setShowSleepTimePicker(true)}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
            Manajemen Data
          </Text>
          <Card>
            <SettingItem
              icon="🗑️"
              title="Reset Semua Data"
              description="Hapus semua data secara permanen"
              onPress={handleResetData}
              danger
            />
          </Card>
        </View>

        {/* App Info */}
        <Card variant="neon" style={styles.section}>
          <Text variant="body" color="secondary" center>
            💡 Semua pengaturan disimpan secara lokal di perangkatmu
          </Text>
        </Card>

        {/* Version */}
        <Text variant="caption" color="tertiary" center style={styles.version}>
          BodyClock v1.0.0
        </Text>
      </ScrollView>

      {/* Time Picker Modals */}
      <TimePickerModal
        visible={showWakeTimePicker}
        title="Atur Waktu Bangun"
        initialTime={defaultWakeTime}
        onSave={handleSaveWakeTime}
        onCancel={() => setShowWakeTimePicker(false)}
      />

      <TimePickerModal
        visible={showSleepTimePicker}
        title="Atur Waktu Tidur"
        initialTime={defaultSleepTime}
        onSave={handleSaveSleepTime}
        onCancel={() => setShowSleepTimePicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
    gap: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  settingsList: {
    gap: SPACING.md,
  },
  version: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
});