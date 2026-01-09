import { View, ScrollView, StyleSheet, Alert, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';
import { RecipesRepository } from '@/database/repositories/RecipesRepository';
import { Recipe, RECIPE_CATEGORIES } from '@/types/recipes';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';
import { RecipeDeleteConfirm } from '@/components/features/RecipeDeleteConfirm';

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();
    const { colors } = useTheme();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const loadRecipe = useCallback(async () => {
        const data = await RecipesRepository.getById(Number(id));
        if (data) {
            setRecipe(data);
        } else {
            Alert.alert('Error', 'Resep tidak ditemukan');
            router.back();
        }
    }, [id]);

    useEffect(() => {
        loadRecipe();
    }, [loadRecipe]); 

    const handleDelete = async () => {
        await RecipesRepository.deletePermanent(Number(id));
        setShowDeleteModal(false);
        router.replace('/recipes' as any);
    };

    if (!recipe) return null;

    const categoryInfo = RECIPE_CATEGORIES.find(c => c.value === recipe.category);

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            {/* Paksa StatusBar agar tidak translucent atau set warna background-nya */}
            <StatusBar 
                barStyle="light-content" 
                backgroundColor={colors.bg} 
                translucent={false} 
            />
            
            <Stack.Screen options={{ 
                title: 'Detail Resep',
                headerShown: true,
                headerStyle: { 
                    backgroundColor: colors.bg,
                },
                headerTintColor: colors.text.primary,
                headerShadowVisible: false,
                headerRight: () => (
                    <Button variant="ghost" onPress={() => setShowDeleteModal(true)}>
                        Hapus
                    </Button>
                )
            }} />

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text variant="h1" weight="bold">{recipe.title}</Text>
                    <View style={[styles.badge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text variant="body">{`${categoryInfo?.icon} ${categoryInfo?.label}`}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="h3" weight="bold" style={styles.sectionTitle}>Bahan-Bahan</Text>
                    <Card style={styles.cardList}>
                        {recipe.ingredients.map((item, index) => (
                            <View key={index} style={styles.listItem}>
                                <Text variant="body" color="neon-cyan">•</Text>
                                <Text variant="body" style={styles.listText}>{item}</Text>
                            </View>
                        ))}
                    </Card>
                </View>

                <View style={styles.section}>
                    <Text variant="h3" weight="bold" style={styles.sectionTitle}>Langkah Memasak</Text>
                    {recipe.steps.map((step, index) => (
                        <View key={index} style={styles.stepContainer}>
                            <View style={[styles.stepNumber, { backgroundColor: colors.neon.cyan }]}>
                                <Text weight="bold" style={{ color: '#000' }}>{index + 1}</Text>
                            </View>
                            <Card style={styles.stepCard}>
                                <Text variant="body">{step}</Text>
                            </Card>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <RecipeDeleteConfirm
                visible={showDeleteModal}
                recipe={recipe}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        // CARA AMPUH: Tambahkan padding top manual sebesar tinggi status bar khusus Android
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: { 
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl, 
        paddingTop: SPACING.sm,
        gap: SPACING.xl 
    },
    // ... sisa style sama
    header: { gap: SPACING.sm, marginBottom: SPACING.sm },
    badge: { alignSelf: 'flex-start', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, borderWidth: 1 },
    section: { gap: SPACING.md },
    sectionTitle: { marginBottom: SPACING.xs },
    cardList: { padding: SPACING.md, gap: SPACING.sm },
    listItem: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
    listText: { flex: 1 },
    stepContainer: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm },
    stepNumber: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
    stepCard: { flex: 1, padding: SPACING.md },
});