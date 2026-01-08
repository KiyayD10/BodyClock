import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
// type TextColor = 'primary' | 'secondary' | 'tertiary' | 'neon-cyan' | 'neon-purple';

interface TextProps extends RNTextProps {
    children: React.ReactNode;
    variant?: TextVariant;
    color?: string;
    weight?: keyof typeof FONT_WEIGHT;
    center?: boolean;
    style?: TextStyle;
}

export function Text({ children, variant = 'body', color = 'primary', weight = 'regular', center = false, style, ...props }: TextProps) {
    const { colors } = useTheme();

    // Definisi gaya tipografi (ukuran font dan line height) untuk menjaga konsistensi visual
    const variantStyles: Record<TextVariant, TextStyle> = {
        h1: { fontSize: FONT_SIZE['5xl'], lineHeight: FONT_SIZE['5xl'] * 1.2 },
        h2: { fontSize: FONT_SIZE['4xl'], lineHeight: FONT_SIZE['4xl'] * 1.2 },
        h3: { fontSize: FONT_SIZE['2xl'], lineHeight: FONT_SIZE['2xl'] * 1.3 },
        body: { fontSize: FONT_SIZE.base, lineHeight: FONT_SIZE.base * 1.5 },
        caption: { fontSize: FONT_SIZE.sm, lineHeight: FONT_SIZE.sm * 1.4 },
        label: {
            fontSize: FONT_SIZE.xs,
            lineHeight: FONT_SIZE.xs * 1.4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
    };

    // Menentukan warna teks: mendukung warna tema standar (primary/secondary) dan warna neon khusus
    const getTextColor = () => {
        if (color === 'neon-cyan') return colors.neon.cyan;
        if (color === 'neon-purple') return colors.neon.purple;
        return colors.text[color as 'primary' | 'secondary' | 'tertiary'];
    };

    return (
        <RNText
            style={[
                variantStyles[variant],
            {
                color: getTextColor(),
                fontWeight: FONT_WEIGHT[weight],
                textAlign: center ? 'center' : 'left',
            },
            style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
}