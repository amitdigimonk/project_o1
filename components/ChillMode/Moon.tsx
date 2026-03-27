import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
  interpolate,
  Extrapolate,
  SharedValue,
  createAnimatedComponent,
} from 'react-native-reanimated';
import Svg, { Path, Defs, RadialGradient, Stop, Circle, G } from 'react-native-svg';

const AnimatedCircle = createAnimatedComponent(Circle);

interface MoonProps {
  style?: any;
  date?: Date;
  time?: SharedValue<number>; // ── NEW: We need time to know when midnight is!
}

// ── LUNAR MATH ─────────────────────────────────────────────────────────────
const KNOWN_NEW_MOON = new Date('2024-01-11T11:57:00Z').getTime();
const LUNAR_CYCLE_MS = 29.53058867 * 24 * 60 * 60 * 1000;

const getLunarPhase = (date: Date) => {
  const diff = date.getTime() - KNOWN_NEW_MOON;
  let phase = (diff % LUNAR_CYCLE_MS) / LUNAR_CYCLE_MS;
  if (phase < 0) phase += 1;
  return phase;
};

const getMoonPhasePath = (phase: number) => {
  const r = 25;
  const cx = 50;
  const cy = 50;
  const topY = cy - r;
  const botY = cy + r;

  if (phase === 0 || phase === 1) return "";

  const MIN_CURVE = 4.5;

  if (phase <= 0.5) {
    const p = phase * 2;
    let rx = r * Math.abs(Math.cos(p * Math.PI));
    if (rx < MIN_CURVE) rx = MIN_CURVE;
    const sweep = p <= 0.5 ? 0 : 1;
    return `M ${cx},${topY} A ${r},${r} 0 0,1 ${cx},${botY} A ${rx},${r} 0 0,${sweep} ${cx},${topY} Z`;
  } else {
    const p = (phase - 0.5) * 2;
    let rx = r * Math.abs(Math.cos(p * Math.PI));
    if (rx < MIN_CURVE) rx = MIN_CURVE;
    const sweep = p <= 0.5 ? 0 : 1;
    return `M ${cx},${topY} A ${r},${r} 0 0,0 ${cx},${botY} A ${rx},${r} 0 0,${sweep} ${cx},${topY} Z`;
  }
};

// ── COMPONENT ──────────────────────────────────────────────────────────────
const Moon: React.FC<MoonProps> = ({ style, date = new Date(), time }) => {
  const pulse = useSharedValue(0.7);

  const moonPath = useMemo(() => {
    const phase = getLunarPhase(date);
    return getMoonPhasePath(phase);
  }, [date]);

  React.useEffect(() => {
    // Keeps the subtle atmospheric flicker running continuously
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0.6, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  // ── DYNAMIC MIDNIGHT GLOW (UI Thread) ────────────────────────────────────
  const glowProps = useAnimatedProps(() => {
    let midnightBoost = 1;

    if (time) {
      // time.value maps from 0 to 24.
      // 0 and 24 = Midnight (100% boost). 6 and 18 = Horizon (15% boost).
      midnightBoost = interpolate(
        time.value,
        [0, 6, 12, 18, 24],
        [1, 0.15, 0, 0.15, 1],
        Extrapolate.CLAMP
      );
    }

    // Shrinks the radius to hug the moon closely at the horizon, 
    // and explodes out into a massive 50px halo at midnight!
    const dynamicRadius = 25 + (25 * midnightBoost);

    return {
      opacity: pulse.value * midnightBoost,
      r: dynamicRadius,
    };
  });

  return (
    <Animated.View style={[styles.container, style]} pointerEvents="none">
      <Svg width="120" height="120" viewBox="0 0 100 100">
        <Defs>
          {/* Kept your exact beautiful Ghibli blue/cyan gradient */}
          <RadialGradient id="moonGlow" cx="50" cy="50" r="50" fx="50" fy="50">
            <Stop offset="20%" stopColor="#ffffff" stopOpacity="0.8" />
            <Stop offset="50%" stopColor="#bfdbfe" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Pulsating & Expanding Atmospheric Glow */}
        <AnimatedCircle cx="50" cy="50" fill="url(#moonGlow)" animatedProps={glowProps} />

        <G rotation="-18" origin="50, 50">

          {/* Dynamic Illuminated Phase */}
          <Path d={moonPath} fill="#F8FAFC" />

          {/* Craters mapped to the tilt */}
          <Circle cx="45" cy="40" r="4.5" fill="#CBD5E1" opacity="0.3" />
          <Circle cx="60" cy="55" r="7" fill="#CBD5E1" opacity="0.15" />
          <Circle cx="38" cy="58" r="3" fill="#CBD5E1" opacity="0.2" />

        </G>
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Moon;