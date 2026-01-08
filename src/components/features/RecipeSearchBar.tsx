import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';
import { RecipeFilters, RecipeCategory, RecipeTag, RECIPE_CATEGORIES, RECIPE_TAGS } from '@/types/recipes';

interface RecipeSearchBarProps {
    filters: RecipeFilters;
    onFiltersChange: (filters: RecipeFilters) => void;
}

export function RecipeSearchBar({ filters, onFiltersChange }: RecipeSearchBarProps) {
    const { colors } = useTheme();
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = (text: string) => {
        onFiltersChange({ ...filters, search: text });
    };

    const toggleCategory = (category: RecipeCategory) => {
        onFiltersChange({
            ...filters,
            category: filters.category === category ? undefined : category,
        });
    };

    const toggleTag = (tag: RecipeTag) => {
        const currentTags = filters.tags || [];
        const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
        onFiltersChange({
            ...filters,
            tags: newTags.length > 0 ? newTags : undefined,
        });
    };

    const clearFilters = () => {
        onFiltersChange({ search: filters.search });
    };

    const hasActiveFilters = !!(filters.category || (filters.tags && filters.tags.length > 0));

    return (
        <View style={styles.container}>
            {/* Search Input */}
            <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text variant="body">🔍</Text>
                <TextInput
                    style={[styles.input, { color: colors.text.primary }]}
                    placeholder="Cari resep masakan..."
                    placeholderTextColor={colors.text.tertiary}
                    value={filters.search || ''}
                    onChangeText={handleSearchChange}
                />
                <Pressable onPress={() => setShowFilters(!showFilters)} hitSlop={10}>
                    <Text 
                        variant="body" 
                        style={{ 
                            color: hasActiveFilters ? colors.neon.cyan : colors.text.secondary,
                            transform: [{ rotate: showFilters ? '180deg' : '0deg' }] 
                        }}
                    >
                        ▼
                    </Text>
                </Pressable>
            </View>

            {/* Filters Overlay/Section */}
            {showFilters && (
                <View style={styles.filters}>
                {/* Category Filter */}
                    <View style={styles.filterSection}>
                        <View style={styles.filterHeader}>
                            <Text variant="caption" weight="semibold" color="secondary">
                                KATEGORI
                            </Text>
                            {filters.category && (
                                <Pressable onPress={clearFilters}>
                                    <Text variant="caption" color="neon-cyan">
                                        Hapus Filter
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                        <View style={styles.filterOptions}>
                            {RECIPE_CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat.value}
                                    onPress={() => toggleCategory(cat.value)}
                                    style={[
                                        styles.filterChip,
                                        {
                                            backgroundColor:
                                            filters.category === cat.value ? colors.neon.cyan + '20' : colors.card,
                                            borderColor: filters.category === cat.value ? colors.neon.cyan : colors.border,
                                        },
                                    ]}
                                >
                                    <Text variant="caption" weight="medium">
                                        {cat.icon} {cat.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                {/* Tags Filter */}
                <View style={styles.filterSection}>
                    <Text variant="caption" weight="semibold" color="secondary">
                        TAG KHUSUS
                    </Text>
                        <View style={styles.filterOptions}>
                            {RECIPE_TAGS.map((tag) => (
                                <Pressable
                                    key={tag.value}
                                    onPress={() => toggleTag(tag.value)}
                                    style={[
                                        styles.filterChip,
                                        {
                                            backgroundColor:
                                            filters.tags?.includes(tag.value) ? colors.neon.purple + '20' : colors.card,
                                            borderColor: filters.tags?.includes(tag.value) ? colors.neon.purple : colors.border,
                                        },
                                    ]}
                                >
                                    <Text variant="caption" weight="medium">
                                        {tag.icon} {tag.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SPACING.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        gap: SPACING.sm,
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZE.base,
        paddingVertical: SPACING.xs,
    },
    filters: {
        gap: SPACING.md,
        paddingBottom: SPACING.xs,
    },
    filterSection: {
        gap: SPACING.sm,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    filterChip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
    },
});