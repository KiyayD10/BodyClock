import { View, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { SPACING } from '@/constants/theme';
import { AlarmTime } from '@/types/alarm';

interface AlarmCardProps {
    type: 'wake' | 'sleep';
    time: AlarmTime | null;
    enabled: boolean;
    onToggle: () => void;
    onSetTime: (time: AlarmTime) => void;
    onTest: () => void;
}

export function AlarmCard({ type, time, enabled, onToggle, onSetTime, onTest }: AlarmCardProps) {
    const { colors } = useTheme();
  
    // State lokal untuk picker (draft sebelum disave)
    const [hours, setHours] = useState(time?.hours || (type === 'wake' ? 6 : 22));
    const [minutes, setMinutes] = useState(time?.minutes || 0);

    // Efek: Update tampilan picker jika data dari database berubah/selesai loading
    useEffect(() => {
        if (time) {
            setHours(time.hours);
            setMinutes(time.minutes);
        }
    }, [time]);

    const icon = type === 'wake' ? '⏰' : '😴';
    const title = type === 'wake' ? 'Alarm Bangun' : 'Waktu Tidur';
    const color = type === 'wake' ? colors.neon.cyan : colors.neon.purple;

    // Format waktu untuk display utama (Data yang tersimpan)
    const formatSavedTime = () => {
        if (!time) return '--:--';
        const h = time.hours.toString().padStart(2, '0');
        const m = time.minutes.toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    const handleSave = () => {
        onSetTime({ hours, minutes });
    };

    const incrementHours = () => setHours((prev) => (prev + 1) % 24);
    const decrementHours = () => setHours((prev) => (prev - 1 + 24) % 24);
    const incrementMinutes = () => setMinutes((prev) => (prev + 5) % 60);
    const decrementMinutes = () => setMinutes((prev) => (prev - 5 + 60) % 60);

    return (
        <Card variant={enabled ? 'neon' : 'default'}>
            {/* Header & Toggle */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text variant="h3" style={{ fontSize: 32 }}>{icon}</Text>
                        <View style={styles.titleText}>
                            <Text variant="h3" weight="semibold">{title}</Text>
                                <Text variant="caption" color="secondary">
                                {enabled ? 'Aktif' : 'Nonaktif'}
                            </Text>
                        </View>
                    </View>

                    {/* Custom Toggle Switch */}
                    <Pressable
                        onPress={onToggle}
                        style={[
                            styles.toggle,
                            { backgroundColor: enabled ? color : colors.border },
                        ]}
                    >
                        <View
                            style={[
                                styles.toggleThumb,
                                {
                                    backgroundColor: colors.bg,
                                    transform: [{ translateX: enabled ? 26 : 2 }],
                                },
                            ]}
                        />
                    </Pressable>
                </View>

                {/* Display Waktu Tersimpan */}
                <View style={styles.timeDisplay}>
                <Text variant="caption" color="secondary" style={{ marginBottom: 4 }}>
                    Waktu Terjadwal
                </Text>
                <Text variant="h1" weight="bold" style={{ color: enabled ? color : colors.text.secondary, fontSize: 48 }}>
                    {formatSavedTime()}
                </Text>
            </View>

            <View style={styles.divider} />

            {/* Editor Waktu (Picker Manual) */}
            <View style={styles.editorContainer}>
                <Text variant="label" color="tertiary" style={{ marginBottom: 8 }}>
                    Atur Ulang Waktu:
                </Text>
        
                <View style={styles.timePicker}>
                    {/* Jam */}
                    <View style={styles.timePickerColumn}>
                        <Pressable onPress={incrementHours} hitSlop={10} style={styles.pickerButton}>
                            <Text variant="h3" color="primary">▲</Text>
                        </Pressable>
                        <Text variant="h2" weight="bold">
                            {hours.toString().padStart(2, '0')}
                        </Text>
                        <Pressable onPress={decrementHours} hitSlop={10} style={styles.pickerButton}>
                            <Text variant="h3" color="primary">▼</Text>
                        </Pressable>
                    </View>

                    <Text variant="h2" weight="bold" style={{ paddingBottom: 8 }}>:</Text>

                    {/* Menit */}
                    <View style={styles.timePickerColumn}>
                        <Pressable onPress={incrementMinutes} hitSlop={10} style={styles.pickerButton}>
                            <Text variant="h3" color="primary">▲</Text>
                        </Pressable>
                        <Text variant="h2" weight="bold">
                            {minutes.toString().padStart(2, '0')}
                        </Text>
                        <Pressable onPress={decrementMinutes} hitSlop={10} style={styles.pickerButton}>
                            <Text variant="h3" color="primary">▼</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button variant="primary" onPress={handleSave} style={styles.actionButton}>
                        Simpan Perubahan
                    </Button>
                    <Button variant="ghost" onPress={onTest} style={styles.actionButton}>
                        Tes Alarm
                    </Button>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    titleText: {
        gap: 2,
    },
    toggle: {
        width: 56,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
    },
    toggleThumb: {
        width: 28,
        height: 28,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    timeDisplay: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: SPACING.md,
    },
    editorContainer: {
        alignItems: 'center',
    },
    timePicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    timePickerColumn: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    pickerButton: {
        padding: SPACING.xs,
        opacity: 0.8,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.md,
        width: '100%',
    },
    actionButton: {
        flex: 1,
    },
});