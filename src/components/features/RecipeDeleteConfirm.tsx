import { View, Modal, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';
import { Recipe } from '@/types/recipes';

interface RecipeDeleteConfirmProps {
    visible: boolean;
    recipe: Recipe | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function RecipeDeleteConfirm({ visible, recipe, onConfirm, onCancel }: RecipeDeleteConfirmProps) {
    const { colors } = useTheme();
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!recipe) return null;

    // Validasi
    const isConfirmValid = confirmText.trim().toLowerCase() === recipe.title.toLowerCase();

    const handleConfirm = async () => {
        if (!isConfirmValid) {
            Alert.alert('Kesalahan', 'Nama resep yang Anda ketik tidak cocok');
            return;
        }

        setIsDeleting(true);
        try {
            await onConfirm();
            setConfirmText('');
        } catch (error) {
            console.error('Gagal menghapus resep:', error);
            Alert.alert('Gagal', 'Gagal menghapus resep');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        setConfirmText('');
        onCancel();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={handleCancel}>
                <Pressable onPress={(e) => e.stopPropagation()} style={styles.modalWrapper}>
                    <Card style={{ ...styles.modal, backgroundColor: colors.card }}>
                        {/* Ikon Peringatan */}
                        <View style={styles.iconContainer}>
                            <Text variant="h1">⚠️</Text>
                        </View>

                        {/* Judul */}
                        <Text variant="h3" weight="bold" center>
                            Hapus Resep Permanen?
                        </Text>

                        {/* Peringatan Bahaya */}
                        <View style={[styles.warning, { backgroundColor: colors.status.error + '15' }]}>
                            <Text variant="body" color="secondary" center>
                                Tindakan ini tidak dapat dibatalkan. Resep akan dihapus selamanya dari perangkat Anda.
                            </Text>
                        </View>

                        {/* Informasi Resep yang akan dihapus */}
                        <View style={[styles.recipeInfo, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                            <Text variant="body" weight="semibold">
                                {recipe.title}
                            </Text>
                            <Text variant="caption" color="secondary">
                                {recipe.ingredients.length} bahan • {recipe.steps.length} langkah
                            </Text>
                        </View>

                        {/* Bagian Konfirmasi Ketik */}
                        <View style={styles.confirmSection}>
                            <Text variant="caption" color="secondary">
                                Ketik nama resep di bawah untuk konfirmasi penghapusan:
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.bg,
                                        borderColor: confirmText.length > 0 
                                        ? (isConfirmValid ? colors.status.success : colors.status.error) 
                                        : colors.border,
                                        color: colors.text.primary,
                                    },
                                ]}
                                placeholder={recipe.title}
                                placeholderTextColor={colors.text.tertiary}
                                value={confirmText}
                                onChangeText={setConfirmText}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Tombol Aksi */}
                        <View style={styles.actions}>
                            <Button 
                                variant="ghost" 
                                onPress={handleCancel} 
                                disabled={isDeleting} 
                                style={styles.actionButton}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="primary"
                                onPress={handleConfirm}
                                disabled={!isConfirmValid || isDeleting}
                                loading={isDeleting}
                                style={[
                                    styles.actionButton, 
                                    { backgroundColor: isConfirmValid ? colors.status.error : colors.text.tertiary }
                                ]}
                            >
                                Hapus Selamanya
                            </Button>
                        </View>
                    </Card>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    modalWrapper: {
        width: '100%',
        maxWidth: 400,
    },
    modal: {
        padding: SPACING.xl,
        gap: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
    },
    iconContainer: {
        alignItems: 'center',
    },
    warning: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
    },
    recipeInfo: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        gap: SPACING.xs,
    },
    confirmSection: {
        gap: SPACING.sm,
    },
    input: {
        borderWidth: 2,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZE.base,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.sm,
    },
    actionButton: {
        flex: 1,
    },
});