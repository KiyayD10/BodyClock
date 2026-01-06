// standar jarak agar tata letak konsisten
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,   
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// border radius
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999, 
} as const;

// ukuran teks 
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  base: 16, 
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48, 
} as const;

// 4. Ketebalan huruf
export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};