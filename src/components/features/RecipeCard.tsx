import { Pressable, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Recipe, RECIPE_CATEGORIES } from '@/types/recipes';

interface RecipeCardProps {
    recipe: Recipe;
    onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
    const { colors } = useTheme();

    const categoryInfo = RECIPE_CATEGORIES.find((c) => c.value === recipe.category);

        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.container,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        opacity: pressed ? 0.8 : 1,
                    },
                ]}
            >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text variant="body">{categoryInfo?.icon}</Text>
                    <Text variant="body" weight="semibold" numberOfLines={1} style={styles.title}>
                        {recipe.title}
                    </Text>
                </View>
                {recipe.is_archived === 1 && (
                    <View style={[styles.badge, { backgroundColor: colors.status.warning + '20' }]}>
                        <Text variant="caption" style={{ color: colors.status.warning }}>
                            Diarsipkan
                        </Text>
                    </View>
                )}
            </View>

            {/* Tags */}
            {recipe.tags.length > 0 && (
                <View style={styles.tags}>
                    {recipe.tags.map((tag) => (
                        <View
                            key={tag}
                            style={[
                                styles.tag,
                                {
                                    backgroundColor:
                                    tag === 'bulking' ? colors.neon.purple + '20' : colors.neon.cyan + '20',
                                    borderColor: tag === 'bulking' ? colors.neon.purple : colors.neon.cyan,
                                },
                            ]}
                            >
                            <Text
                                variant="caption"
                                weight="medium"
                                style={{ color: tag === 'bulking' ? colors.neon.purple : colors.neon.cyan }}
                            >
                                {tag === 'bulking' ? '💪 Bulking' : '💰 Murah'}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Info */}
            <View style={styles.info}>
                <Text variant="caption" color="secondary">
                    {recipe.ingredients.length} bahan • {recipe.steps.length} langkah
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.lg, // FIX: BORDER_RADIUS
        padding: SPACING.md,
        borderWidth: 1,
        gap: SPACING.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    titleRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    title: {
        flex: 1,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm, // FIX: BORDER_RADIUS
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs,
    },
    tag: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm, // FIX: BORDER_RADIUS
        borderWidth: 1,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});