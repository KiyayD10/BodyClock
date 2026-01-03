import { create } from 'zustand';

//list pilih tema gelap/terang
type ThemeMode = 'light' | 'dark';

// daftar isi Store: Variable & Function yang tersedia
interface ThemeStore {
    mode: ThemeMode;                        // data status dari tema sekarang
    toggleTheme: () => void;                // function untuk switch Dark - Light mode
    setTheme: (mode: ThemeMode) => void;    // function buat set manual
}

export const useThemeStore = create<ThemeStore>((set) => ({
    mode: 'dark',   // default awal aplikasi gelap

    // logika switch mode
    toggleTheme: () =>
        set((state) => ({
            mode: state.mode === 'dark' ? 'light' : 'dark',
        })),
    
    // Logika ganti tema
    setTheme: (mode) => set({ mode }),
})) 
