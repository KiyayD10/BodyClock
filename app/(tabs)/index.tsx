import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { ThemeToggle } from '@/components/ui/ThemeToggle'; // Kita pertahankan ini!
import { SPACING } from '@/constants/theme';

// Database Imports
import { ScheduleRepository } from '@/database/repositories/ScheduleRepository';
import { DailyStateRepository } from '@/database/repositories/DailyStateRepository';
import { ScheduleTemplate } from '@/types/database';

export default function HomeScreen() {
  const { colors } = useTheme();
  
  // State untuk data dinamis dari database
  const [schedules, setSchedules] = useState<ScheduleTemplate[]>([]);
  const [todayStats, setTodayStats] = useState({ total: 0, completed: 0 });
  const [refreshing, setRefreshing] = useState(false);

  // 1. Fungsi Load Data (Otaknya)
  const loadData = async () => {
    try {
      const schedulesData = await ScheduleRepository.getAllActive();
      const statsData = await DailyStateRepository.getTodayStats();

      setSchedules(schedulesData);
      setTodayStats(statsData);
    } catch (error) {
      console.error('Gagal memuat data:', error);
    }
  };

  // 2. Auto Refresh saat layar dibuka
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // 3. Manual Refresh (Tarik ke bawah)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // 4. Fungsi Tambah Data Dummy (Buat ngetes aja)
  const handleAddSample = async () => {
    try {
      const newId = await ScheduleRepository.create({
        name: 'Tes Jadwal',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        description: 'Jadwal testing dari tombol',
        icon: '⚡',
        color: '#00F0FF',
      });
      await DailyStateRepository.createOrGetToday(newId);
      await loadData(); // Refresh UI langsung
    } catch (error) {
      console.error('Gagal tambah sample:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.neon.cyan} />
        }
      >
        {/* Header - (Desain Lama dipertahankan) */}
        <View style={styles.header}>
          <View>
            <Text variant="h1" weight="bold">BodyClock</Text>
            <Text variant="caption" color="secondary">Sinkronisasi ritme tubuh</Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Stats Card - (Sekarang datanya REAL dari DB!) */}
        <Card variant="neon" style={styles.section}>
          <Text variant="h3" weight="semibold" color="neon-cyan" style={{ marginBottom: 8 }}>
            Status Hari Ini
          </Text>
          
          <View style={styles.summaryRow}>
            <View>
              <Text variant="h2" weight="bold" color="neon-purple">
                {todayStats.completed} / {todayStats.total}
              </Text>
              <Text variant="caption" color="secondary">Tugas Selesai</Text>
            </View>
            
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="h2" weight="bold" color="neon-cyan">
                {todayStats.total > 0 
                  ? Math.round((todayStats.completed / todayStats.total) * 100) 
                  : 0}%
              </Text>
              <Text variant="caption" color="secondary">Efisiensi</Text>
            </View>
          </View>
        </Card>

        {/* Tombol Aksi (Testing) */}
        <View style={styles.section}>
          <Button variant="secondary" onPress={handleAddSample} fullWidth>
            + Tambah Jadwal (Test)
          </Button>
        </View>

        {/* Daftar Jadwal (List Dinamis) */}
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: 12 }}>
            Jadwal Aktif
          </Text>
          
          {schedules.length === 0 ? (
            <Text color="secondary" style={{ fontStyle: 'italic', textAlign: 'center' }}>
              Belum ada jadwal. Tekan tombol di atas untuk mencoba.
            </Text>
          ) : (
            schedules.map((item) => (
              <Card key={item.id} style={{ marginBottom: 10, padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text variant="h3">{item.icon || '📅'}</Text>
                    <View>
                      <Text weight="semibold">{item.name}</Text>
                      {item.description && (
                        <Text variant="caption" color="secondary">{item.description}</Text>
                      )}
                    </View>
                  </View>
                  <Text weight="bold" color="neon-cyan">{item.time}</Text>
                </View>
              </Card>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 100,
    gap: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});