import { View, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, RADIUS } from '@/constants/theme';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: 'default' | 'neon';
    style?: ViewStyle;
}

export function Card({ children, onPress, variant = 'default', style }: CardProps) {
    const { colors } = useTheme();

    // Style dasar card, warna border menyesuaikan jika mode neon aktif
    const cardStyle: ViewStyle = {
        backgroundColor: colors.card,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: variant === 'neon' ? colors.neon.cyan : colors.border,
    };

    // Jika ada props onPress, render menggunakan Pressable agar bisa diklik
    if (onPress) {
        return (
            <Pressable 
                onPress={onPress} 
                // Tambahkan efek opacity saat ditekan untuk feedback visual ke user
                style={({ pressed }) => [
                    cardStyle, 
                    style, 
                    { opacity: pressed ? 0.9 : 1 } 
                ]}
            >
                {children}
            </Pressable>
        );
    }

    // Jika tidak ada interaksi, render sebagai container View biasa
    return <View style={[cardStyle, style]}>{children}</View>;
}