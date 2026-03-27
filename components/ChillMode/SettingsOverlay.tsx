import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Dimensions, Pressable, NativeModules, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Slider from '@react-native-community/slider';
import { useSettings } from '@/context/SettingsContext';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { androidWallpaperEngine } from '@/services/androidWallpaperEngine';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── DATA ARRAYS ──────────────────────────────────────────────────────────────
const REFRESH_RATES = ['5m', '30m', '1h', '2h', '3h', '4h'];

const WEATHER_OPTIONS = [
  { id: 'clear', icon: 'sunny-outline' },
  { id: 'partlyCloudy', icon: 'partly-sunny-outline' },
  { id: 'cloudy', icon: 'cloud-outline' },
  { id: 'rain', icon: 'rainy-outline' },
  { id: 'snow', icon: 'snow-outline' },
  { id: 'thunder', icon: 'thunderstorm-outline' },
  { id: 'storm', icon: 'weather-lightning-rainy', isMaterial: true },
  { id: 'fog', icon: 'weather-fog', isMaterial: true },
  { id: 'haze', icon: 'weather-hazy', isMaterial: true },
  { id: 'random', icon: 'shuffle-outline' },
];

const SEASON_OPTIONS = [
  { id: 'spring', icon: 'flower-outline' },
  { id: 'summer', icon: 'sunny-outline' },
  { id: 'autumn', icon: 'leaf-outline' },
  { id: 'winter', icon: 'snow-outline' },
  { id: 'random', icon: 'shuffle-outline' },
];

// ── REUSABLE UI COMPONENTS ─────────────────────────────────────────────────────

const Card = ({ children, isDark }: { children: React.ReactNode, isDark: boolean }) => (
  <View style={[styles.card, {}]}>
    {children}
  </View>
);

const SettingRow = ({ icon, title, description, rightElement, isDark }: any) => (
  <View style={styles.settingRow}>
    <View style={[styles.iconWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
      <Ionicons name={icon} size={20} color={isDark ? '#e2e8f0' : '#334155'} />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={[styles.settingTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>{title}</Text>
      {!!description && <Text style={[styles.settingDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>{description}</Text>}
    </View>
    {!!rightElement && <View style={styles.rightElement}>{rightElement}</View>}
  </View>
);

const IconButton = ({ icon, label, isDark, active = false, isMaterial = false, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.iconButton,
      active && { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }
    ]}
  >
    {isMaterial ? (
      <MaterialCommunityIcons name={icon as any} size={24} color={active ? (isDark ? '#60a5fa' : '#2563eb') : (isDark ? '#94a3b8' : '#64748b')} />
    ) : (
      <Ionicons name={icon} size={24} color={active ? (isDark ? '#60a5fa' : '#2563eb') : (isDark ? '#94a3b8' : '#64748b')} />
    )}
  </TouchableOpacity>
);

interface SettingsOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SettingsOverlay({ isVisible, onClose }: SettingsOverlayProps) {
  const isDark = useColorScheme() === 'dark';

  const {
    dynamicWeather, setDynamicWeather,
    autoSeason, setAutoSeason,
    weatherRefreshRate, setWeatherRefreshRate,
    weatherOverride, setWeatherOverride,
    seasonOverride, setSeasonOverride,
    liveTime, setLiveTime,
    manualTime, setManualTime
  } = useSettings();

  const handleSetWallpaper = async () => {
    if (Platform.OS === 'android') {
      const success = await androidWallpaperEngine.setInteractiveWallpaper('ChillWallpaperService');
      if (!success) {
        alert('Failed to launch the Live Wallpaper picker.');
      }
    } else {
      alert('Live Wallpaper is only supported on Android devices after building the APK.');
    }
  };

  // Local state for the timers
  const [randomWeatherTimer, setRandomWeatherTimer] = useState(2);
  const [randomSeasonTimer, setRandomSeasonTimer] = useState(2);
  const [seasonDay, setSeasonDay] = useState(178);

  if (!isVisible) return null;

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    return `${h}:${m} ${ampm}`;
  };

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={StyleSheet.absoluteFill}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <BlurView intensity={isDark ? 40 : 60} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />
      </Pressable>

      <Animated.View
        entering={SlideInDown.duration(400)}
        exiting={SlideOutDown}
        style={[styles.container, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.5)' }]}
      >
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={isDark ? '#94a3b8' : '#64748b'} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ── TIME SETTINGS ────────────────────────────────────────── */}
          <Card isDark={isDark}>
            <SettingRow
              icon="time"
              title="Live Time"
              description="Use device clock for day/night cycle"
              isDark={isDark}
              rightElement={<Switch value={liveTime} onValueChange={setLiveTime} trackColor={{ true: '#3b82f6' }} />}
            />
            {!liveTime && (
              <>
                <SettingRow
                  icon="sunny"
                  title="Manual Time"
                  description={`Current: ${formatTime(manualTime)}`}
                  isDark={isDark}
                />
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={23.9}
                    step={0.1}
                    value={manualTime}
                    onValueChange={setManualTime}
                    minimumTrackTintColor="#3b82f6"
                    maximumTrackTintColor={isDark ? '#334155' : '#cbd5e1'}
                    thumbTintColor={isDark ? '#fff' : '#3b82f6'}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabelText}>12 AM</Text>
                    <Text style={styles.sliderLabelText}>12 PM</Text>
                    <Text style={styles.sliderLabelText}>11 PM</Text>
                  </View>
                </View>
              </>
            )}
          </Card>

          {/* ── WEATHER SETTINGS ─────────────────────────────────────── */}
          <Card isDark={isDark}>
            <SettingRow
              icon="cloud"
              title="Dynamic Weather"
              description="Automatically fetch real weather"
              isDark={isDark}
              rightElement={<Switch value={dynamicWeather} onValueChange={setDynamicWeather} trackColor={{ true: '#3b82f6' }} />}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.refreshRates}>
              {REFRESH_RATES.map((rate) => (
                <TouchableOpacity
                  key={rate}
                  style={[
                    styles.refreshRateBtn,
                    weatherRefreshRate === rate && [styles.refreshRateBtnActive, { borderColor: isDark ? '#60a5fa' : '#3b82f6' }],
                    { borderColor: isDark ? '#334155' : '#e2e8f0' }
                  ]}
                  onPress={() => setWeatherRefreshRate(rate)}
                >
                  <Text style={[
                    styles.refreshRateText,
                    { color: weatherRefreshRate === rate ? (isDark ? '#60a5fa' : '#3b82f6') : (isDark ? '#94a3b8' : '#64748b') }
                  ]}>{rate}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <SettingRow
              icon="color-wand"
              title="Weather Override"
              description="Manually control the forecast"
              isDark={isDark}
            />

            <View style={styles.gridContainer}>
              {WEATHER_OPTIONS.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <IconButton
                    icon={item.icon}
                    isDark={isDark}
                    isMaterial={item.isMaterial}
                    active={weatherOverride === item.id}
                    onPress={() => {
                      setWeatherOverride(item.id as any);
                      setDynamicWeather(false);
                    }}
                  />
                </View>
              ))}
            </View>

            <SettingRow
              icon="timer-outline"
              title={`Randomize Timer: ${randomWeatherTimer}h`}
              isDark={isDark}
            />
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={12}
                step={1}
                value={randomWeatherTimer}
                onValueChange={setRandomWeatherTimer}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor={isDark ? '#334155' : '#cbd5e1'}
                thumbTintColor={isDark ? '#fff' : '#3b82f6'}
              />
            </View>
          </Card>

          {/* ── SEASONS SETTINGS ─────────────────────────────────────── */}
          <Card isDark={isDark}>
            <SettingRow
              icon="leaf"
              title="Dynamic Seasons"
              description="Sync with real-world dates"
              isDark={isDark}
              rightElement={<Switch value={autoSeason} onValueChange={setAutoSeason} trackColor={{ true: '#3b82f6' }} />}
            />

            <View style={styles.gridContainer}>
              {SEASON_OPTIONS.map((item) => (
                <View key={item.id} style={[styles.gridItem, { width: '20%' }]}>
                  <IconButton
                    icon={item.icon}
                    isDark={isDark}
                    active={seasonOverride === item.id}
                    onPress={() => {
                      setSeasonOverride(item.id as any);
                      setAutoSeason(false);
                    }}
                  />
                </View>
              ))}
            </View>

            <SettingRow
              icon="calendar-outline"
              title={`Season Cycle: Day ${Math.floor(seasonDay)}`}
              isDark={isDark}
            />
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={365}
                value={seasonDay}
                onValueChange={setSeasonDay}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor={isDark ? '#334155' : '#cbd5e1'}
                thumbTintColor={isDark ? '#fff' : '#3b82f6'}
              />
            </View>
          </Card>

          {/* ── SET WALLPAPER BUTTON ─────────────────────────────────────── */}
          <TouchableOpacity
            style={[styles.wallpaperBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}
            activeOpacity={0.8}
            onPress={handleSetWallpaper}
          >
            <Ionicons name="image-outline" size={20} color={isDark ? '#e2e8f0' : '#0f172a'} style={{ marginRight: 10 }} />
            <Text style={[styles.wallpaperText, { color: isDark ? '#e2e8f0' : '#0f172a' }]}>Set this background as wallpaper</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 24,
    marginBottom: 20,
    paddingVertical: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
  rightElement: {
    marginLeft: 12,
  },
  horizontalScroll: {
    paddingLeft: 72,
    marginBottom: 12,
  },
  refreshRates: {
    paddingRight: 20,
    alignItems: 'center',
  },
  refreshRateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 8,
  },
  refreshRateBtnActive: {
    borderWidth: 1.5,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  refreshRateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 12,
    marginTop: 2,
  },
  gridItem: {
    width: '20%',
    padding: 2,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  sliderContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -2,
  },
  sliderLabelText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '500',
  },
  wallpaperBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 40,
    marginTop: 10,
  },
  wallpaperText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  }
});
