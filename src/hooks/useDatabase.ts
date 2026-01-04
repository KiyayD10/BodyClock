import { useEffect, useState } from 'react';
import { initDatabase, resetDailyState } from '@/database/db';

export const useDatabase = () => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const setupDatabase = async () => {
            try {
                console.log('Menyiapkan database...');

            // Inisialisasi tabel-tabel database
            await initDatabase();

            // Cek apakah hari sudah berganti, jika ya reset status harian
            await resetDailyState();

            setIsReady(true);
            console.log('Database siap digunakan');
        } catch (err) {
            console.error('Gagal inisialisasi database:', err);
            setError(err as Error);
        }
    };

    setupDatabase();
    }, []);

    return { isReady, error };
};