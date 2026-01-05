import { useEffect, useState, useCallback } from 'react';
import { AlarmManager } from '@/services/AlarmManager';
import { NotificationService } from '@/services/NotificationService';
import { AlarmTime } from '@/types/alarm';

export const useAlarm = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [wakeAlarm, setWakeAlarm] = useState<{ time: AlarmTime; enabled: boolean } | null>(null);
    const [sleepAlarm, setSleepAlarm] = useState<{ time: AlarmTime; enabled: boolean } | null>(null);

    // Fungsi untuk refresh data alarm dari database
    const loadAlarms = useCallback(async () => {
        const wake = await AlarmManager.getWakeAlarm();
        const sleep = await AlarmManager.getSleepAlarm();
        setWakeAlarm(wake);
        setSleepAlarm(sleep);
    }, []);

    // Inisialisasi service saat hook dipanggil pertama kali
    useEffect(() => {
        const init = async () => {
            // 1. Init Alarm Manager
            const initialized = await AlarmManager.initialize();
            setIsInitialized(initialized);

            // 2. Cek Izin Notifikasi
            const permission = await NotificationService.checkPermissions();
            setHasPermission(permission);

            // 3. Load data alarm yang tersimpan
            await loadAlarms();
        };

        init();

        // 4. Pasang Listener (Pendengar) Notifikasi
        const notificationSub = NotificationService.subscribeToNotifications((notification) => {
            console.log('Notifikasi diterima saat aplikasi dibuka:', notification.request.content.title);
        });

        const responseSub = NotificationService.subscribeToNotificationResponse((response) => {
            console.log('Notifikasi diklik oleh user:', response.notification.request.content.title);
        });

        // Hapus listener saat komponen di-unmount (biar gak memori leak)
        return () => {
            notificationSub.remove();
            responseSub.remove();
        };
    }, [loadAlarms]);

    // Wrapper Functions (Biar UI tinggal panggil aja)

    const setWakeTime = async (time: AlarmTime, enabled: boolean = true) => {
        await AlarmManager.setWakeAlarm(time, enabled);
        await loadAlarms(); // Refresh state local
    };

    const setSleepTime = async (time: AlarmTime, enabled: boolean = true) => {
        await AlarmManager.setSleepAlarm(time, enabled);
        await loadAlarms();
    };

    const toggleWake = async () => {
        await AlarmManager.toggleWakeAlarm();
        await loadAlarms();
    };

    const toggleSleep = async () => {
        await AlarmManager.toggleSleepAlarm();
        await loadAlarms();
    };

    const testWakeAlarm = async () => {
        await AlarmManager.testAlarm('wake');
    };

    const testSleepAlarm = async () => {
        await AlarmManager.testAlarm('sleep');
    };

    const cancelAll = async () => {
        await AlarmManager.cancelAllAlarms();
        await loadAlarms();
    };

    const requestPermission = async () => {
        const granted = await NotificationService.requestPermissions();
        setHasPermission(granted);
        return granted;
    };

    // Return semua state dan fungsi yang dibutuhkan UI
    return {
        isInitialized,
        hasPermission,
        wakeAlarm,
        sleepAlarm,
        setWakeTime,
        setSleepTime,
        toggleWake,
        toggleSleep,
        testWakeAlarm,
        testSleepAlarm,
        cancelAll,
        requestPermission,
        loadAlarms,
    };
};