import { DailyMealsRepository } from "@/database/repositories/MealsRepository";
import { MorningNotesRepository } from "@/database/repositories/MorningNotesRepository";
import { MealWithStatus } from "@/types/meals"
import { MorningNote } from "@/types/morningNotes";
import { useCallback, useEffect, useState } from "react"

export const useToday = () => {
    const [meals, setMeals] = useState<MealWithStatus[]>([]);
    const [mealStats, setMealStats] = useState({ total: 0, completed: 0, percentage: 0 });
    const [morningNote, setMorningNote] = useState<MorningNote | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            // Ambil data jadwal hari ini
            const mealsData = await DailyMealsRepository.getTodayMeals();
            setMeals(mealsData);

            // Ambil statistik makan
            const stats = await DailyMealsRepository.getTodayStats();
            setMealStats(stats);

            // Ambil catatan pagi hari 
            const note = await MorningNotesRepository.getToday();
            setMorningNote(note);
        } catch (error) {
            console.error('Gagal mengambil data hari ini: ', error);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    useEffect(() => {
        loadData();
    }, [loadData]);

    const toggleMeal = async (mealId: number) => {
        try {
            await DailyMealsRepository.toggleCompletion(mealId);

            // Reload data untuk update UI
            await loadData();
        } catch (error) {
            console.error('Gagal mengubah status makan: ', error);
        }
    };

    return {
        meals,
        mealStats,
        morningNote,
        isLoading,
        loadData,
        toggleMeal,
    };
};