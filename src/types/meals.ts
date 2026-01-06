export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Jadwal makan
export interface Meal {
    id: number;
    name: string;
    type: MealType;
    time: string;
    calories?: number;
    icon?: string;
    is_default: number;
    created_at: string;
}

// Checklist makan harian
export interface DailyMeal {
    id: number;
    meal_id: number;
    date: string;
    completed: number;
    completed_at: string;
    notes?: string;
}

// Helper untuk UI (gabung data meal + status)
export interface MealWithStatus extends Meal {
    daily_meal_id?: number;
    completed: number;
    completed_at: string;
}

export const MEAL_TYPE_LABEL: Record<MealType, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
};

export const MEAL_TYPE_ICON: Record<MealType, string> = {
    breakfast: '🍳',
    lunch: '🍱',
    dinner: '🍽️',
    snack: '🍿',
};