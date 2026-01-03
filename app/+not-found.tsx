import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { SPACING } from '@/constants/theme';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text variant="h1" weight="bold" center>
        404
      </Text>
      <Text variant="body" color="secondary" center style={styles.subtitle}>
        Page not found
      </Text>
      <Link href="/" style={[styles.link, { color: colors.neon.cyan }]}>
        <Text color="neon-cyan">Go back home</Text>
      </Link>
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
  link: {
    marginTop: SPACING.lg,
  },
});