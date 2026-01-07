import { useThemeStore } from '@/store/themeStore';
import { COLORS } from '@/constants/colors';
import { useEffect } from 'react';

// hook utama biar UI gampang dapet warna sesuai tema (Dark/Light)
export const useTheme = () => {
  // Ambil state dan fungsi dari store
  const { mode, isLoaded, loadTheme } = useThemeStore();
  const isDark = mode === 'dark'; 

  // Load tema dari database saat hook pertama kali dipanggil
  useEffect(() => {
    if (!isLoaded) {
      loadTheme();
    }
  }, [isLoaded, loadTheme]);

  return {
    mode,
    isDark,

    // Return warna sesuai mode aktif
    colors: {
      bg: isDark ? COLORS.dark.bg : COLORS.light.bg,
      card: isDark ? COLORS.dark.card : COLORS.light.card,
      border: isDark ? COLORS.dark.border : COLORS.light.border,
      text: isDark ? COLORS.dark.text : COLORS.light.text,
      neon: COLORS.neon,     
      status: COLORS.status,
    },
  };
};