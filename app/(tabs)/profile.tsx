import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { SPACING } from '@/constants/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text variant="h1" weight="bold" center>
        Profile
      </Text>
      <Text variant="body" color="secondary" center style={styles.subtitle}>
        Your health data
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  subtitle: {
    marginTop: SPACING.sm,
  },
});