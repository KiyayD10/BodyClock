import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

// Definisi varian dan ukuran yang tersedia agar menjaga konsistensi UI
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'neon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    onPress: () => void;
    children: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function Button({
    onPress,
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
}:  ButtonProps) {
    const { colors } = useTheme();

    // Mapping ukuran padding dan font biar konsisten
    const sizeStyles = {
        sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: FONT_SIZE.sm },
        md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: FONT_SIZE.base },
        lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: FONT_SIZE.lg },
    };

    // Logika untuk warna container dan teks berdasarkan varian & tema aktif
    const getVariantStyle = (): { container: ViewStyle; text: TextStyle } => {
        switch (variant) {
            case 'primary':
                return {
                    container: { backgroundColor: colors.neon.cyan },
                    text: { color: colors.bg, fontWeight: FONT_WEIGHT.semibold },
                };
            case 'secondary':
                return {
                    container: {
                        backgroundColor: colors.card,
                        borderWidth: 1,
                        borderColor: colors.border,
                    },
                    text: { color: colors.text.primary, fontWeight: FONT_WEIGHT.medium },
                };
            case 'ghost':
                return {
                    container: { backgroundColor: 'transparent' },
                    text: { color: colors.text.secondary, fontWeight: FONT_WEIGHT.medium },
                };
            case 'neon':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderColor: colors.neon.purple,
                    },
                    text: { color: colors.neon.purple, fontWeight: FONT_WEIGHT.semibold },
                };
            }
        };

        const variantStyle = getVariantStyle();
        const currentSize = sizeStyles[size];

        return (
            <Pressable
                onPress={onPress}
                disabled={disabled || loading}
                // Gabungin style dasar, ukuran, dan interaksi (opacity pas ditekan)
                style={({ pressed }) => [
                    styles.button,
                    {
                        paddingVertical: currentSize.paddingVertical,
                        paddingHorizontal: currentSize.paddingHorizontal,
                        opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
                        width: fullWidth ? '100%' : 'auto',
                    },
                    variantStyle.container,
                ]}
            >
            {loading ? (
                <ActivityIndicator color={variantStyle.text.color} />
                ) : (
                    <Text
                        style={[
                            { fontSize: currentSize.fontSize },
                            variantStyle.text,
                        ]}
                    >
                    {children}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
});