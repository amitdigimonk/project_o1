import { Colors } from '@/constants/Colors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// --- Types ---
export type ThemeMode = 'light' | 'dark' | 'system';

// --- Combined Interface ---
export interface SettingsState {


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
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme();

    // Theme & App Settings States
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