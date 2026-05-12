import { MOCK_CATEGORIES } from './mockData';
import { Category } from '@/types';

export const getCachedCategories = async (): Promise<Category[] | null> => {
    return MOCK_CATEGORIES;
};

export const fetchHomeCategories = async (lng: string): Promise<Category[]> => {
    return MOCK_CATEGORIES.map(cat => ({
        ...cat,
        name: typeof cat.name === 'object' ? ((cat.name as any)[lng] || (cat.name as any)['en']) : cat.name,
    }));
};
