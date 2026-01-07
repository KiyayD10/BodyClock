import { create } from 'zustand';
import { SettingsRepository } from '@/database/repositories/SettingsRepository';

//list pilih tema gelap/terang
type ThemeMode = 'light' | 'dark';

// daftar isi Store: Variable & Function yang tersedia
interface ThemeStore {
    mode: ThemeMode;                        // data status dari tema sekarang
    isLoaded: boolean;                      // tambah flag biar tau loading selesai atau belum
    toggleTheme: () => void;                // function untuk switch Dark - Light mode
    setTheme: (mode: ThemeMode) => void;    // function buat set manual
    loadTheme: () => Promise<void>;         // tambah fungsi buat load data awal dari DB
}

// Tambah parameter 'get' untuk akses state saat ini di dalam action
export const useThemeStore = create<ThemeStore>((set, get) => ({
    mode: 'dark',       // default awal dark 
    isLoaded: false,    // default false (sedang loading)

    // Ubah jadi async function
    toggleTheme: async () => {
    // Pakai get() buat ambil value mode sekarang
        const newMode = get().mode === 'dark' ? 'light' : 'dark';
    
        // Update State UI (biar responsif)
        set({ mode: newMode });

        // Simpan perubahan ke Database
        try {
            await SettingsRepository.set('theme', newMode);
            console.log(`Tema disimpan: ${newMode}`);
        } catch (error) {
            console.error('Gagal menyimpan tema:', error);
        }
    },

    // Ubah jadi async function
    setTheme: async (mode) => {
        set({ mode });

        // Simpan perubahan ke Database
        try {
            await SettingsRepository.set('theme', mode);
            console.log(`Tema disimpan: ${mode}`);
        } catch (error) {
        console.error('Gagal menyimpan tema:', error);
        }
    },

    // Fungsi BARU untuk dipanggil saat aplikasi pertama kali jalan
    loadTheme: async () => {
        try {
            const savedTheme = await SettingsRepository.get('theme');
      
            // Cek apakah data dari DB valid ('light' atau 'dark')
            if (savedTheme === 'light' || savedTheme === 'dark') {
                set({ mode: savedTheme, isLoaded: true });
                console.log(`Tema dimuat: ${savedTheme}`);
            } else {
                set({ isLoaded: true }); // Kalau kosong, pakai default 
            }
        } catch (error) {
            console.error('Gagal memuat tema:', error);
            set({ isLoaded: true });
        }
    },
})) 
