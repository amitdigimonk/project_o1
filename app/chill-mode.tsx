import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettings } from '@/context/SettingsContext';
import SettingsOverlay from '@/components/ChillMode/SettingsOverlay';
import LiveBackground from '@/components/ChillMode/LiveBackground';

export default function ChillModeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isWallpaperMode } = useSettings();
  const isDark = colorScheme === 'dark';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isWallpaperMode) return null;

  const textColor = isDark ? '#ffffff' : '#333333';
  const iconColor = isDark ? '#dddddd' : '#555555';

  return (
    <SafeAreaView style={styles.container}>
      <LiveBackground />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color={iconColor} />
        </TouchableOpacity>

        <Text style={[styles.appTitle, { color: textColor }]}>CHILL PAPER</Text>

        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => setIsSettingsOpen(true)}
        >
          <Ionicons name="settings-outline" size={26} color={iconColor} />
        </TouchableOpacity>
      </View>

      <SettingsOverlay
        isVisible={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  settingsIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
  },
});
