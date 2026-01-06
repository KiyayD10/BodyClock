import { useState, useEffect } from 'react';
import { MorningNotesRepository } from '@/database/repositories/MorningNotesRepository';
import { CreateMorningNoteDTO, MorningNote } from '@/types/morningNotes'; 

export const useMorningNotes = () => {
    const [isCompleted, setIsCompleted] = useState(false);
    const [todayNote, setTodayNote] = useState<MorningNote | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cek status saat hook pertama kali dipanggil
    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            setIsLoading(true);
            const completed = await MorningNotesRepository.isTodayCompleted();
            const note = await MorningNotesRepository.getToday();
            setIsCompleted(completed);
            setTodayNote(note);
        } catch (error) {
            console.error('Gagal memuat status jurnal pagi:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const save = async (data: CreateMorningNoteDTO): Promise<void> => {
        try {
            await MorningNotesRepository.create(data);
            // Refresh status setelah save berhasil
            await checkStatus();
        } catch (error) {
            console.error('Gagal menyimpan jurnal pagi:', error);
            throw error;
        }
    };

    const getWeeklyStats = async () => {
        return await MorningNotesRepository.getWeeklyStats();
    };

    return {
        isCompleted,
        todayNote,
        isLoading,
        save,
        checkStatus,
        getWeeklyStats,
    };
};