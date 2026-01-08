export type RecipeCategory = 'daging' | 'ikan' | 'sayur' | 'tempe' | 'telur'| 'frozen' | 'tahu' ;
export type RecipeTag = 'bulking' | 'murah';

export interface Recipe {
    id: number;
    title: string;
    category: RecipeCategory;
    tags: RecipeTag[]; 
    ingredients: string[]; 
    steps: string[]; 
    notes?: string;
    is_archived: number; 
    created_at: string;
    updated_at: string;
}

export interface CreateRecipeDTO {
    title: string;
    category: RecipeCategory;
    tags: RecipeTag[];
    ingredients: string[];
    steps: string[];
    notes?: string;
}

export interface UpdateRecipeDTO extends Partial<CreateRecipeDTO> {
    is_archived?: number;
}

export interface RecipeFilters {
    search?: string;
    category?: RecipeCategory;
    tags?: RecipeTag[];
    showArchived?: boolean;
}

export const RECIPE_CATEGORIES: { value: RecipeCategory; label: string; icon: string }[] = [
    { value: 'daging', label: 'Daging', icon: '🥩' },
    { value: 'ikan', label: 'Ikan', icon: '🐟' },
    { value: 'sayur', label: 'Sayur', icon: '🥬' },
    { value: 'tempe', label: 'Tempe', icon: '🟫' },
    { value: 'telur', label: 'Telur', icon: '🥚' },
    { value: 'frozen', label: 'Frozen', icon: '❄️' },
    { value: 'tahu', label: 'Tahu', icon: '⬜' },
];

export const RECIPE_TAGS: { value: RecipeTag; label: string; icon: string }[] = [
    { value: 'bulking', label: 'Bulking', icon: '💪' },
    { value: 'murah', label: 'Murah', icon: '💰' },
];