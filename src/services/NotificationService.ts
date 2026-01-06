import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { AlarmConfig, AlarmScheduleResult, AlarmTime } from '@/types/alarm';
import { router } from 'expo-router';

// Config handler notifikasi (saat app dibuka)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export class NotificationService {
    // Minta izin notifikasi
    static async requestPermissions(): Promise<boolean> {
        try {
            if (!Device.isDevice) {
                console.log('Notifikasi butuh perangkat fisik');
                return false;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Jika belum ada izin, minta user
            if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Izin ditolak');
            return false;
        }

        // Setup Channel Android ( untuk suara/getar)
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('alarm', {
                name: 'Alarm Notifications',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#00F0FF',
                sound: 'default',
                enableVibrate: true,
                enableLights: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                bypassDnd: true,
            });
        }

            console.log('Izin notifikasi aktif');
            return true;
        } catch (error) {
            console.error('Gagal minta izin:', error);
            return false;
        }
    }

    // Cek status izin tanpa popup
    static async checkPermissions(): Promise<boolean> {
        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
    }

    // Hitung detik ke waktu target
    static calculateSecondsUntilTime(targetTime: AlarmTime): number {
        const now = new Date();
        const target = new Date();
        target.setHours(targetTime.hours, targetTime.minutes, 0, 0);

        // Kalau jam target lewat, set besok
        if (target.getTime() <= now.getTime()) {
            target.setDate(target.getDate() + 1);
        }

        const diffMs = target.getTime() - now.getTime();
        return Math.floor(diffMs / 1000);
    }

    // Schedule alarm utama
    static async scheduleAlarm(config: AlarmConfig): Promise<AlarmScheduleResult> {
        try {
            const hasPermission = await this.checkPermissions();
            if (!hasPermission) return { success: false, error: 'Izin kurang' };

            // Hapus alarm lama dengan ID sama biar gak duplikat
            await this.cancelAlarm(config.id);

            let trigger: any;

            if (config.repeatDaily) {
                // Trigger Harian: Jam dan Menit spesifik
                trigger = { 
                    hour: config.time.hours, 
                    minute: config.time.minutes, 
                    repeats: true 
                };
            } else {
                // Trigger Sekali: Hitung detik
                const seconds = this.calculateSecondsUntilTime(config.time);
        
                // Safety: Detik minimal 1 agar tidak error 'invalid trigger'
                const safeSeconds = seconds > 0 ? seconds : 1; 

                trigger = { 
                    seconds: safeSeconds, 
                    repeats: false 
                };
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                identifier: config.id,
                content: {
                    title: config.title,
                    body: config.body,
                    sound: config.sound || 'default',
                    priority: Notifications.AndroidNotificationPriority.MAX, 
                    categoryIdentifier: 'alarm',
                    data: { type: config.type, alarmId: config.id },
                },
                trigger
            });

            console.log(`Alarm dijadwalkan: ${config.title} @ ${config.time.hours}:${config.time.minutes}`);
            return { success: true, notificationId };
        } catch (error) {
            console.error('Error schedule alarm:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown' };
        }
    }

    // Batalkan satu alarm
    static async cancelAlarm(alarmId: string): Promise<void> {
        try {
            await Notifications.cancelScheduledNotificationAsync(alarmId);
            console.log(`Alarm batal: ${alarmId}`);
        } catch (error) {
            console.error('Gagal batal alarm:', error);
        }
    }

    // Hapus SEMUA alarm
    static async cancelAllAlarms(): Promise<void> {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            console.log('Semua alarm dihapus');
        } catch (error) {
            console.error('Gagal hapus semua:', error);
        }
    }

    // Liat alarm yang antri
    static async getAllScheduledAlarms(): Promise<Notifications.NotificationRequest[]> {
        return await Notifications.getAllScheduledNotificationsAsync();
    }

    // Notif masuk (Foreground)
    static subscribeToNotifications(callback: (n: Notifications.Notification) => void) {
        return Notifications.addNotificationReceivedListener(callback);
    }

    // User klik notif
    static subscribeToNotificationResponse(callback: (r: Notifications.NotificationResponse) => void) {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }

    // Kirim notif instan
    static async sendInstantNotification(title: string, body: string) {
        await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: 'default' },
            trigger: null,
        });
    }
}

// Helper untuk handle notif
export const setupNotificationHandlers = () => {
    // Handler saat notifikasi diklik user
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        // Cek apakah notifikasi ini tipe-nya 'wake' (alarm pagi)
        if (data && data.type === 'wake') {
            console.log('Notifikasi diklik, membuka Morning Notes...');
            router.replace('/morning-notes' as any);
        }
    });

  return subscription;
};