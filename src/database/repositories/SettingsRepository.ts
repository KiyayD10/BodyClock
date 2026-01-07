import db from '../db';

// Interface lokal untuk tipe data setting
interface Setting {
    key: string;
    value: string;
}

export class SettingsRepository {
    // Ambil nilai konfigurasi berdasarkan key
    static async get(key: string): Promise<string | null> {
        try {
            const result = await db.getFirstAsync<{ value: string }>(
                'SELECT value FROM settings WHERE key = ?',
                [key]
            );
            return result?.value || null;
        } catch (error) {
            console.error('Kesalahan saat mengambil pengaturan:', error);
            throw error;
        }
    }

    // Simpan atau perbarui konfigurasi
    static async set(key: string, value: string): Promise<void> {
        try {

        // Gunakan waktu sekarang
            const now = new Date().toISOString(); 
            await db.runAsync(
                'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)',
                [key, value, now]
            );
        } catch (error) {
            console.error('Kesalahan saat menyimpan pengaturan:', error);
            throw error;
        }
    }

    // Ambil semua konfigurasi dan format menjadi object (Key-Value)
    static async getAll(): Promise<Record<string, string>> {
        try {
            const result = await db.getAllAsync<Setting>('SELECT key, value FROM settings');

            // Transformasi array dari DB menjadi object agar mudah diakses
            return result.reduce(
                (acc, setting) => {
                    acc[setting.key] = setting.value;
                    return acc;
                },
                {} as Record<string, string>
            );
        } catch (error) {
            console.error('Kesalahan saat mengambil semua pengaturan:', error);
            throw error;
        }
    }

    // Hapus konfigurasi tertentu
    static async delete(key: string): Promise<void> {
        try {
            await db.runAsync('DELETE FROM settings WHERE key = ?', [key]);
        } catch (error) {
            console.error('Kesalahan saat menghapus pengaturan:', error);
            throw error;
        }
    }

    // Reset semua data aplikasi (HATI-HATI: Menghapus data user!)
    static async resetAllData(): Promise<void> {
        try {
            console.log('Memulai reset data...');

            // 1. Hapus data harian (transaksi)
            await db.runAsync('DELETE FROM daily_meals');
            await db.runAsync('DELETE FROM daily_state');
            await db.runAsync('DELETE FROM morning_notes');

            // 2. Hapus data master (kecuali default)
            await db.runAsync('DELETE FROM meals WHERE is_default = 0');
            await db.runAsync('DELETE FROM schedule_templates');

            // 3. Reset penanda sistem di settings
            const today = new Date().toISOString().split('T')[0];
            await this.set('morning_notes_completed_today', '0');
            await this.set('last_reset_date', today);

            console.log('Semua data berhasil di-reset');
        } catch (error) {
            console.error('Gagal melakukan reset data:', error);
            throw error;
        }
    }
}