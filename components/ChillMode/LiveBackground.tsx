import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  useSharedValue,
  interpolate,
  useDerivedValue,
  interpolateColor,
  Extrapolate
} from 'react-native-reanimated';
import { useSettings } from '@/context/SettingsContext';

import PineTree from './PineTree';
import Sun from './Sun';
import Moon from './Moon';
import Landscape from './Landscape';
import WeatherEffects from './WeatherEffects';
import Cloud from './Cloud';
import Water from './Water';
import Sky from './Sky';
import AnimeParticles from './AnimeParticles';

export default function LiveBackground() {
  const { weatherOverride, seasonOverride, liveTime, manualTime } = useSettings();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const getInitialTime = () => {
    if (liveTime) {
      const now = new Date();
      return now.getHours() + now.getMinutes() / 60;
    }
    return manualTime;
  };

  const time = useSharedValue(getInitialTime());

  // ── TIME SYNC ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!liveTime) {
      time.value = withTiming(manualTime, { duration: 500 });
      return;
    }
    const updateTime = () => {
      const d = new Date();
      time.value = d.getHours() + d.getMinutes() / 60;
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [liveTime, manualTime]);

  const SUNRISE = 6;
  const SUNSET = 18;

  // ── SUN / MOON MOVEMENT ────────────────────────────────────────
  const sunStyle = useAnimatedStyle(() => {
    const progress = interpolate(time.value, [SUNRISE, SUNSET], [0, 1], Extrapolate.CLAMP);
    const x = interpolate(progress, [0, 1], [-20, screenWidth - 80]);
    const y = interpolate(Math.sin(progress * Math.PI), [0, 1], [screenHeight * 0.45, screenHeight * 0.1]);
    const scale = interpolate(Math.abs(progress - 0.5), [0, 0.5], [0.55, 0.95]);
    return {
      position: 'absolute', left: x, top: y,
      opacity: withTiming((time.value >= SUNRISE - 0.5 && time.value <= SUNSET + 0.5) ? 1 : 0),
      transform: [{ scale }],
    };
  });

  const moonStyle = useAnimatedStyle(() => {
    let progress = 0;
    if (time.value >= SUNSET) progress = interpolate(time.value, [SUNSET, 24], [0, 0.5], Extrapolate.CLAMP);
    else if (time.value < SUNRISE) progress = interpolate(time.value, [0, SUNRISE], [0.5, 1], Extrapolate.CLAMP);
    const x = interpolate(progress, [0, 1], [-20, screenWidth - 80]);
    const y = interpolate(Math.sin(progress * Math.PI), [0, 1], [screenHeight * 0.45, screenHeight * 0.1]);
    return {
      position: 'absolute', left: x, top: y,
      opacity: withTiming((time.value >= SUNSET - 0.5 || time.value <= SUNRISE + 0.5) ? 1 : 0),
      transform: [{ scale: 0.8 }],
    };
  });

  // ── CLOUDS ─────────────────────────────────────────────────────────────────
  const cloudAnim = useSharedValue(0);
  React.useEffect(() => {
    cloudAnim.value = withRepeat(
      withTiming(4, { duration: 120000, easing: Easing.linear }),
      -1, false
    );
  }, []);

  const cloudData = React.useMemo(() => [
    { id: 'c1', size: 100 + Math.random() * 40, top: 40 + Math.random() * 20, offset: Math.random() * 4, opacity: 0.3 + Math.random() * 0.2, wind: 'right' as const },
    { id: 'c2', size: 140 + Math.random() * 50, top: 120 + Math.random() * 40, offset: Math.random() * 4, opacity: 0.2 + Math.random() * 0.3, wind: 'right' as const },
    { id: 'c3', size: 110 + Math.random() * 30, top: 80 + Math.random() * 40, offset: Math.random() * 4, opacity: 0.15 + Math.random() * 0.25, wind: 'right' as const },
    { id: 'c4', size: 90 + Math.random() * 40, top: 60 + Math.random() * 100, offset: Math.random() * 4, opacity: 0.25 + Math.random() * 0.2, wind: 'right' as const },
  ], []);

  // ── WIND GUSTS ─────────────────────────────────────────────────────────────
  const windAnim = useSharedValue(0);
  React.useEffect(() => {
    const triggerGust = () => {
      const delay = 3000 + Math.random() * 9000;
      const intensity = 0.4 + Math.random() * 0.6;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const gustVal = direction * intensity;

      windAnim.value = withDelay(
        delay,
        withSequence(
          withTiming(gustVal, { duration: 800 + Math.random() * 600, easing: Easing.out(Easing.quad) }),
          withTiming(gustVal * 0.8, { duration: 400 + Math.random() * 800 }),
          withTiming(gustVal, { duration: 200 }),
          withTiming(0, { duration: 1200 + Math.random() * 800, easing: Easing.inOut(Easing.ease) })
        )
      );
    };
    triggerGust();
    const interval = setInterval(triggerGust, 14000);
    return () => clearInterval(interval);
  }, []);

  // ── DYNAMIC TREE GENERATOR (Cursor Sweep Algorithm) ────────────────────────
  const { bgTrees, midTrees, foreTrees } = useMemo(() => {
    const generateLayer = (
      prefix: string,
      minW: number, maxW: number,
      minH: number, maxH: number,
      baseBottom: number,
      windStr: number
    ) => {
      const trees = [];
      let currentX = -4; // Start slightly offscreen to the left

      let i = 0;
      while (currentX < screenWidth + 20) {
        const w = minW + Math.random() * (maxW - minW);
        const h = minH + Math.random() * (maxH - minH);

        const bottom = baseBottom + (Math.random() * (screenHeight * 0.02) - (screenHeight * 0.01));
        const gap = w * 0.2 + Math.random() * (w * 1.5);

        trees.push({
          id: `${prefix}_${i}`,
          width: w,
          height: h,
          left: currentX,
          bottom: bottom,
          windPhase: Math.random(),
          windStrength: windStr
        });

        currentX += w + gap;
        i++;
      }
      return trees;
    };

    return {
      bgTrees: generateLayer('bg', 20, 30, 35, 50, screenHeight * 0.35, 0.4),
      midTrees: generateLayer('mid', 35, 50, 65, 90, screenHeight * 0.25, 0.7),
      foreTrees: generateLayer('fore', 60, 90, 100, 150, screenHeight * 0.10, 1.0)
    };
  }, [screenWidth, screenHeight]);


  // ── SEASONAL COLORS ────────────────────────────────────────────────────────
  type Season = 'spring' | 'summer' | 'autumn' | 'winter';
  const safeSeason: Season = (['spring', 'summer', 'autumn', 'winter'] as Season[]).includes(seasonOverride as Season)
    ? (seasonOverride as Season) : 'spring';

  const landscapeColorDV = useDerivedValue(() => {
    const map: Record<Season, string[]> = {
      spring: ['#2c3e50', '#5a7e3a', '#5a7e3a', '#3e4b25', '#2c3e50'],
      summer: ['#1a252f', '#244f54', '#244f54', '#36596f', '#1a252f'],
      autumn: ['#0e141a', '#a0744d', '#a0744d', '#713f37', '#0e141a'],
      winter: ['#1B2735', '#406983', '#406983', '#242949', '#1B2735'],
    };
    return interpolateColor(time.value, [0, 6, 12, 18, 24], map[safeSeason]);
  });

  const treeBgDV = useDerivedValue(() => {
    const map: Record<Season, string[]> = {
      spring: ['#1B2735', '#2c3e50', '#1B2735'],
      summer: ['#0e141a', '#1a252f', '#0e141a'],
      autumn: ['#1B2735', '#422419', '#1B2735'],
      winter: ['#1B2735', '#1B2735', '#1B2735'],
    };
    return interpolateColor(time.value, [0, 12, 24], map[safeSeason]);
  });

  const treeMidDV = useDerivedValue(() => {
    const map: Record<Season, string[]> = {
      spring: ['#0e141a', '#1a252f', '#0e141a'],
      summer: ['#061009', '#0e141a', '#061009'],
      autumn: ['#1B2735', '#5e311a', '#1B2735'],
      winter: ['#1B2735', '#2c3e50', '#1B2735'],
    };
    return interpolateColor(time.value, [0, 12, 24], map[safeSeason]);
  });

  const treeForeDV = useDerivedValue(() => {
    const map: Record<Season, string[]> = {
      spring: ['#0e141a', '#2d5a27', '#0e141a'],
      summer: ['#061009', '#1a3c1a', '#061009'],
      autumn: ['#1B2735', '#834c24', '#1B2735'],
      winter: ['#1B2735', '#2c3e50', '#1B2735'],
    };
    return interpolateColor(time.value, [0, 12, 24], map[safeSeason]);
  });

  const waterDeepDV = useDerivedValue(() =>
    interpolateColor(time.value, [0, 6, 12, 18, 24],
      ['#0B1026', '#1f71d5', '#5fa8ff', '#1B2735', '#0B1026'])
  );
  const waterShallowDV = useDerivedValue(() =>
    interpolateColor(time.value, [0, 6, 12, 18, 24],
      ['#1a252f', '#75bec3', '#80f9ff', '#2c3e50', '#1a252f'])
  );

  // ── ATMOSPHERIC GHIBLI OVERLAYS ────────────────────────────────────────────
  const timeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(time.value, [0, 6, 12, 18, 24], [0.65, 0.1, 0, 0.1, 0.65], Extrapolate.CLAMP);
    return { backgroundColor: `rgba(2, 8, 24, ${opacity})` };
  });

  const fogOpacity = useDerivedValue<number>(() => {
    const target: number = (weatherOverride === 'fog' || weatherOverride === 'haze') ? 1 : 0;
    return withTiming(target, { duration: 1000 });
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: '#020818' }]}>

      {/* ── SKY & CELESTIAL ── */}
      <Sky time={time} weatherOverride={weatherOverride} />
      <Sun style={sunStyle} time={time} sunrise={SUNRISE} sunset={SUNSET} />
      <Moon style={moonStyle} time={time} />

      {cloudData.map(cloud => (
        <Cloud
          key={cloud.id}
          animValue={cloudAnim}
          screenOffset={cloud.offset}
          screenWidth={screenWidth}
          style={{ position: 'absolute', top: cloud.top }}
          opacity={cloud.opacity}
          width={cloud.size}
          height={cloud.size * 0.5}
          windDirection={cloud.wind}
        />
      ))}

      {/* ── UNIFIED BACKGROUND & FOG LAYER ── */}
      {/* We only render this once now! It contains all 3 hills and the fog between them. */}
      <Landscape
        colorDV={landscapeColorDV}
        fogOpacity={fogOpacity}
        style={{ position: 'absolute', bottom: screenHeight * 0.18, height: screenHeight * 0.35 }}
      />

      {/* ── TREES ── */}
      {/* The trees now render on top of the hills, framing the shot. */}
      <View style={styles.treesContainer}>
        {bgTrees.map(t => (
          <PineTree key={t.id} width={t.width} height={t.height} style={{ position: 'absolute', bottom: t.bottom, left: t.left }} colorDV={treeBgDV} windAnim={windAnim} windPhase={t.windPhase} windStrength={t.windStrength} />
        ))}
        {midTrees.map(t => (
          <PineTree key={t.id} width={t.width} height={t.height} style={{ position: 'absolute', bottom: t.bottom, left: t.left }} colorDV={treeMidDV} windAnim={windAnim} windPhase={t.windPhase} windStrength={t.windStrength} />
        ))}
        {foreTrees.map(t => (
          <PineTree key={t.id} width={t.width} height={t.height} style={{ position: 'absolute', bottom: t.bottom, left: t.left }} colorDV={treeForeDV} windAnim={windAnim} windPhase={t.windPhase} windStrength={t.windStrength} />
        ))}
      </View>

      {/* ── WATER ── */}
      <Water time={cloudAnim} deepColorDV={waterDeepDV} shallowColorDV={waterShallowDV} horizonY={0.90} />

      {/* ── GLOBAL NIGHT FILTER ── */}
      <Animated.View style={[StyleSheet.absoluteFillObject, timeOverlayStyle]} pointerEvents="none" />

      {/* ── WEATHER OVERLAYS ── */}
      <WeatherEffects type={weatherOverride as any || 'none'} />

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  treesContainer: { ...StyleSheet.absoluteFillObject },
});