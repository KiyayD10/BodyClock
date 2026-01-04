import db, { getCurrentDate } from '../db';
import { ScheduleTemplate, CreateScheduleTemplateDTO } from '@/types/database';

export class ScheduleRepository {
    // Ambil semua jadwal yang aktif
    static async getAllActive(): Promise<ScheduleTemplate[]> {
        try {
            const result = await db.getAllAsync<ScheduleTemplate>(
                'SELECT * FROM schedule_templates WHERE is_active = 1 ORDER BY time ASC'
            );
            return result;
        } catch (error) {
            console.error('Kesalahan saat mendapatkan jadwal aktif:', error);
            throw error;
        }
    }

    // Get schedule by ID
    static async getById(id: number): Promise<ScheduleTemplate | null> {
        try {
            const result = await db.getFirstAsync<ScheduleTemplate>(
                'SELECT * FROM schedule_templates WHERE id = ?',
                [id]
            );
            return result || null;
        } catch (error) {
            console.error('Kesalahan saat mendapatkan jadwal berdasarkan id:', error);
            throw error;
        }
    }

    // Buat jadwal baru
    static async create(data: CreateScheduleTemplateDTO): Promise<number> {
        try {
            // SOLUSI: Gunakan getCurrentDate() untuk created_at & updated_at
            const now = getCurrentDate();

            const result = await db.runAsync(
                `INSERT INTO schedule_templates (
                    name, time, description, icon, color, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.name, 
                    data.time, 
                    data.description || null, 
                    data.icon || null, 
                    data.color || null,
                    now, // created_at
                    now  // updated_at
                ]
            );
            return result.lastInsertRowId;
        } catch (error) {
            console.error('Kesalahan saat membuat jadwal baru:', error);
            throw error;
        }
    }

    // Update jadwal
    static async update(id: number, data: Partial<CreateScheduleTemplateDTO>): Promise<void> {
        try {
            const fields: string[] = [];
            const values: any[] = [];

            if (data.name !== undefined) {
                fields.push('name = ?');
                values.push(data.name);
            }
            if (data.time !== undefined) {
                fields.push('time = ?');
                values.push(data.time);
            }
            if (data.description !== undefined) {
                fields.push('description = ?');
                values.push(data.description);
            }
            if (data.icon !== undefined) {
                fields.push('icon = ?');
                values.push(data.icon);
            }
            if (data.color !== undefined) {
                fields.push('color = ?');
                values.push(data.color);
            }

            // SOLUSI: Gunakan getCurrentDate() disini juga
            fields.push('updated_at = ?');
            values.push(getCurrentDate());

            // Masukkan ID di urutan terakhir untuk WHERE clause
            values.push(id);

            await db.runAsync(
                `UPDATE schedule_templates SET ${fields.join(', ')} WHERE id = ?`,
                values
            );
        } catch (error) {
            console.error('Kesalahan saat memperbarui jadwal:', error);
            throw error;
        }
    }

    // Hapus sementara (Soft delete)
    static async softDelete(id: number): Promise<void> {
        try {
            // Opsional: Update updated_at saat di-delete
            await db.runAsync(
                'UPDATE schedule_templates SET is_active = 0, updated_at = ? WHERE id = ?', 
                [getCurrentDate(), id]
            );
        } catch (error) {
            console.error('Kesalahan saat menghapus jadwal sementara:', error);
            throw error;
        }
    }

    // Hapus permanen
    static async delete(id: number): Promise<void> {
        try {
            await db.runAsync('DELETE FROM schedule_templates WHERE id = ?', [id]);
        } catch (error) {
            console.error('Kesalahan saat menghapus jadwal permanen:', error);
            throw error;
        }
    }
}