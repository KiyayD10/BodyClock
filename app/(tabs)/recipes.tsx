import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
// FIX: Gunakan SafeAreaView agar konten tidak tertutup Status Bar
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useRecipes } from '@/hooks/useRecipes';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RecipeCard } from '@/components/features/RecipeCard';
import { RecipeSearchBar } from '@/components/features/RecipeSearchBar';
import { RecipeDeleteConfirm } from '@/components/features/RecipeDeleteConfirm';
import { SPACING } from '@/constants/theme';
import { Recipe } from '@/types/recipes';

export default function RecipesScreen() {
    const { colors } = useTheme();
    const { 
        recipes, 
        filters, 
        isLoading, 
        categoryCount, 
        setFilters, 
        loadRecipes, 
        deleteRecipe 
    } = useRecipes();

    const [refreshing, setRefreshing] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadRecipes();
        setRefreshing(false);
    };

    const handleDeleteConfirm = async () => {
        if (recipeToDelete) {
            await deleteRecipe(recipeToDelete.id);
            setRecipeToDelete(null);
        }
    };

    const totalRecipes = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);

    return (
        // edges={['top']} memastikan padding hanya di bagian atas layar
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={handleRefresh} 
                        tintColor={colors.neon.cyan} 
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text variant="h1" weight="bold">
                            Resep
                        </Text>
                        <Text variant="caption" color="secondary">
                            {totalRecipes} resep tersimpan
                        </Text>
                    </View>
                    <Button 
                        variant="primary" 
                        onPress={() => router.push('/recipes/create' as any)}
                        style={styles.addButton}
                    >
                        + Baru
                    </Button>
                </View>

                {/* Search & Filter */}
                <View style={styles.searchSection}>
                    <RecipeSearchBar filters={filters} onFiltersChange={setFilters} />
                </View>

                {/* Recipe List */}
                {isLoading && !refreshing ? (
                    <Card>
                        <Text variant="body" color="secondary" center>
                            Memuat resep...
                        </Text>
                    </Card>
                ) : recipes.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Text variant="body" color="secondary" center>
                            {filters.search || filters.category || (filters.tags && filters.tags.length > 0)
                            ? 'Tidak ada resep yang cocok dengan filter'
                            : 'Belum ada resep. Mulai buat resep pertamamu!'}
                        </Text>
                    </Card>
                ) : (
                    <View style={styles.recipesList}>
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onPress={() => router.push(`/recipes/${recipe.id}` as any)}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Delete Confirmation */}
            <RecipeDeleteConfirm
                visible={!!recipeToDelete}
                recipe={recipeToDelete}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setRecipeToDelete(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
        // Tambahkan padding top ekstra jika dirasa masih terlalu mepet
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xxl, 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    addButton: {
        paddingHorizontal: SPACING.md,
    },
    searchSection: {
        marginBottom: SPACING.xl,
    },
    recipesList: {
        gap: SPACING.md,
    },
    emptyCard: {
        paddingVertical: SPACING.xl,
        borderStyle: 'dashed',
    },
});