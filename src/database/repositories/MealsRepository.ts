import db from '../db';
import { Meal, DailyMeal, MealWithStatus, MealType } from '@/types/meals';

// Helper lokal agar tidak merubah file db.ts
const getTodayDate = () => new Date().toISOString().split('T')[0];

export class MealsRepository {
    // Ambil semua template makan
    static async getAll(): Promise<Meal[]> {
        try {
            const result = await db.getAllAsync<Meal>(
                'SELECT * FROM meals ORDER BY time ASC'
            );
            return result;
        } catch (error) {
            console.error('Error getting meals:', error);
            return [];
        }
    }

    // Ambil template makanan berdasarkan id
    static async getById(id: number): Promise<Meal | null> {
        try {
            const result = await db.getFirstAsync<Meal>(
                'SELECT * FROM meals WHERE id = ?',
                [id]
            );
            return result || null;
        } catch (error) {
            console.error('Error getting meal:', error);
            return null;
        }
    }

    // Buat template makanan baru
    static async create(data: {
        name: string;
        type: MealType;
        time: string;
        calories?: number;
        icon?: string;
    }): Promise<number> {
        try {
            const result = await db.runAsync(
                'INSERT INTO meals (name, type, time, calories, icon) VALUES (?, ?, ?, ?, ?)',
                [data.name, data.type, data.time, data.calories || null, data.icon || null]
            );
            return result.lastInsertRowId;
        } catch (error) {
            console.error('Error creating meal:', error);
            throw error;
        }
    }

    // Hapus template makan
    static async delete(id: number): Promise<void> {
        try {
            await db.runAsync('DELETE FROM meals WHERE id = ?', [id]);
        } catch (error) {
            console.error('Error deleting meal:', error);
            throw error;
        }
    }
}

export class DailyMealsRepository {
    // Ambil jadwal makan hari ini dan statusnya
    static async getTodayMeals(): Promise<MealWithStatus[]> {
        try {
            const today = getTodayDate();
            const result = await db.getAllAsync<MealWithStatus>(
                `SELECT 
                m.*,
                dm.id as daily_meal_id,
                COALESCE(dm.completed, 0) as completed,
                dm.completed_at
                FROM meals m
                LEFT JOIN daily_meals dm ON m.id = dm.meal_id AND dm.date = ?
                ORDER BY m.time ASC`,
                [today]
            );
            return result;
        } catch (error) {
            console.error('Error getting today meals:', error);
            return [];
        }
    }

    // Buat atau ambil data harian
    static async createOrGet(mealId: number): Promise<DailyMeal> {
        try {
            const today = getTodayDate();

        // Cek apakah sudah ada
        const existing = await db.getFirstAsync<DailyMeal>(
            'SELECT * FROM daily_meals WHERE meal_id = ? AND date = ?',
            [mealId, today]
        );

        if (existing) {
            return existing;
        }

        // Buat baru kalau gak ada
        const result = await db.runAsync(
            'INSERT INTO daily_meals (meal_id, date) VALUES (?, ?)',
            [mealId, today]
        );

        const newMeal = await db.getFirstAsync<DailyMeal>(
            'SELECT * FROM daily_meals WHERE id = ?',
            [result.lastInsertRowId]
        );

        return newMeal!;
        } catch (error) {
            console.error('Error creating daily meal:', error);
            throw error;
        }
    }

    // Toggle status selesai makan / belum
    static async toggleCompletion(mealId: number): Promise<void> {
        try {
            // Ambil / buat makanan harian
            const dailyMeal = await this.createOrGet(mealId);

            // Toggle
            const newCompleted = dailyMeal.completed === 1 ? 0 : 1;
            const completedAt = newCompleted === 1 ? new Date().toISOString() : null;

            await db.runAsync(
                'UPDATE daily_meals SET completed = ?, completed_at = ? WHERE id = ?',
                [newCompleted, completedAt, dailyMeal.id]
            );

            console.log(`✅ Meal ${newCompleted === 1 ? 'completed' : 'uncompleted'}`);
        } catch (error) {
            console.error('Error toggling meal:', error);
            throw error;
        }
    }

    // Ambil status selesai hari ini
    static async getTodayStats(): Promise<{ total: number; completed: number; percentage: number }> {
        try {
            const today = getTodayDate();
            const result = await db.getFirstAsync<{ total: number; completed: number }>(
                `SELECT 
                COUNT(m.id) as total,
                COUNT(CASE WHEN dm.completed = 1 THEN 1 END) as completed
                FROM meals m
                LEFT JOIN daily_meals dm ON m.id = dm.meal_id AND dm.date = ?`,
                [today]
            );

            const total = result?.total || 0;
            const completed = result?.completed || 0;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return { total, completed, percentage };
        } catch (error) {
            console.error('Error getting today stats:', error);
            return { total: 0, completed: 0, percentage: 0 };
        }
    }

    // Bersihkan data lama
    static async cleanup(): Promise<void> {
        try {
            await db.runAsync('DELETE FROM daily_meals WHERE date < date("now", "-30 days")');
            console.log('✅ Old daily meals cleaned up');
        } catch (error) {
            console.error('Error cleaning up daily meals:', error);
        }
    }
}