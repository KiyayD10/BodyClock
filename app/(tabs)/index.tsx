import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useMorningNotes } from '@/hooks/useMorningNotes';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SPACING } from '@/constants/theme'; 
import { MOOD_EMOJI } from '@/types/morningNotes';

// Database Imports
import { ScheduleRepository } from '@/database/repositories/ScheduleRepository';
import { DailyStateRepository } from '@/database/repositories/DailyStateRepository';
import { ScheduleTemplate } from '@/types/database';

export default function HomeScreen() {
  const { colors } = useTheme();
  
  // --- STATE ---
  const [schedules, setSchedules] = useState<ScheduleTemplate[]>([]);
  const [scheduleStats, setScheduleStats] = useState({ total: 0, completed: 0 });
  
  const { todayNote, getWeeklyStats, checkStatus } = useMorningNotes();
  const [weeklyStats, setWeeklyStats] = useState({ 
    avgSleepQuality: 0, 
    avgEnergyLevel: 0, 
    totalEntries: 0 
  });

  const [refreshing, setRefreshing] = useState(false);

  // --- LOGIC ---
  // Bungkus dengan useCallback agar dependency stabil
  const loadAllData = useCallback(async () => {
    try {
      // Load Jadwal & Status Harian
      const schedulesData = await ScheduleRepository.getAllActive();
      const dailyStatsData = await DailyStateRepository.getTodayStats();
      setSchedules(schedulesData);
      setScheduleStats(dailyStatsData);

      // Load Morning Notes & Statistik Mingguan
      await checkStatus(); 
      const wStats = await getWeeklyStats(); 
      setWeeklyStats(wStats);

    } catch (error) {
      console.error('Gagal memuat data:', error);
    }
  }, [checkStatus, getWeeklyStats]); 

  // Auto Refresh saat layar dibuka
  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [loadAllData])
  );

  // Manual Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

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
      await loadAllData();
    } catch (error) {
      console.error('Gagal tambah sample:', error);
    }
  };

  // --- RENDER ---
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.neon.cyan} />
        }
      >
        {/* 1. Header */}
        <View style={styles.header}>
          <View>
            <Text variant="h1" weight="bold">BodyClock</Text>
            <Text variant="caption" color="secondary">Sinkronisasi ritme tubuh</Text>
          </View>
          <ThemeToggle />
        </View>

        {/* 2. Morning Note Summary */}
        {todayNote && (
          <Card style={styles.section}> 
            <View style={styles.rowBetween}>
              <Text variant="h3" weight="semibold">Mood Hari Ini</Text>
              <Text variant="h2">{MOOD_EMOJI[todayNote.mood]}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statRowSimple}>
                <Text color="secondary">Tidur</Text>
                <Text color="neon-cyan">{'⭐'.repeat(todayNote.sleep_quality)}</Text>
              </View>
              <View style={styles.statRowSimple}>
                <Text color="secondary">Energi</Text>
                <Text color="neon-purple">{'⚡'.repeat(todayNote.energy_level)}</Text>
              </View>
            </View>
            {todayNote.notes && (
              <Text variant="caption" color="tertiary" style={{ marginTop: 8, fontStyle: 'italic' }}>
                &quot;{todayNote.notes}&quot;
              </Text>
            )}
          </Card>
        )}

        {/* 3. Kartu Statistik Gabungan */}
        <View style={styles.gridContainer}>
          <Card variant="neon" style={[styles.gridItem, { flex: 1 }] as any}>
            <Text variant="caption" color="secondary" style={{ marginBottom: 4 }}>Tugas Hari Ini</Text>
            <Text variant="h2" weight="bold" color="neon-cyan">
              {scheduleStats.total > 0 
                  ? Math.round((scheduleStats.completed / scheduleStats.total) * 100) 
                  : 0}%
            </Text>
            <Text variant="caption" color="secondary">
              {scheduleStats.completed}/{scheduleStats.total} Selesai
            </Text>
          </Card>

          <Card style={[styles.gridItem, { flex: 1 }] as any}>
            <Text variant="caption" color="secondary" style={{ marginBottom: 4 }}>Rata-rata Minggu Ini</Text>
            <View>
                <Text variant="caption">😴 {weeklyStats.avgSleepQuality.toFixed(1)}/5.0</Text>
                <Text variant="caption">⚡ {weeklyStats.avgEnergyLevel.toFixed(1)}/5.0</Text>
            </View>
          </Card>
        </View>

        {/* 4. Tombol Aksi */}
        <View style={styles.section}>
          <Button variant="secondary" onPress={handleAddSample} fullWidth>
            + Tambah Jadwal (Test)
          </Button>
        </View>

        {/* 5. Daftar Jadwal */}
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: 12 }}>
            Jadwal Aktif
          </Text>
          
          {schedules.length === 0 ? (
            <Text color="secondary" style={{ fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
              Belum ada jadwal. Tekan tombol di atas untuk mencoba.
            </Text>
          ) : (
            schedules.map((item) => (
              <Card key={item.id} style={{ marginBottom: 10, padding: 12 }}>
                <View style={styles.rowBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text variant="h2">{item.icon || '📅'}</Text>
                    <View>
                      <Text weight="semibold" variant="body">{item.name}</Text>
                      {item.description && (
                        <Text variant="caption" color="secondary">{item.description}</Text>
                      )}
                    </View>
                  </View>
                  <Text weight="bold" color="neon-cyan" variant="h3">{item.time}</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    marginTop: 8,
    gap: 4,
  },
  statRowSimple: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  gridItem: {
    padding: SPACING.md,
    minHeight: 100,
    justifyContent: 'center',
  },
});