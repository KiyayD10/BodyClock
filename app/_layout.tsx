import { Stack, router } from 'expo-router'; 
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useDatabase } from '@/hooks/useDatabase'; 
import { useMorningNotes } from '@/hooks/useMorningNotes';
import { Text } from '@/components/ui/Text';
import { setupNotificationHandlers } from '@/services/NotificationService';

export default function RootLayout() {
  const { isDark, colors } = useTheme();
  const { isReady, error } = useDatabase(); 
  const { isCompleted, isLoading } = useMorningNotes();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isReady && !isLoading && !hasChecked) {
      setHasChecked(true);

      // Aktifkan listener notifikasi
      setupNotificationHandlers();

      if (!isCompleted) {
        setTimeout(() => {
          // @ts-ignore: Ignore sementara sampai npx expo start dijalankan
          router.replace('/morning-notes');
        }, 500);
      }
    }
  }, [isReady, isLoading, isCompleted, hasChecked]);

  if (!isReady || isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.neon.cyan} />
        <Text variant="body" color="secondary" style={styles.loadingText}>
          Memuat data...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <Text variant="h3" color="neon-purple" weight="bold">
          Error Database
        </Text>
        <Text variant="body" color="secondary" style={styles.errorText}>
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="morning-notes"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_bottom',
          }}
        />
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