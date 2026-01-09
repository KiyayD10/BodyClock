import { View, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useRecipes } from '@/hooks/useRecipes';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';
import { RECIPE_CATEGORIES, RecipeCategory } from '@/types/recipes';

export default function CreateRecipeScreen() {
    const { colors } = useTheme();
    const { createRecipe } = useRecipes();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<RecipeCategory>('sayur');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');

    const handleSave = async () => {
        if (!title || !ingredients || !steps) {
            Alert.alert('Eits!', 'Mohon isi semua bagian yang wajib ya.');
            return;
        }

        try {
            await createRecipe({
                title,
                category,
                ingredients: ingredients.split('\n').filter(i => i.trim() !== ''),
                steps: steps.split('\n').filter(s => s.trim() !== ''),
                tags: [], 
            });
      
            Alert.alert('Berhasil!', 'Resep baru kamu sudah disimpan.');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Gagal', 'Ada masalah saat menyimpan resep.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            {/* Header navigasi atas */}
            <Stack.Screen options={{ title: 'Tambah Resep Baru', headerShown: true }} />
      
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text variant="h3" weight="bold">Bikin Masakan Apa?</Text>
        
                <View style={styles.form}>
                    <Text variant="body" weight="semibold">Nama Masakan</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text.primary, borderColor: colors.border }]}
                        placeholder="Contoh: Sayur Sop"
                        placeholderTextColor={colors.text.tertiary}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text variant="body" weight="semibold">Kategori</Text>
                    <View style={styles.categoryGrid}>
                        {RECIPE_CATEGORIES.map((cat) => (
                            <Button
                                key={cat.value}
                                variant={category === cat.value ? 'primary' : 'ghost'}
                                onPress={() => setCategory(cat.value)}
                                style={styles.categoryItem}
                            >
                                {`${cat.icon} ${cat.label}`}
                            </Button>
                        ))}
                    </View>

                    <Text variant="body" weight="semibold">Bahan-bahan (Pisahkan dengan baris baru)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text.primary, borderColor: colors.border }]}
                        multiline
                        numberOfLines={4}
                        placeholder="Wortel&#10;Kentang&#10;Buncis"
                        placeholderTextColor={colors.text.tertiary}
                        value={ingredients}
                        onChangeText={setIngredients}
                    />

                    <Text variant="body" weight="semibold">Langkah Memasak</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text.primary, borderColor: colors.border }]}
                        multiline
                        numberOfLines={4}
                        placeholder="1. Potong sayuran&#10;2. Rebus air"
                        placeholderTextColor={colors.text.tertiary}
                        value={steps}
                        onChangeText={setSteps}
                    />
                </View>

                <Button variant="primary" onPress={handleSave} style={styles.saveButton}>
                    Simpan Resep
                </Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: SPACING.lg, gap: SPACING.lg },
    form: { gap: SPACING.md },
    input: {
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
    },
    textArea: { minHeight: 100, textAlignVertical: 'top' },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    categoryItem: { paddingHorizontal: SPACING.sm, minWidth: '30%' },
    saveButton: { marginTop: SPACING.lg, paddingVertical: SPACING.md },
});