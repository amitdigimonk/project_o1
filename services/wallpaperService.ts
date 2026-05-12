import { MOCK_WALLPAPERS } from './mockData';
import { Wallpaper } from '@/types';

const mapWallpaper = (wp: any): Wallpaper => ({
    ...wp,
    image: wp.image || wp.url,
    thumbnail: wp.thumbnail || wp.image || wp.url,
});

export const getCachedWallpapers = async (categoryId?: string): Promise<Wallpaper[] | null> => {
    const filtered = categoryId && categoryId !== 'All'
        ? MOCK_WALLPAPERS.filter((wp: any) => wp.category?.id === categoryId)
        : MOCK_WALLPAPERS;
    return filtered.map(mapWallpaper);
};

export const fetchWallpapersByCategory = async (
    categoryId?: string,
    page = 1,
    limit = 20,
    onBackgroundUpdate?: (data: Wallpaper[]) => void
): Promise<Wallpaper[]> => {
    const filtered = categoryId && categoryId !== 'All'
        ? MOCK_WALLPAPERS.filter((wp: any) => wp.category?.id === categoryId)
        : MOCK_WALLPAPERS;

    const start = (page - 1) * limit;
    const result = filtered.slice(start, start + limit).map(mapWallpaper);

    if (onBackgroundUpdate) {
        onBackgroundUpdate(result);
    }

    return result;
};
