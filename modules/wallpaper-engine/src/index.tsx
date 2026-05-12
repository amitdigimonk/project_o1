import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';


// ── 1. NATIVE MODULE BINDING ──
let WallpaperEngine: any;
try {
  WallpaperEngine = requireNativeModule('WallpaperEngine');
} catch (e) {
  console.error('[WallpaperEngine] Native module not found. Please run: npx expo run:android');
  WallpaperEngine = {
    setWallpaper: async () => false,
    setInteractiveWallpaper: async () => false,
  };
}

export type WallpaperLocation = 'HOME' | 'LOCK' | 'BOTH';

export async function setWallpaper(imageUrl: string, location: WallpaperLocation): Promise<boolean> {
  return await WallpaperEngine.setWallpaper(imageUrl, location);
}

export async function setInteractiveWallpaper(serviceName: string = 'HtmlWallpaperService'): Promise<boolean> {
  if (!WallpaperEngine.setInteractiveWallpaper) {
    throw new Error('Native function setInteractiveWallpaper not found. Please rebuild the app (npx expo run:android).');
  }
  return await WallpaperEngine.setInteractiveWallpaper(serviceName);
}


// ── 2. HTML WALLPAPER BRIDGE ──

/**
 * Saves the absolute file:// URL of the unzipped index.html into
 * SharedPreferences so HtmlWallpaperService reads it on start / restart.
 *
 * @param path - e.g. "file:///data/user/0/com.macwell.vibewalls/files/wallpaper/index.html"
 * @returns true on success, false on error
 */
export async function saveHtmlWallpaperPath(path: string): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    return WallpaperEngine.saveHtmlWallpaperPath(path) ?? false;
  } catch (error) {
    console.error('[WallpaperEngine] saveHtmlWallpaperPath failed:', error);
    return false;
  }
}

/**
 * Fires the system ACTION_CHANGE_LIVE_WALLPAPER intent pre-pointed at
 * HtmlWallpaperService so the user lands on the live-wallpaper preview.
 *
 * Call saveHtmlWallpaperPath() first or the preview shows a fallback page.
 *
 * @returns true if the intent was started successfully
 */
export async function applyHtmlWallpaper(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    return WallpaperEngine.applyHtmlWallpaper() ?? false;
  } catch (error) {
    console.error('[WallpaperEngine] applyHtmlWallpaper failed:', error);
    return false;
  }
}

