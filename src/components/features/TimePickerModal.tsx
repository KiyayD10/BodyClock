import { View, Modal, Pressable, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react'; 
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';
import { AlarmTime } from '@/types/alarm';

interface TimePickerModalProps {
    visible: boolean;
    title: string;
    initialTime: AlarmTime;
    onSave: (time: AlarmTime) => void;
    onCancel: () => void;
}

export function TimePickerModal({ visible, title, initialTime, onSave, onCancel }: TimePickerModalProps) {
    const { colors } = useTheme();
    const [hours, setHours] = useState(initialTime.hours);
    const [minutes, setMinutes] = useState(initialTime.minutes);

    // Reset state saat dibuka atau initialTime berubah
    useEffect(() => {
        if (visible) {
            setHours(initialTime.hours);
            setMinutes(initialTime.minutes);
        }
    }, [visible, initialTime]);

    const incrementHours = () => setHours((prev) => (prev + 1) % 24);
    const decrementHours = () => setHours((prev) => (prev - 1 + 24) % 24);

    // Buat increment menit jadi 1 
    const incrementMinutes = () => setMinutes((prev) => (prev + 1) % 60);
    const decrementMinutes = () => setMinutes((prev) => (prev - 1 + 60) % 60);

    const handleSave = () => {
        onSave({ hours, minutes });
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={onCancel}>
                <Pressable onPress={(e) => e.stopPropagation()} style={styles.modalContainer}>
                    <Card style={{ ...styles.modal, backgroundColor: colors.card }}>
                        <Text variant="h3" weight="semibold" center>
                            {title}
                        </Text>

                        {/* Time Picker */}
                        <View style={styles.timePicker}>

                            {/* Kolom Jam */}
                            <View style={styles.timeColumn}>
                                <Pressable onPress={incrementHours} style={styles.pickerButton}>
                                    <Text variant="h3" color="neon-cyan">▲</Text>
                                </Pressable>
                                <Text variant="h1" weight="bold">
                                    {hours.toString().padStart(2, '0')}
                                </Text>
                                <Pressable onPress={decrementHours} style={styles.pickerButton}>
                                    <Text variant="h3" color="neon-cyan">▼</Text>
                                </Pressable>
                            </View>

                            <Text variant="h1" weight="bold" style={{ paddingBottom: 8 }}>
                                :
                            </Text>

                            {/* Kolom Menit */}
                            <View style={styles.timeColumn}>
                                <Pressable onPress={incrementMinutes} style={styles.pickerButton}>
                                    <Text variant="h3" color="neon-cyan">▲</Text>
                                </Pressable>
                                <Text variant="h1" weight="bold">
                                    {minutes.toString().padStart(2, '0')}
                                </Text>
                                <Pressable onPress={decrementMinutes} style={styles.pickerButton}>
                                    <Text variant="h3" color="neon-cyan">▼</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <Button variant="ghost" onPress={onCancel} style={styles.actionButton}>
                                Cancel
                            </Button>
                            <Button variant="primary" onPress={handleSave} style={styles.actionButton}>
                                Save
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 340, // Batasi lebar agar gak kegedean jika di tablet
    },
    modal: {
        padding: SPACING.xl,
        gap: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl, 
    },
    timePicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.lg,
        paddingVertical: SPACING.lg,
    },
    timeColumn: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    pickerButton: {
        padding: SPACING.sm,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    actionButton: {
        flex: 1,
    },
});