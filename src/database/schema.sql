-- Table schedule untuk menyimpan jadwal yang buat oleh user
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

-- Table daily_state untuk tracking status harian (reset tiap hari)
CREATE TABLE IF NOT EXISTS daily_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schedule_id INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    completed_at TEXT,
    notes TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE
);

-- Table setting untuk simpan pengaturan app (last reset date, theme, dll)
CREATE TABLE IF NOT EXISTS setting (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa querry
CREATE INDEX IF NOT EXISTS idx_daily_state_date ON daily_state (date);
CREATE INDEX IF NOT EXISTS idx_daily_state_schedule_id ON daily_state(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_templates_active ON schedule_templates(is_active);

-- Insert default data
INSERT OR IGNORE INTO setting (key, value) VALUES ('last_reset_date', date('now'));
INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', 'dark');
INSERT OR IGNORE INTO settings (key, value) VALUES ('app_version', '1.0.0');