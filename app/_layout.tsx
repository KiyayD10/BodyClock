import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useDatabase } from '@/hooks/useDatabase';
import { Text } from '@/components/ui/Text';

export default function RootLayout() {
  const { isDark, colors } = useTheme();
  // Panggil hook database untuk cek status inisialisasi
  const { isReady, error } = useDatabase();

  // 1. State Loading: Tampilkan layar loading saat database sedang disiapkan
  if (!isReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.neon.cyan} />
        <Text variant="body" color="secondary" style={styles.loadingText}>
          Menyiapkan database...
        </Text>
      </View>
    );
  }

  // 2. State Error: Tampilkan pesan error jika inisialisasi gagal total
  if (error) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <Text variant="h3" color="neon-purple" weight="bold">
          Gagal Memuat Database
        </Text>
        <Text variant="body" color="secondary" style={styles.errorText}>
          {error.message}
        </Text>
      </View>
    );
  }

  // 3. State Ready: Render navigasi utama jika database aman
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
});