import * as SQLite from 'expo-sqlite';

// Buka database
const db = SQLite.openDatabaseSync('bodyclock.db');

// Inisialisasi database dengan schema 
export const initDatabase = async (): Promise<void> => {
    try {
        console.log('Inisialisasi database...');

        // Buat table schedule
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS schedule_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                time TEXT NOT NULL,
                description TEXT,
                icon TEXT,
                color TEXT,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Buat table daily_state
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS daily_state (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                schedule_id INTEGER NOT NULL,
                completed INTEGER DEFAULT 0,
                completed_at TEXT,
                notes TEXT,
                date TEXT NOT NULL,
                FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE
            );
        `);

        // Buat table setting
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Buat table morning_notes
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS morning_notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL UNIQUE,
                mood TEXT,
                sleep_quality INTEGER,
                energy_level INTEGER, 
                notes TEXT,
                completed_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Buat table makan
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS meals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('breakfast', 'lunch', 'dinner', 'snack')),
                time TEXT NOT NULL,
                calories INTEGER,
                icon TEXT,
                is_default INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );
            `);

        // Buat table checlist harian
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS daily_meals(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                meal_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                completed_at TEXT,
                notes TEXT,
                FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
                UNIQUE(meal_id, date)
            );
        `);

        // Buat table resep masakan
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL CHECK(category IN ('daging', 'ikan', 'sayur', 'tempe', 'telur', 'frozen', 'tahu')),
                tags TEXT,
                ingredients TEXT NOT NULL,
                steps TEXT NOT NULL,
                notes TEXT,
                is_archived INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Buat index
        await db.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_daily_state_date ON daily_state(date);
            CREATE INDEX IF NOT EXISTS idx_daily_state_schedule_id ON daily_state(schedule_id);
            CREATE INDEX IF NOT EXISTS idx_schedule_templates_active ON schedule_templates(is_active);
            CREATE INDEX IF NOT EXISTS idx_morning_notes_date ON morning_notes(date);
            CREATE INDEX IF NOT EXISTS idx_daily_meals_date ON daily_meals(date);
            CREATE INDEX IF NOT EXISTS idx_meals_type ON meals(type);
            CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
            CREATE INDEX IF NOT EXISTS idx_recipes_archived ON recipes(is_archived);
            CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title);
        `);

        // Insert dfault setting
        await db.execAsync(`
            INSERT OR IGNORE INTO settings (key, value) 
            VALUES 
            ('last_reset_date', date('now')),
            ('theme', 'dark'),
            ('app_version', '1.0.0'),
            ('morning_notes_completed_today', '0');
        `);

        // Makanan
        const mealCount = await db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM meals'
        );

        if (!mealCount || mealCount.count === 0) {
            await db.execAsync(`
                INSERT INTO meals (name, type, time, calories, icon) VALUES
                ('Breakfast', 'breakfast', '08:00', 400, '🍳'),
                ('Lunch', 'lunch', '12:00', 600, '🍱'),
                ('Dinner', 'dinner', '19:00', 500, '🍽️');
            `);
            console.log('Default meals inserted');
        }

        console.log('Database inisialisasi selesai.');
    } catch (error) {
        console.error('Gagal inisialisasi database:', error);
        throw error;
    }
};

// Reset harian
export const resetDailyState = async (): Promise<void> => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Tanggal reset terakhir
        const lastResetResult = await db.getFirstAsync<{ value: string}> (
            'SELECT value FROM settings WHERE key = ? ',
            ['last_reset_date']
        );
        const lastResetDate = lastResetResult?.value;

        // Jika hari berbeda, reset daily_state
        if (lastResetDate !== today) {
            console.log(`Reset ulang daily state dari ${lastResetDate} to ${today}`);

            // Hapus daily state lama
            await db.runAsync('DELETE FROM daily_state WHERE date < date("now", "-7 days")');

            // Update tanggal reset terakhir
            await db.runAsync('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?', [
                today,
                'last_reset_date',
            ]);

            // Reset status pagi hari
            await db.runAsync(
                'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
                ['morning_notes_completed_today', '0']
            );

            console.log('Reset daily state selesai.');
        } else {
            console.log('Tidak perlu reset daily state.');
        }
    } catch (error) {
        console.log('Gagal reset daily state:', error);
        throw error;
    }
};

// Ambil tanggal sekarang
export const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

export default db;