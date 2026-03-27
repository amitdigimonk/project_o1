import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NativeModules, Platform, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

// --- Types ---
export type WeatherType = 'clear' | 'partlyCloudy' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'storm' | 'fog' | 'haze' | 'random';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter' | 'random';
export type ThemeMode = 'light' | 'dark' | 'system';

// --- Combined Interface ---
export interface SettingsState {
    // Weather & Location
    liveLocation: boolean;
    setLiveLocation: (val: boolean) => void;
    dynamicWeather: boolean;
    setDynamicWeather: (val: boolean) => void;
    autoSeason: boolean;
    setAutoSeason: (val: boolean) => void;
    liveTime: boolean;
    setLiveTime: (val: boolean) => void;
    manualTime: number;
    setManualTime: (val: number) => void;
    weatherRefreshRate: string;
    setWeatherRefreshRate: (val: string) => void;
    weatherOverride: WeatherType;
    setWeatherOverride: (val: WeatherType) => void;
    seasonOverride: SeasonType;
    setSeasonOverride: (val: SeasonType) => void;
    windSpeed: number;
    setWindSpeed: (val: number) => void;
    isWallpaperMode: boolean;

    // Theme & App Settings
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
    lockScreenCategories: string[];
    toggleLockScreenCategory: (id: string) => void;
    eventsEnabled: boolean;
    setEventsEnabled: (enabled: boolean) => void;
    isDark: boolean;
    colors: typeof Colors.light;
}

// --- Context ---
const SettingsContext = createContext<SettingsState | undefined>(undefined);

// --- Provider ---
export const SettingsProvider = ({ children, isWallpaper }: { children: ReactNode, isWallpaper?: boolean }) => {
    const systemColorScheme = useColorScheme();

    // 1. Weather & Location States
    const [liveLocation, setLiveLocation] = useState(false);
    const [dynamicWeather, setDynamicWeather] = useState(false);
    const [autoSeason, setAutoSeason] = useState(true);
    const [liveTime, setLiveTime] = useState(true);
    const [manualTime, setManualTime] = useState(12);
    const [weatherRefreshRate, setWeatherRefreshRate] = useState('1h');
    const [weatherOverride, setWeatherOverride] = useState<WeatherType>('clear');
    const [seasonOverride, setSeasonOverride] = useState<SeasonType>('spring');
    const [windSpeed, setWindSpeed] = useState(0.0225);
    const [isWallpaperMode] = useState(!!isWallpaper);

    // 2. Theme & App Settings States
    const [themeMode, setThemeMode] = useState<ThemeMode>('system');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [lockScreenCategories, setLockScreenCategories] = useState<string[]>([]);
    const [eventsEnabled, setEventsEnabled] = useState(true);

    // --- Effects for Storage ---
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme-mode');
                const savedNotifications = await AsyncStorage.getItem('notifications-enabled');
                const savedCategories = await AsyncStorage.getItem('lock-screen-categories');
                const savedEvents = await AsyncStorage.getItem('events-enabled');

                if (savedTheme) setThemeMode(savedTheme as ThemeMode);
                if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
                if (savedCategories) setLockScreenCategories(JSON.parse(savedCategories));
                if (savedEvents) setEventsEnabled(savedEvents === 'true');
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadSettings();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('theme-mode', themeMode);
    }, [themeMode]);

    useEffect(() => {
        AsyncStorage.setItem('notifications-enabled', String(notificationsEnabled));
    }, [notificationsEnabled]);

    useEffect(() => {
        AsyncStorage.setItem('lock-screen-categories', JSON.stringify(lockScreenCategories));
    }, [lockScreenCategories]);

    useEffect(() => {
        AsyncStorage.setItem('events-enabled', String(eventsEnabled));
    }, [eventsEnabled]);

    // --- Helper Functions & Computed Values ---
    const toggleLockScreenCategory = (id: string) => {
        setLockScreenCategories(prev => {
            if (prev.includes(id)) {
                return prev.filter(catId => catId !== id);
            }
            if (prev.length >= 5) {
                return prev;
            }
            return [...prev, id];
        });
    };

    const isDark = themeMode === 'system'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';

    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <SettingsContext.Provider
            value={{
                // Weather & Location
                liveLocation, setLiveLocation,
                dynamicWeather, setDynamicWeather,
                autoSeason, setAutoSeason,
                liveTime, setLiveTime,
                manualTime, setManualTime,
                weatherRefreshRate, setWeatherRefreshRate,
                weatherOverride, setWeatherOverride,
                seasonOverride, setSeasonOverride,
                windSpeed, setWindSpeed,
                isWallpaperMode,

                // Theme & App Settings
                themeMode, setThemeMode,
                notificationsEnabled, setNotificationsEnabled,
                lockScreenCategories, toggleLockScreenCategory,
                eventsEnabled, setEventsEnabled,
                isDark, colors
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

// --- Hook ---
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

// Optional: Alias export if you have components already using `useSettingsContext`
export const useSettingsContext = useSettings;