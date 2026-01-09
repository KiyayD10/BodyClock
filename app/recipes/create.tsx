import { View, ScrollView, StyleSheet, TextInput, Alert, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.bg} translucent={false} />
            
            <Stack.Screen options={{ 
                title: 'Tambah Resep Baru', 
                headerShown: true,
                headerStyle: { backgroundColor: colors.bg },
                headerTintColor: colors.text.primary,
                headerShadowVisible: false,
            }} />

            {/* FIX: Gunakan KeyboardAvoidingView agar input terdorong ke atas saat mengetik */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    // FIX: Memastikan keyboard tidak menutup input aktif
                    keyboardShouldPersistTaps="handled"
                >
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

                        <Text variant="body" weight="semibold">Bahan-bahan (Gunakan Enter untuk baris baru)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text.primary, borderColor: colors.border }]}
                            multiline
                            placeholder="Wortel&#10;Kentang&#10;Buncis"
                            placeholderTextColor={colors.text.tertiary}
                            value={ingredients}
                            onChangeText={setIngredients}
                        />

                        <Text variant="body" weight="semibold">Langkah Memasak</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text.primary, borderColor: colors.border }]}
                            multiline
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { 
        paddingHorizontal: SPACING.lg, 
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xl,
        gap: SPACING.lg 
    },
    form: { gap: SPACING.md },
    input: {
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
    },
    textArea: { 
        minHeight: 120, // Sedikit lebih tinggi agar nyaman
        textAlignVertical: 'top' 
    },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    categoryItem: { paddingHorizontal: SPACING.sm, minWidth: '30%' },
    saveButton: { marginTop: SPACING.lg, paddingVertical: SPACING.md },
});