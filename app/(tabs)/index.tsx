import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SPACING } from '@/constants/theme';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="h1" weight="bold">
              BodyClock
            </Text>
            <Text variant="caption" color="secondary">
              Lacak ritme tubuh Anda
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Neon Card */}
        <Card variant="neon" onPress={() => console.log('Neon pressed')} style={styles.section}>
          <Text variant="h3" weight="semibold" color="neon-cyan">
            Cyberpunk Mode Active
          </Text>
          <Text variant="body" color="secondary" style={styles.cardText}>
            Data Anda disinkronkan dan diamankan secara offline
          </Text>
        </Card>

        {/* Summary Card */}
        <Card style={styles.section}>
          <Text variant="h3" weight="semibold">
            Ringkasan Hari Ini
          </Text>
          <View style={styles.summaryList}>
            <View style={styles.summaryRow}>
              <Text color="secondary">Sleep Quality</Text>
              <Text weight="semibold" color="neon-purple">
                85%
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text color="secondary">Energy Level</Text>
              <Text weight="semibold" color="neon-cyan">
                Tinggi
              </Text>
            </View>
          </View>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <Button variant="primary" onPress={() => console.log('Primary')} fullWidth>
            Primary Button
          </Button>
          <Button variant="neon" onPress={() => console.log('Neon')} fullWidth>
            Neon Button
          </Button>
          <Button variant="secondary" onPress={() => console.log('Secondary')} fullWidth>
            Secondary Button
          </Button>
          <Button variant="ghost" onPress={() => console.log('Ghost')} fullWidth>
            Ghost Button
          </Button>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text variant="label" color="tertiary">
              Jam
            </Text>
            <Text variant="h2" weight="bold" color="neon-cyan">
              7.5
            </Text>
            <Text variant="caption" color="secondary">
              Waktu Tidur
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text variant="label" color="tertiary">
              STEPS
            </Text>
            <Text variant="h2" weight="bold" color="neon-purple">
              8.2k
            </Text>
            <Text variant="caption" color="secondary">
              Daily goal
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.md,
  },
  cardText: {
    marginTop: SPACING.sm,
  },
  summaryList: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    gap: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
  },
});