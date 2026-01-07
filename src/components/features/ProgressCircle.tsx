import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

interface ProgressCircleProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

export function ProgressCircle({ percentage, size = 120, strokeWidth = 8 }: ProgressCircleProps) {
    const { colors } = useTheme();

    // Hitung radius dan keliling lingkaran
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Hitung seberapa panjang garis yang harus digambar sesuai persentase
    const progress = circumference - (percentage / 100) * circumference;

    return (
        <View style={[styles.container, { width: size, height: size }]}>

            {/* Pakai komponen Svg dari library */}
            <Svg width={size} height={size} style={styles.svg}>


                {/* Lingkaran Background (Abu-abu redup) */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors.border}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
        
                {/* Lingkaran Progress (Warna Neon) */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors.neon.cyan}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    strokeLinecap="round"

                    // Rotasi -90 derajat agar mulai dari jam 12
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            {/* Teks Persentase di Tengah */}
            <View style={styles.textContainer}>
                <Text variant="h2" weight="bold" style={{ color: colors.neon.cyan }}>
                    {percentage}%
                </Text>
                <Text variant="caption" color="secondary">
                    Complete
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        position: 'absolute',
    },
    textContainer: {
        alignItems: 'center',
        gap: 4,
    },
});