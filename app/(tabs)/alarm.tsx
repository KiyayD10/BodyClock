import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAlarm } from '@/hooks/useAlarm';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlarmCard } from '@/components/features/AlarmCard';
import { SPACING } from '@/constants/theme';

export default function AlarmScreen() {
    const { colors } = useTheme();
    const {
        isInitialized,
        hasPermission,
        wakeAlarm,
        sleepAlarm,
        setWakeTime,
        setSleepTime,
        toggleWake,
        toggleSleep,
        testWakeAlarm,
        testSleepAlarm,
        requestPermission,
    } = useAlarm();

    // 1. Loading State
    if (!isInitialized) {
        return (
            <View style={[styles.container, { backgroundColor: colors.bg, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={colors.neon.cyan} />
                <Text variant="body" color="secondary" center style={{ marginTop: 16 }}>
                    Menyiapkan layanan alarm...
                </Text>
            </View>
        );
    }

    // 2. Permission State (Jika izin ditolak)
    if (!hasPermission) {
        return (
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                <View style={styles.centered}>
                    <Text variant="h1" style={{ fontSize: 48, marginBottom: 16 }}>🔔</Text>
                    <Text variant="h3" weight="semibold" center style={styles.permissionTitle}>
                        Butuh Izin Notifikasi
                    </Text>
                    <Text variant="body" color="secondary" center style={styles.permissionText}>
                        BodyClock memerlukan izin notifikasi agar alarm bisa berbunyi tepat waktu.
                    </Text>
                    <Button variant="primary" onPress={requestPermission}>
                        Berikan Izin
                    </Button>
                </View>
            </View>
        );
    }

    // 3. Main Content
    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text variant="h1" weight="bold">
                        Jadwal Tidur
                    </Text>
                    <Text variant="caption" color="secondary">
                        Atur siklus bangun dan tidurmu
                    </Text>
                </View>

                {/* Info Card */}
                <Card style={styles.section}>
                    <Text variant="body" color="secondary" style={{ fontSize: 13 }}>
                        Info: Alarm tetap akan berbunyi meskipun aplikasi ditutup. Pastikan HP tidak dalam mode hening total.
                    </Text>
                </Card>

                {/* Wake Alarm Card */}
                <View style={styles.section}>
                    <AlarmCard
                        type="wake"
                        time={wakeAlarm?.time || null}
                        enabled={wakeAlarm?.enabled || false}
                        onToggle={toggleWake}
                        onSetTime={(time) => setWakeTime(time, true)}
                        onTest={testWakeAlarm}
                    />
                </View>

                {/* Sleep Alarm Card */}
                <View style={styles.section}>
                    <AlarmCard
                        type="sleep"
                        time={sleepAlarm?.time || null}
                        enabled={sleepAlarm?.enabled || false}
                        onToggle={toggleSleep}
                        onSetTime={(time) => setSleepTime(time, true)}
                        onTest={testSleepAlarm}
                    />
                </View>

                {/* Stats Card (Ringkasan) */}
                {wakeAlarm && sleepAlarm && (
                    <Card style={styles.section} variant="neon">
                        <Text variant="h3" weight="semibold" color="neon-cyan">
                            Ringkasan Siklus
                        </Text>
                        <View style={styles.statsContent}>
                            <View style={styles.statRow}>
                                <Text color="secondary">Waktu Tidur</Text>
                                <Text weight="semibold" color="neon-purple">
                                    {sleepAlarm.time.hours.toString().padStart(2, '0')}:
                                    {sleepAlarm.time.minutes.toString().padStart(2, '0')}
                                </Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text color="secondary">Waktu Bangun</Text>
                                <Text weight="semibold" color="neon-cyan">
                                    {wakeAlarm.time.hours.toString().padStart(2, '0')}:
                                    {wakeAlarm.time.minutes.toString().padStart(2, '0')}
                                </Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statRow}>
                                <Text color="secondary">Durasi Istirahat</Text>
                                <Text weight="bold" style={{ fontSize: 18 }}>
                                    {calculateSleepDuration(sleepAlarm.time, wakeAlarm.time)}
                                </Text>
                            </View>
                        </View>
                    </Card>
                )}
            </ScrollView>
        </View>
    );
}

// Helper function: Hitung selisih waktu
function calculateSleepDuration(
    sleep: { hours: number; minutes: number },
    wake: { hours: number; minutes: number }
): string {
    let sleepMinutes = sleep.hours * 60 + sleep.minutes;
    let wakeMinutes = wake.hours * 60 + wake.minutes;

    // Jika waktu bangun lebih kecil dari tidur (misal tidur 22:00, bangun 06:00), tambah 24 jam
    if (wakeMinutes < sleepMinutes) {
        wakeMinutes += 24 * 60;
    }

    const durationMinutes = wakeMinutes - sleepMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    // PERBAIKAN DI SINI: Menggunakan backticks (`)
    return minutes > 0 ? `${hours}j ${minutes}m` : `${hours} Jam`;
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
        marginBottom: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        gap: SPACING.md,
    },
    permissionTitle: {
        marginTop: SPACING.md,
    },
    permissionText: {
        marginBottom: SPACING.lg,
    },
    statsContent: {
        marginTop: SPACING.md,
        gap: SPACING.sm,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 8,
    }
});