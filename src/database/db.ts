import * as SQLite from 'expo-sqlite';

// Buka database
const db = SQLite.openDatabaseSync('bodyclock.db');

// Inisialisasi database dengan schema 
export const initDatabase = async (): Promise<void> => {
    try {
        console.log('Inisialisasi database...');

        // Buat table schedule
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS schedule (
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
            CREATE TABLE IF NOT EXISTS setting (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Buat index
        await db.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_daily_state_date ON daily_state(date);
            CREATE INDEX IF NOT EXISTS idx_daily_state_schedule_id ON daily_state(schedule_id);
            CREATE INDEX IF NOT EXISTS idx_schedule_templates_active ON schedule_templates(is_active);
        `);

        // Insert dfault setting
        await db.execAsync(`
            INSERT OR IGNORE INTO settings (key, value) 
            VALUES 
            ('last_reset_date', date('now')),
            ('theme', 'dark'),
            ('app_version', '1.0.0');
        `);
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