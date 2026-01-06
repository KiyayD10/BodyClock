import { View, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useMorningNotes } from '@/hooks/useMorningNotes';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MoodSelector } from '@/components/features/MoodSelector';
import { StarRating } from '@/components/features/StarRating';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';
import { CreateMorningNoteDTO, MorningNote } from '@/types/morningNotes';

export default function MorningNotesScreen() {
    const { colors } = useTheme();
    const { save } = useMorningNotes();
    const [mood, setMood] = useState<MorningNote['mood']>('okay');
    const [sleepQuality, setSleepQuality] = useState(3);
    const [energyLevel, setEnergyLevel] = useState(3);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const data: CreateMorningNoteDTO = {
                mood,
                sleep_quality: sleepQuality,
                energy_level: energyLevel,
                notes: notes.trim() || undefined,
            };

            await save(data);

        // Kembali ke halaman utama (Home)
        router.replace('/(tabs)');
        } catch (error) {
            console.error('Gagal menyimpan jurnal:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.bg }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text variant="h1" weight="bold">
                        Selamat Pagi!
                    </Text>
                    <Text variant="body" color="secondary">
                        Bagaimana tidurmu semalam? Yuk catat sebentar.
                    </Text>
                </View>

                {/* Mood Section */}
                <Card style={styles.section}>
                    <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
                        Gimana perasaanmu?
                    </Text>
                    <MoodSelector selected={mood} onSelect={setMood} />
                </Card>

                {/* Sleep Quality Section */}
                <Card style={styles.section}>
                    <StarRating
                        label="Kualitas Tidur"
                        value={sleepQuality}
                        onChange={setSleepQuality}
                    />
                </Card>

                 {/* Energy Level Section */}
                <Card style={styles.section}>
                    <StarRating
                        label="Tingkat Energi Saat Ini"
                        value={energyLevel}
                        onChange={setEnergyLevel}
                    />
                </Card>

                {/* Notes Section */}
                <Card style={styles.section}>
                    <Text variant="body" weight="medium" color="secondary" style={styles.sectionTitle}>
                        Catatan Tambahan (Opsional)
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                backgroundColor: colors.bg,
                                borderColor: colors.border,
                                color: colors.text.primary,
                            },
                        ]}
                        placeholder="Ada mimpi aneh? Atau bangun kesiangan..."
                        placeholderTextColor={colors.text.tertiary}
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={setNotes}
                        maxLength={200}
                    />
                    <Text variant="caption" color="tertiary" style={styles.charCount}>
                        {notes.length}/200
                    </Text>
                </Card>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        variant="primary"
                        onPress={handleSave}
                        loading={isSaving}
                        disabled={isSaving}
                        fullWidth
                    >
                        Simpan & Lanjutkan
                    </Button>
                    <Button variant="ghost" onPress={handleSkip} disabled={isSaving} fullWidth>
                        Lewati Dulu
                    </Button>
                </View>

                {/* Info */}
                <Card variant="neon" style={styles.info}>
                    <Text variant="caption" color="secondary" center>
                        Data ini membantu kamu memantau pola tidur dan kesehatan mood harianmu.
                    </Text>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingTop: 60, 
    },
    header: {
        marginBottom: SPACING.xl,
        gap: SPACING.sm,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        marginBottom: SPACING.md,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        fontSize: FONT_SIZE.base,
        textAlignVertical: 'top',
        minHeight: 100,
    },
    charCount: {
        marginTop: SPACING.xs,
        textAlign: 'right',
    },
    actions: {
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    info: {
        marginBottom: SPACING.xl,
    },
});