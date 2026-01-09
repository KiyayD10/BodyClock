import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons'; 
import { Platform } from 'react-native';
// FIX: Tambahkan import ini untuk menghitung area aman
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors } = useTheme();
  // Ambil data inset (jarak aman) dari sistem
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          // FIX: Atur tinggi secara dinamis agar tidak tertutup tombol navigasi HP
          height: Platform.OS === 'android' ? 65 + insets.bottom : 85, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          elevation: 8, // Tambahkan shadow dikit biar kelihatan terpisah di Android
        },
        tabBarActiveTintColor: colors.neon.cyan,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 10,
          marginBottom: Platform.OS === 'android' ? 4 : 0, // Rapikan posisi teks di Android
        },
      }}
    >
      {/* Tab Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab Alarm */}
      <Tabs.Screen
        name="alarm"
        options={{
          title: 'Alarms',
          tabBarLabel: 'Alarms',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'alarm' : 'alarm-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab Today */}
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab Recipes */}
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarLabel: 'Resep',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}