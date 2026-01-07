import { Pressable, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';
import { MealWithStatus } from '@/types/meals';

interface MealChecklistItemProps {
    meal: MealWithStatus;
    onToggle: () => void;
}

export function MealChecklistItem({ meal, onToggle }: MealChecklistItemProps) {
    const { colors } = useTheme();
    // Cek apakah statusnya selesai
    const isCompleted = meal.completed === 1;

    return (
        <Pressable
            onPress={onToggle}
                style={({ pressed }) => [
                    styles.container,
                    {
                        // Ubah warna background dan border kalau selesai
                        backgroundColor: isCompleted ? colors.neon.cyan + '20' : colors.card,
                        borderColor: isCompleted ? colors.neon.cyan : colors.border,
                        opacity: pressed ? 0.9 : 1,
                    },
                ]}
            >
            {/* Checkbox */}
            <View
                style={[
                    styles.checkbox,
                    {
                        backgroundColor: isCompleted ? colors.neon.cyan : 'transparent',
                        borderColor: isCompleted ? colors.neon.cyan : colors.border,
                    },
                ]}
            >
                {isCompleted && (
                    <Text variant="body" style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>
                        ✓
                    </Text>
                )}
            </View>

            {/* Info Makanan */}
            <View style={styles.info}>
                <View style={styles.titleRow}>
                    <Text variant="body">{meal.icon || '🍽️'}</Text>
                    <Text
                        variant="body"
                        weight="semibold"
                        style={{ textDecorationLine: isCompleted ? 'line-through' : 'none', color: isCompleted ? colors.text.secondary : colors.text.primary }}
                    >
                        {meal.name}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text variant="caption" color="secondary">
                        {meal.time}
                    </Text>
                    {meal.calories && (
                        <>
                            <Text variant="caption" color="tertiary">
                                •
                            </Text>
                            <Text variant="caption" color="secondary">
                                {meal.calories} cal
                            </Text>
                        </>
                    )}
                </View>
            </View>

            {/* Waktu Selesai */}
            {isCompleted && meal.completed_at && (
                <Text variant="caption" color="tertiary">
                    Selesai
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg, 
        borderWidth: 1,
        gap: SPACING.md,
        marginBottom: SPACING.sm, 
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: BORDER_RADIUS.sm, 
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        gap: SPACING.xs,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
});