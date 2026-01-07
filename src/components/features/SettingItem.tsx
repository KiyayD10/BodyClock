import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';
import { ReactNode } from 'react';

interface SettingItemProps {
    icon?: string;
    title: string;
    description?: string;
    value?: string;
    onPress?: () => void;
    rightElement?: ReactNode;
    danger?: boolean;
}

export function SettingItem({
    icon,
    title,
    description,
    value,
    onPress,
    rightElement,
    danger = false,
}: SettingItemProps) {
    const { colors } = useTheme();

    // Tentukan wrapper: jika ada onPress pakai Pressable, jika tidak pakai View biasa
    const Wrapper = onPress ? Pressable : View;

    return (
        <Wrapper
            onPress={onPress}
            style={({ pressed }: { pressed: boolean }) => [
                styles.container,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    // Tambahkan efek visual saat ditekan
                    opacity: onPress && pressed ? 0.7 : 1,
                },
            ]}
        >
            <View style={styles.content}>
                {icon && <Text variant="h3">{icon}</Text>}
                <View style={styles.textContent}>
                    <Text 
                        variant="body" 
                        weight="medium" 
                        style={{ color: danger ? colors.status?.error || '#FF4444' : undefined }}
                    >
                        {title}
                    </Text>
                    {description && (
                        <Text variant="caption" color="secondary">
                            {description}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.right}>
                {value && (
                    <Text variant="body" color="secondary">
                        {value}
                    </Text>
                )}
                {rightElement}
                {/* Panah indikator jika bisa ditekan & tidak ada elemen kanan lain */}
                {onPress && !rightElement && (
                    <Text variant="body" color="secondary">
                        ›
                    </Text>
                )}
            </View>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        gap: SPACING.md,
        marginBottom: SPACING.sm, // Tambah margin bawah biar rapi kalau di-list
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    textContent: {
        flex: 1,
        gap: SPACING.xs,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
});