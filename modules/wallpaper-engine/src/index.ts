import { requireNativeModule } from 'expo-modules-core';

const WallpaperEngine = requireNativeModule('WallpaperEngine');

export type WallpaperLocation = 'HOME' | 'LOCK' | 'BOTH';

export async function setWallpaper(imageUrl: string, location: WallpaperLocation): Promise<boolean> {
  return await WallpaperEngine.setWallpaper(imageUrl, location);
}

export async function setInteractiveWallpaper(serviceName: string = 'DinoWallpaperService'): Promise<boolean> {
  if (!WallpaperEngine.setInteractiveWallpaper) {
    throw new Error('Native function setInteractiveWallpaper not found. Please rebuild the app (npx expo run:android).');
  }
  return await WallpaperEngine.setInteractiveWallpaper(serviceName);
}
