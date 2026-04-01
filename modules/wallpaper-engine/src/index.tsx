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

// Allow passing ANY service name, defaulting to Dino if none is provided
export async function setInteractiveWallpaper(serviceName: string = 'DinoWallpaperService'): Promise<boolean> {
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


// ── 2. NATIVE VIEW MANAGER BINDING (NEW) ──

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