import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native'; // Tambah ActivityIndicator
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useToday } from '@/hooks/useToday';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { MealChecklistItem } from '@/components/features/MealCheckListItem';
import { ProgressCircle } from '@/components/features/ProgressCircle'; 
import { SPACING } from '@/constants/theme';
import { MOOD_EMOJI } from '@/types/morningNotes';

export default function TodayScreen() {
    const { colors } = useTheme();
    const { meals, mealStats, morningNote, isLoading, loadData, toggleMeal } = useToday();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Ambil tanggal hari ini
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
                <ActivityIndicator size="large" color={colors.neon.cyan} />
                <Text variant="body" color="secondary" style={{ marginTop: SPACING.md }}>
                    Memuat data hari ini...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text variant="h1" weight="bold">
                        Today
                    </Text>
                    <Text variant="caption" color="secondary">
                        {dateStr}
                    </Text>
                </View>

                {/* Progress Card */}
                <Card variant="neon" style={styles.section}>
                    <View style={styles.progressContainer}>
                        <ProgressCircle percentage={mealStats.percentage} />
                        <View style={styles.progressText}>
                            <Text variant="h3" weight="bold">
                                Daily Progress
                            </Text>
                            <Text variant="body" color="secondary">
                                {mealStats.completed} of {mealStats.total} meals completed
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Catatan pagi hari */}
                {morningNote && (
                <Card style={styles.section}>
                    <Text variant="h3" weight="semibold" style={styles.cardTitle}>
                        Morning Check-in
                    </Text>
                    <View style={styles.morningNoteContent}>
                        <View style={styles.morningNoteItem}>
                            <Text variant="h1">{MOOD_EMOJI[morningNote.mood]}</Text>
                            <Text variant="caption" color="secondary" center>
                                Mood
                            </Text>
                        </View>
                        <View style={styles.morningNoteItem}>
                            <Text variant="h3" weight="bold" color="neon-cyan">
                                {'⭐'.repeat(morningNote.sleep_quality)}
                            </Text>
                            <Text variant="caption" color="secondary" center>
                                Sleep
                            </Text>
                        </View>
                        <View style={styles.morningNoteItem}>
                            <Text variant="h3" weight="bold" color="neon-purple">
                                {'⭐'.repeat(morningNote.energy_level)}
                            </Text>
                            <Text variant="caption" color="secondary" center>
                                Energy
                            </Text>
                        </View>
                    </View>
                </Card>
            )}

            {/* Check udah makan */}
            <Card style={styles.section}>
                <Text variant="h3" weight="semibold" style={styles.cardTitle}>
                    Meal Schedule
                </Text>
                <View style={styles.mealsList}>
                    {meals.length === 0 ? (
                        <Text variant="body" color="secondary" center>
                            No meals scheduled for today
                        </Text>
                    ) : (
                        meals.map((meal) => (
                            <MealChecklistItem
                                key={meal.id}
                                meal={meal}
                                onToggle={() => toggleMeal(meal.id)}
                            />
                        ))
                    )}
                </View>
            </Card>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                    <Text variant="label" color="tertiary">
                        BREAKFAST
                    </Text>
                    <Text variant="h3" weight="bold" color="neon-cyan">
                        {meals.find((m) => m.type === 'breakfast')?.completed ? '✓' : '○'}
                    </Text>
                </Card>

                <Card style={styles.statCard}>
                    <Text variant="label" color="tertiary">
                        LUNCH
                    </Text>
                    <Text variant="h3" weight="bold" color="neon-purple">
                        {meals.find((m) => m.type === 'lunch')?.completed ? '✓' : '○'}
                    </Text>
                </Card>

                <Card style={styles.statCard}>
                    <Text variant="label" color="tertiary">
                        DINNER
                    </Text>
                    <Text variant="h3" weight="bold" color="neon-cyan">
                        {meals.find((m) => m.type === 'dinner')?.completed ? '✓' : '○'}
                    </Text>
                </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.lg,
        gap: SPACING.xs,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    cardTitle: {
        marginBottom: SPACING.md,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xl,
    },
    progressText: {
        flex: 1,
        gap: SPACING.xs,
    },
    morningNoteContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: SPACING.md,
    },
    morningNoteItem: {
        alignItems: 'center',
        gap: SPACING.sm,
    },
    mealsList: {
        gap: SPACING.md,
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: SPACING.md,
    },
});