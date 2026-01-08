import { useState, useEffect, useCallback } from 'react';
import { RecipesRepository } from '@/database/repositories/RecipesRepository';
import { Recipe, RecipeFilters, CreateRecipeDTO, UpdateRecipeDTO } from '@/types/recipes';

export const useRecipes = (initialFilters?: RecipeFilters) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filters, setFilters] = useState<RecipeFilters>(initialFilters || {});
    const [isLoading, setIsLoading] = useState(true);
    const [categoryCount, setCategoryCount] = useState<Record<string, number>>({});

    const loadRecipes = useCallback(async () => {
        try {
            setIsLoading(true);
            // Ambil data resep berdasarkan filter
            const data = await RecipesRepository.getAll(filters);
            setRecipes(data);

            // Muat jumlah resep per kategori 
            const count = await RecipesRepository.getCountByCategory();
            setCategoryCount(count);
        } catch (error) {
            console.error('Gagal memuat resep:', error);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Reload saat filter berubah
    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    const createRecipe = async (data: CreateRecipeDTO): Promise<number> => {
        const id = await RecipesRepository.create(data);
        await loadRecipes(); // Refresh list
        return id;
    };

    const updateRecipe = async (id: number, data: UpdateRecipeDTO): Promise<void> => {
        await RecipesRepository.update(id, data);
        await loadRecipes();
    };

    const archiveRecipe = async (id: number): Promise<void> => {
        await RecipesRepository.archive(id);
        await loadRecipes();
    };

    const unarchiveRecipe = async (id: number): Promise<void> => {
        await RecipesRepository.unarchive(id);
        await loadRecipes();
    };

    const deleteRecipe = async (id: number): Promise<void> => {
        await RecipesRepository.deletePermanent(id);
        await loadRecipes();
    };

    const searchRecipes = async (query: string): Promise<void> => {
        setFilters((prev) => ({ ...prev, search: query }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    return {
        recipes,
        filters,
        isLoading,
        categoryCount,
        setFilters,
        loadRecipes,
        createRecipe,
        updateRecipe,
        archiveRecipe,
        unarchiveRecipe,
        deleteRecipe,
        searchRecipes,
        clearFilters,
    };
};