import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SettingsRepository } from '@/database/repositories/SettingsRepository';
import { AlarmManager } from '@/services/AlarmManager';
import { AlarmTime } from '@/types/alarm';

export const useSettings = () => {
    const [defaultWakeTime, setDefaultWakeTime] = useState<AlarmTime>({ hours: 6, minutes: 0 });
    const [defaultSleepTime, setDefaultSleepTime] = useState<AlarmTime>({ hours: 22, minutes: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);

            // Muat waktu default dari database
            const wakeTimeStr = await SettingsRepository.get('default_wake_time');
            const sleepTimeStr = await SettingsRepository.get('default_sleep_time');

            if (wakeTimeStr) {
                setDefaultWakeTime(JSON.parse(wakeTimeStr));
            }
            if (sleepTimeStr) {
                setDefaultSleepTime(JSON.parse(sleepTimeStr));
            }
        } catch (error) {
            console.error('Gagal memuat pengaturan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveDefaultWakeTime = async (time: AlarmTime) => {
        try {
            await SettingsRepository.set('default_wake_time', JSON.stringify(time));
            setDefaultWakeTime(time);
            console.log('Waktu bangun default disimpan');
        } catch (error) {
            console.error('Gagal menyimpan waktu bangun:', error);
            throw error;
        }
    };

    const saveDefaultSleepTime = async (time: AlarmTime) => {
        try {
            await SettingsRepository.set('default_sleep_time', JSON.stringify(time));
            setDefaultSleepTime(time);
            console.log('Waktu tidur default disimpan');
        } catch (error) {
            console.error('Gagal menyimpan waktu tidur:', error);
            throw error;
        }
    };

    const resetAllData = async () => {
        return new Promise<boolean>((resolve) => {
            Alert.alert(
                'Reset Semua Data',
                'Tindakan ini akan menghapus semua jadwal, catatan, dan riwayat makan. Data tidak bisa dikembalikan!',
                [
                    {
                        text: 'Batal',
                        style: 'cancel',
                        onPress: () => resolve(false),
                    },
                    {
                        text: 'Hapus Semua',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                // Batalkan semua alarm
                                await AlarmManager.cancelAllAlarms();

                                // Reset database via repository
                                await SettingsRepository.resetAllData();

                                Alert.alert('Berhasil', 'Semua data telah di-reset ke pengaturan awal.');
                                resolve(true);
                            } catch (error) {
                                console.error('Gagal reset data:', error);
                                Alert.alert('Error', 'Gagal melakukan reset data.');
                                resolve(false);
                            }
                        },
                    },
                ]
            );
        });
    };

    return {
        defaultWakeTime,
        defaultSleepTime,
        isLoading,
        saveDefaultWakeTime,
        saveDefaultSleepTime,
        resetAllData,
        loadSettings,
    };
};
