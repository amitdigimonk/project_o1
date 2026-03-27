import '@expo/metro-runtime';
import { AppRegistry } from 'react-native';
import React from 'react';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { SettingsProvider } from './context/SettingsContext';
import LiveBackground from './components/ChillMode/LiveBackground';

// 1. Live Wallpaper Component
const ChillWallpaper = () => (
    <SettingsProvider>
        <LiveBackground />
    </SettingsProvider>
);
AppRegistry.registerComponent('ChillWallpaper', () => ChillWallpaper);

// 2. Main Expo Router App
export function App() {
    const ctx = require.context('./app');
    return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
