import { NotificationService } from './NotificationService';
import { AlarmConfig, AlarmTime, AlarmScheduleResult } from '@/types/alarm';
import { SettingsRepository } from '@/database/repositories/SettingsRepository';

export class AlarmManager {
    private static readonly WAKE_ALARM_ID = 'alarm_wake';
    private static readonly SLEEP_ALARM_ID = 'alarm_sleep';

    // Inisialisasi service alarm
    static async initialize(): Promise<boolean> {
        try {
            const hasPermission = await NotificationService.requestPermissions();
            if (!hasPermission) {
                console.log('Gagal inisialisasi alarm: Tidak ada izin');
                return false;
            }

            // Load alarm yang tersimpan di database dan jadwalkan ulang
            await this.restoreAlarms();

            console.log('Alarm manager berhasil diinisialisasi');
            return true;
        } catch (error) {
            console.error('Error inisialisasi alarm manager:', error);
            return false;
        }
    }

    // Set Alarm Bangun (Wake Up)
    static async setWakeAlarm(time: AlarmTime, enabled: boolean = true): Promise<AlarmScheduleResult> {
        const config: AlarmConfig = {
            id: this.WAKE_ALARM_ID,
            type: 'wake',
            time,
            enabled,
            repeatDaily: true,
            title: 'Waktunya Bangun!',
            body: `Sudah jam ${this.formatTime(time)}, ayo semangat memulai hari!`,
        };

    // Simpan ke database settings
    await SettingsRepository.set('alarm_wake_enabled', enabled.toString());
    await SettingsRepository.set('alarm_wake_time', JSON.stringify(time));

    // Jika dimatikan, batalkan alarm di sistem notifikasi
    if (!enabled) {
        await NotificationService.cancelAlarm(this.WAKE_ALARM_ID);
        return { success: true };
    }

    // Jadwalkan alarm
        return await NotificationService.scheduleAlarm(config);
    }

    // Set Alarm Tidur 
    static async setSleepAlarm(time: AlarmTime, enabled: boolean = true): Promise<AlarmScheduleResult> {
        const config: AlarmConfig = {
            id: this.SLEEP_ALARM_ID,
            type: 'sleep',
            time,
            enabled,
            repeatDaily: true,
            title: 'Waktunya Tidur',
            body: `Sudah jam ${this.formatTime(time)}. Istirahatlah untuk hari esok.`,
        };

        // Simpan ke database settings
        await SettingsRepository.set('alarm_sleep_enabled', enabled.toString());
        await SettingsRepository.set('alarm_sleep_time', JSON.stringify(time));

        if (!enabled) {
            await NotificationService.cancelAlarm(this.SLEEP_ALARM_ID);
            return { success: true };
        }

        return await NotificationService.scheduleAlarm(config);
    }

    // Ambil settingan Alarm Bangun
    static async getWakeAlarm(): Promise<{ time: AlarmTime; enabled: boolean } | null> {
        try {
            const timeStr = await SettingsRepository.get('alarm_wake_time');
            const enabledStr = await SettingsRepository.get('alarm_wake_enabled');

        if (!timeStr) return null;

        return {
            time: JSON.parse(timeStr),
            enabled: enabledStr === 'true',
        };
        } catch (error) {
            console.error('Gagal mengambil alarm bangun:', error);
            return null;
        }
    }

    // Ambil settingan Alarm Tidur
    static async getSleepAlarm(): Promise<{ time: AlarmTime; enabled: boolean } | null> {
        try {
            const timeStr = await SettingsRepository.get('alarm_sleep_time');
            const enabledStr = await SettingsRepository.get('alarm_sleep_enabled');

            if (!timeStr) return null;

            return {
                time: JSON.parse(timeStr),
                enabled: enabledStr === 'true',
            };
        } catch (error) {
            console.error('Gagal mengambil alarm tidur:', error);
            return null;
        }
    }

    // Toggle (On/Off) Alarm Bangun
    static async toggleWakeAlarm(): Promise<void> {
        const alarm = await this.getWakeAlarm();
        if (!alarm) return;

        await this.setWakeAlarm(alarm.time, !alarm.enabled);
    }

    // Toggle (On/Off) Alarm Tidur
    static async toggleSleepAlarm(): Promise<void> {
        const alarm = await this.getSleepAlarm();
        if (!alarm) return;

        await this.setSleepAlarm(alarm.time, !alarm.enabled);
    }

    // Restore alarms (sinkronisasi DB ke System Notification)
    // Dipanggil saat aplikasi baru dibuka/restart
    static async restoreAlarms(): Promise<void> {
        try {
            console.log('Mengembalikan alarm dari database...');

            const wakeAlarm = await this.getWakeAlarm();
            if (wakeAlarm && wakeAlarm.enabled) {
                await this.setWakeAlarm(wakeAlarm.time, true);
            }

            const sleepAlarm = await this.getSleepAlarm();
            if (sleepAlarm && sleepAlarm.enabled) {
                await this.setSleepAlarm(sleepAlarm.time, true);
            }

            console.log('Alarm berhasil direstore');
        } catch (error) {
            console.error('Gagal restore alarm:', error);
        }
    }

    // Hapus semua alarm (Reset)
    static async cancelAllAlarms(): Promise<void> {
        await NotificationService.cancelAllAlarms();
        await SettingsRepository.set('alarm_wake_enabled', 'false');
        await SettingsRepository.set('alarm_sleep_enabled', 'false');
    }

    // Helper: Format waktu jadi JAM : MENIT
    private static formatTime(time: AlarmTime): string {
        const hours = time.hours.toString().padStart(2, '0');
        const minutes = time.minutes.toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Test alarm (Notifikasi Instan)
    static async testAlarm(type: 'wake' | 'sleep'): Promise<void> {
        const title = type === 'wake' ? 'Test Bangun!' : 'Test Tidur';
        const body = type === 'wake' ? 'Ini adalah tes alarm bangun' : 'Ini adalah tes alarm tidur';
        await NotificationService.sendInstantNotification(title, body);
    }
}