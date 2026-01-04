import { resetDailyState, getCurrentDate } from '@/database/db';
import { SettingsRepository } from '@/database/repositories/SettingsRepository';
import { DailyStateRepository } from '@/database/repositories/DailyStateRepository';
import { ScheduleRepository } from '@/database/repositories/ScheduleRepository';

// Cek dan reset status harian jika hari telah berganti
export const checkAndResetDaily = async (): Promise<boolean> => {
    try {
        const today = getCurrentDate();
        // Ambil tanggal terakhir reset dari settings
        const lastResetDate = await SettingsRepository.get('last_reset_date');

        // Jika tanggal di database beda dengan hari ini, lakukan reset
        if (lastResetDate !== today) {
            console.log(`Pergantian hari terdeteksi: ${lastResetDate} → ${today}`);

        // 1. Reset flag harian di database (update last_reset_date)
        await resetDailyState();

        // 2. Buat otomatis status harian (kotak centang) untuk semua jadwal aktif hari ini
        const schedules = await ScheduleRepository.getAllActive();
        for (const schedule of schedules) {
            await DailyStateRepository.createOrGetToday(schedule.id);
        }

        console.log('Proses reset harian selesai');
        return true;
    }

    return false;
    } catch (error) {
        console.error('Gagal mengecek reset harian:', error);
        throw error;
        }
};

// Bersihkan data lama (bisa dipanggil saat aplikasi start atau background job)
export const weeklyCleanup = async (): Promise<void> => {
    try {
        console.log('Menjalankan pembersihan data mingguan...');
        await DailyStateRepository.cleanupOldRecords();
        console.log('Pembersihan data selesai');
    } catch (error) {
        console.error('Gagal membersihkan data:', error);
    }
};