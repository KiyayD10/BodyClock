import db from '../db';
import { Recipe, CreateRecipeDTO, UpdateRecipeDTO, RecipeFilters } from '@/types/recipes';

export class RecipesRepository {
    // Helper: Parsing field JSON dari database ke object
    private static parseRecipe(raw: any): Recipe {
        return {
            ...raw,
            tags: raw.tags ? JSON.parse(raw.tags) : [],
            ingredients: JSON.parse(raw.ingredients),
            steps: JSON.parse(raw.steps),
            is_archived: raw.is_archived, 
        };
    }

    // Ambil semua resep dengan filter
    static async getAll(filters?: RecipeFilters): Promise<Recipe[]> {
        try {
            let query = 'SELECT * FROM recipes WHERE 1=1';
            const params: any[] = [];

            // Filter arsip 
            if (!filters?.showArchived) {
            query += ' AND is_archived = 0';
        }

        // Filter kategori
        if (filters?.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }

        // Filter tags
        if (filters?.tags && filters.tags.length > 0) {
            const tagConditions = filters.tags.map(() => 'tags LIKE ?').join(' OR ');
            query += ` AND (${tagConditions})`;
            filters.tags.forEach((tag) => {
                params.push(`%"${tag}"%`);
            });
        }

        // Pencarian judul atau bahan
        if (filters?.search) {
            query += ' AND (title LIKE ? OR ingredients LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC';

        const results = await db.getAllAsync<any>(query, params);
        return results.map(this.parseRecipe);
        } catch (error) {
            console.error('Gagal mengambil resep:', error);
            return [];
        }
    }

    // Ambil resep berdasarkan ID
    static async getById(id: number): Promise<Recipe | null> {
        try {
            const result = await db.getFirstAsync<any>('SELECT * FROM recipes WHERE id = ?', [id]);
            return result ? this.parseRecipe(result) : null;
        } catch (error) {
            console.error('Gagal mengambil detail resep:', error);
            return null;
        }
    }

    // Buat resep baru
    static async create(data: CreateRecipeDTO): Promise<number> {
        try {
            const result = await db.runAsync(
                `INSERT INTO recipes (title, category, tags, ingredients, steps, notes) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.title,
                    data.category,
                    JSON.stringify(data.tags),
                    JSON.stringify(data.ingredients),
                    JSON.stringify(data.steps),
                    data.notes || null,
                ]
            );
            console.log('Resep dibuat:', data.title);
            return result.lastInsertRowId;
        } catch (error) {
            console.error('Gagal membuat resep:', error);
            throw error;
        }
    }

    // Update resep
    static async update(id: number, data: UpdateRecipeDTO): Promise<void> {
        try {
            const fields: string[] = [];
            const values: any[] = [];

            if (data.title !== undefined) {
                fields.push('title = ?');
                values.push(data.title);
            }
            if (data.category !== undefined) {
                fields.push('category = ?');
                values.push(data.category);
            }
            if (data.tags !== undefined) {
                fields.push('tags = ?');
                values.push(JSON.stringify(data.tags));
            }
            if (data.ingredients !== undefined) {
                fields.push('ingredients = ?');
                values.push(JSON.stringify(data.ingredients));
            }
            if (data.steps !== undefined) {
                fields.push('steps = ?');
                values.push(JSON.stringify(data.steps));
            }
            if (data.notes !== undefined) {
                fields.push('notes = ?');
                values.push(data.notes);
            }
            if (data.is_archived !== undefined) {
                fields.push('is_archived = ?');
                values.push(data.is_archived);
            }

            // Update timestamp
            fields.push('updated_at = CURRENT_TIMESTAMP');
            values.push(id);

            await db.runAsync(`UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`, values);
            console.log('Resep diperbarui');
        } catch (error) {
            console.error('Gagal memperbarui resep:', error);
            throw error;
        }
    }

    // Arsipkan resep (Soft delete)
    static async archive(id: number): Promise<void> {
        try {
            await this.update(id, { is_archived: 1 });
            console.log('Resep diarsipkan');
        } catch (error) {
            console.error('Gagal mengarsipkan resep:', error);
            throw error;
        }
    }

    // Buka arsip resep
    static async unarchive(id: number): Promise<void> {
        try {
            await this.update(id, { is_archived: 0 });
            console.log('Resep dikembalikan dari arsip');
        } catch (error) {
            console.error('Gagal membuka arsip resep:', error);
            throw error;
        }
    }

    // Hapus permanen 
    static async deletePermanent(id: number): Promise<void> {
        try {
            await db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
            console.log('Resep dihapus permanen');
        } catch (error) {
            console.error('Gagal menghapus resep:', error);
            throw error;
        }
    }

    // Hitung jumlah resep per kategori
    static async getCountByCategory(): Promise<Record<string, number>> {
        try {
            const result = await db.getAllAsync<{ category: string; count: number }>(
                'SELECT category, COUNT(*) as count FROM recipes WHERE is_archived = 0 GROUP BY category'
            );
            return result.reduce(
                (acc, item) => {
                    acc[item.category] = item.count;
                    return acc;
                },
                {} as Record<string, number>
            );
        } catch (error) {
            console.error('Gagal menghitung kategori:', error);
            return {};
        }
    }

    // Pencarian resep (Dioptimalkan dengan bobot)
    static async search(query: string): Promise<Recipe[]> {
        try {
            const searchTerm = `%${query}%`;
            const results = await db.getAllAsync<any>(
                `SELECT * FROM recipes 
                WHERE is_archived = 0 
                AND (title LIKE ? OR ingredients LIKE ? OR tags LIKE ?)
                ORDER BY 
                CASE 
                WHEN title LIKE ? THEN 1      
                WHEN ingredients LIKE ? THEN 2 
                ELSE 3
                END,
                created_at DESC
                LIMIT 50`,
                [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
            );
            return results.map(this.parseRecipe);
        } catch (error) {
            console.error('Gagal mencari resep:', error);
            return [];
        }
    }
}