import db, { getCurrentDate } from '@/database/db';
import { MorningNote, CreateMorningNoteDTO } from '@/types/morningNotes';
import { SettingsRepository } from './SettingsRepository';

export class MorningNotesRepository {
    // Cek apakah jurnal pagi ini sudah diisi
    static async isTodayCompleted(): Promise<boolean> {
        try {
            const today = getCurrentDate();
            const result = await db.getFirstAsync<{ count: number }>(
                'SELECT COUNT(*) as count FROM morning_notes WHERE date = ?',
                [today]
            );
            return (result?.count || 0) > 0;
        } catch (error) {
            console.error('Gagal cek status jurnal pagi:', error);
            return false;
        }
    }

    // Ambil data jurnal untuk hari ini
    static async getToday(): Promise<MorningNote | null> {
        try {
            const today = getCurrentDate();
            const result = await db.getFirstAsync<MorningNote>(
                'SELECT * FROM morning_notes WHERE date = ?',
                [today]
            );
            return result || null;
        } catch (error) {
            console.error('Gagal mengambil jurnal hari ini:', error);
            return null;
        }
    }

    // Buat jurnal baru untuk hari ini
    static async create(data: CreateMorningNoteDTO): Promise<number> {
        try {
            const today = getCurrentDate();

            // Cek dulu, kalau sudah ada update aja datanya
            const existing = await this.getToday();
            if (existing) {
                await this.update(existing.id, data);
                return existing.id;
            }

            const result = await db.runAsync(
                `INSERT INTO morning_notes (date, mood, sleep_quality, energy_level, notes) 
                VALUES (?, ?, ?, ?, ?)`,
                [today, data.mood, data.sleep_quality, data.energy_level, data.notes || null]
            );

            // Tandai di settings bahwa tugas pagi ini selesai
            await SettingsRepository.set('morning_notes_completed_today', '1');

            console.log('Morning notes berhasil disimpan');
            return result.lastInsertRowId;
        } catch (error) {
            console.error('Gagal membuat morning notes:', error);
            throw error;
        }
    }

    // Update data jurnal yang sudah ada
    static async update(id: number, data: Partial<CreateMorningNoteDTO>): Promise<void> {
        try {
            const fields: string[] = [];
            const values: any[] = [];

            if (data.mood !== undefined) {
                fields.push('mood = ?');
                values.push(data.mood);
            }
            if (data.sleep_quality !== undefined) {
                fields.push('sleep_quality = ?');
                values.push(data.sleep_quality);
            }
            if (data.energy_level !== undefined) {
                fields.push('energy_level = ?');
                values.push(data.energy_level);
            }
            if (data.notes !== undefined) {
                fields.push('notes = ?');
                values.push(data.notes);
            }

            fields.push('completed_at = CURRENT_TIMESTAMP');
            values.push(id);

            await db.runAsync(`UPDATE morning_notes SET ${fields.join(', ')} WHERE id = ?`, values);
        } catch (error) {
            console.error('Gagal update morning notes:', error);
            throw error;
        }
    }

    // Ambil history 7 hari terakhir (untuk grafik/stats)
    static async getLastWeek(): Promise<MorningNote[]> {
        try {
            const result = await db.getAllAsync<MorningNote>(
                `SELECT * FROM morning_notes 
                WHERE date >= date('now', '-7 days') 
                ORDER BY date DESC`
            );
            return result;
        } catch (error) {
            console.error('Gagal mengambil history mingguan:', error);
            return [];
        }
    }

    // Hapus data lama (simpan 30 hari terakhir saja biar DB enteng)
    static async cleanup(): Promise<void> {
        try {
            await db.runAsync('DELETE FROM morning_notes WHERE date < date("now", "-30 days")');
            console.log('Data jurnal lama dibersihkan');
        } catch (error) {
            console.error('Gagal membersihkan data lama:', error);
        }
    }

    // Hitung rata-rata statistik mingguan
    static async getWeeklyStats(): Promise<{
        avgSleepQuality: number;
        avgEnergyLevel: number;
        totalEntries: number;
    }> {
        try {
            const result = await db.getFirstAsync<{
                avgSleep: number;
                avgEnergy: number;
                total: number;
            }>(
                `SELECT 
                AVG(sleep_quality) as avgSleep,
                AVG(energy_level) as avgEnergy,
                COUNT(*) as total
                FROM morning_notes 
                WHERE date >= date('now', '-7 days')`
            );

            return {
                avgSleepQuality: Math.round((result?.avgSleep || 0) * 10) / 10,
                avgEnergyLevel: Math.round((result?.avgEnergy || 0) * 10) / 10,
                totalEntries: result?.total || 0,
            };
        } catch (error) {
            console.error('Gagal menghitung statistik mingguan:', error);
            return { avgSleepQuality: 0, avgEnergyLevel: 0, totalEntries: 0 };
        }
    }
}