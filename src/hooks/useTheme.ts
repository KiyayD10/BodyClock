import { useThemeStore } from '@/store/themeStore';
import { COLORS } from '@/constants/colors';

// hook utama biar UI gampang dapet warna sesuai tema (Dark/Light)
export const useTheme = () => {
  // Ambil data mode dari Store pusat
  const mode = useThemeStore((state) => state.mode);
  const isDark = mode === 'dark'; 

  return {
    mode,
    isDark,
    
    // mapping warna otomatis
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