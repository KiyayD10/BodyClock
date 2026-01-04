import db, { getCurrentDate } from '../db';
import { DailyState, UpdateDailyStateDTO } from '@/types/database';

export class DailyStateRepository {
    // Ambil semua status harian untuk hari ini
    static async getTodayStates(): Promise<DailyState[]> {
        try {
            const today = getCurrentDate();
            const result = await db.getAllAsync<DailyState>(
                'SELECT * FROM daily_state WHERE date = ? ORDER BY id ASC',
                [today]
            );
            return result;
        } catch (error) {
            console.error('Kesalahan saat mengambil status harian:', error);
            throw error;
        }
    }

    // Ambil status harian berdasarkan schedule_id dan tanggal
    static async getByScheduleAndDate(scheduleId: number, date: string): Promise<DailyState | null> {
        try {
            const result = await db.getFirstAsync<DailyState>(
                'SELECT * FROM daily_state WHERE schedule_id = ? AND date = ?',
                [scheduleId, date]
            );
            return result || null;
        } catch (error) {
            console.error('Kesalahan saat mengambil status harian spesifik:', error);
            throw error;
        }
    }

    // Buat baru atau ambil status harian yang sudah ada untuk hari ini
    static async createOrGetToday(scheduleId: number): Promise<DailyState> {
        try {
            const today = getCurrentDate();
            const existing = await this.getByScheduleAndDate(scheduleId, today);

        if (existing) {
            return existing;
        }

        // Buat status harian baru jika belum ada
        const result = await db.runAsync(
            'INSERT INTO daily_state (schedule_id, date) VALUES (?, ?)',
            [scheduleId, today]
        );

        const newState = await db.getFirstAsync<DailyState>(
            'SELECT * FROM daily_state WHERE id = ?',
            [result.lastInsertRowId]
        );

        return newState!;
        } catch (error) {
            console.error('Kesalahan saat membuat status harian:', error);
            throw error;
        }
    }

    // Update status harian (manual update fields)
    static async update(id: number, data: UpdateDailyStateDTO): Promise<void> {
        try {
            await db.runAsync(
                'UPDATE daily_state SET completed = ?, completed_at = ?, notes = ? WHERE id = ?',
                [data.completed, data.completed_at || null, data.notes || null, id]
            );
        } catch (error) {
            console.error('Kesalahan saat memperbarui status harian:', error);
            throw error;
        }
    }

    // Tandai sebagai selesai (Completed)
    static async markCompleted(id: number, notes?: string): Promise<void> {
        try {
        const now = new Date().toISOString();
            await this.update(id, {
                completed: 1,
                completed_at: now,
                notes,
            });
        } catch (error) {
            console.error('Kesalahan saat menandai selesai:', error);
            throw error;
        }
    }

    // Tandai sebagai belum selesai (Uncompleted/Reset)
    static async markUncompleted(id: number): Promise<void> {
        try {
            await this.update(id, {
                completed: 0,
                completed_at: undefined,
                notes: undefined,
            });
        } catch (error) {
            console.error('Kesalahan saat membatalkan status selesai:', error);
            throw error;
        }
    }

    // Ambil statistik penyelesaian hari ini
    static async getTodayStats(): Promise<{ total: number; completed: number }> {
        try {
            const today = getCurrentDate();
            const result = await db.getFirstAsync<{ total: number; completed: number }>(
                `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
                FROM daily_state 
                WHERE date = ?`,
                [today]
            );
            return result || { total: 0, completed: 0 };
        } catch (error) {
            console.error('Kesalahan saat mengambil statistik hari ini:', error);
            throw error;
        }
    }

    // Hapus data lama (simpan 7 hari terakhir saja)
    static async cleanupOldRecords(): Promise<void> {
        try {
            await db.runAsync('DELETE FROM daily_state WHERE date < date("now", "-7 days")');
            console.log('Data harian lama berhasil dibersihkan');
        } catch (error) {
            console.error('Kesalahan saat membersihkan data lama:', error);
            throw error;
        }
    }
}