import '@expo/metro-runtime';
import { AppRegistry } from 'react-native';
import React from 'react';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { SettingsProvider } from './context/SettingsContext';
import LiveBackground from './components/ChillMode/LiveBackground';

console.log('=== STARTING JS BUNDLE: REGISTERING COMPONENTS ===');

// 1. Register our background wallpaper component immediately
const ChillWallpaper = () => (
  <SettingsProvider>
    <LiveBackground />
  </SettingsProvider>
);
AppRegistry.registerComponent('ChillWallpaper', () => ChillWallpaper);
console.log('=== CHILLWALLPAPER REGISTERED ===');

// 2. Set up the normal Expo Router app
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
