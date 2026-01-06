import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@/constants/theme'; 
import { MorningNote, MOOD_EMOJI } from '@/types/morningNotes';

interface MoodSelectorProps {
    selected?: MorningNote['mood'];
    onSelect: (mood: MorningNote['mood']) => void;
}

const MOODS: { value: MorningNote['mood']; label: string } [] = [
    { value: 'great', label: 'Luar Biasa' },
    { value: 'good', label: 'Baik' },
    { value: 'okay', label: 'Oke' },
    { value: 'bad', label: 'Buruk' },
    { value: 'terrible', label: 'Kacau' },
];

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {MOODS.map((mood) => {
                const isSelected = selected === mood.value;
                return (
                    <Pressable
                        key={mood.value}
                        onPress={() => onSelect(mood.value)}
                        style={[
                            styles.moodButton,
                            {
                                backgroundColor: isSelected ? colors.neon.cyan : colors.card,
                                borderColor: isSelected ? colors.neon.cyan : colors.border,
                            },
                        ]}
                    >
                        <Text variant="h2" style={{ marginBottom: 4 }}>
                            {MOOD_EMOJI[mood.value]}
                        </Text>
                        <Text
                            variant="caption"
                            weight="medium"
                            style={{ 
                                color: isSelected ? colors.bg : colors.text.secondary,
                                fontSize: 10 
                            }}
                            center
                        >
                            {mood.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs, 
        justifyContent: 'space-between',
    },
    moodButton: {
        width: '18%', 
        aspectRatio: 1,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
});