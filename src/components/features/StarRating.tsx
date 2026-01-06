import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { SPACING } from '@/constants/theme';

interface StarRatingProps {
    value: number;
    max?: number;
    onChange: (value: number) => void;
    label: string;
}

export function StarRating({ value, max = 5, onChange, label }: StarRatingProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text variant="body" weight="medium" color="secondary">
                {label}
            </Text>
            <View style={styles.stars}>
                {Array.from({ length: max }).map((_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= value;
                    return (
                        <Pressable 
                            key={index} 
                            onPress={() => onChange(starValue)} 
                            style={({ pressed }) => [
                                styles.star,
                                { opacity: pressed ? 0.7 : 1 } 
                            ]}
                        >
                            <Text 
                                variant="h2" 
                                style={{ 
                                    // Kalau bintang kosong, warnanya abu-abu, kalau bintang isi (emoji)
                                    color: isFilled ? undefined : colors.text.tertiary,
                                    opacity: isFilled ? 1 : 0.5 
                                }}
                            >
                                {isFilled ? '⭐' : '★'} 
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SPACING.sm,
    },
    stars: {
        flexDirection: 'row',
        gap: SPACING.xs,
    },
    star: {
        padding: SPACING.xs,
    },
});