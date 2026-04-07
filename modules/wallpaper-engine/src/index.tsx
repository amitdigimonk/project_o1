import React from 'react';
import { requireNativeModule, requireNativeViewManager } from 'expo-modules-core';
import { Platform, ViewProps } from 'react-native';

export interface ChillSettings {
  weatherOverride: string;
  seasonOverride: string;
  liveTime: boolean;
  manualTime: number;
}

// ── 1. NATIVE MODULE BINDING ──
let WallpaperEngine: any;
try {
  WallpaperEngine = requireNativeModule('WallpaperEngine');
} catch (e) {
  console.error('[WallpaperEngine] Native module not found. Please run: npx expo run:android');
  WallpaperEngine = {
    setWallpaper: async () => false,
    setInteractiveWallpaper: async () => false,
    syncChillSettings: async () => false,
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

export async function syncChillSettings(settings: ChillSettings): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    if (WallpaperEngine.syncChillSettings) {
      WallpaperEngine.syncChillSettings(settings);
      return true;
    }
    return false;
  } catch (error) {
    console.error('[WallpaperEngine] Failed to sync settings:', error);
    return false;
  }
}


// ── 2. HTML WALLPAPER BRIDGE ──

/**
 * Saves the absolute file:// URL of the unzipped index.html into
 * SharedPreferences so HtmlWallpaperService reads it on start / restart.
 *
 * @param path - e.g. "file:///data/user/0/com.tossstudio/files/wallpaper/index.html"
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

// ── 3. NATIVE VIEW MANAGER BINDING ──

export type ChillBackgroundViewProps = {
  manualTime: number;
  isLiveTime: boolean;
  weatherOverride: string;
} & ViewProps;

// Link the TypeScript component directly to the Kotlin ExpoView
let NativeChillBackground: any;
try {
  NativeChillBackground = requireNativeViewManager('WallpaperEngine');
} catch (e) {
  console.warn('[WallpaperEngine] Native view manager not found. Rebuild app.');
}

// Export the React component wrapper
export function ChillBackgroundView(props: ChillBackgroundViewProps) {
  if (!NativeChillBackground) {
    // Safety fallback to prevent crashes on iOS or Expo Go
    const { View } = require('react-native');
    return <View { ...props } style = { [props.style, { backgroundColor: '#020818' }]} />;
  }
  return <NativeChillBackground { ...props } />;
}