import db, { getCurrentDate } from '../db';
import { Settings } from '@/types/database';

export class SettingsRepository {
    // Ambil nilai konfigurasi berdasarkan key tertentu
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
            const now = getCurrentDate();
      
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
            const result = await db.getAllAsync<Settings>('SELECT key, value FROM settings');
        
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
}