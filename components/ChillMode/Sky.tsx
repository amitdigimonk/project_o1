import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  G,
} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
  runOnJS,
  SharedValue,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { useState } from 'react';

const AnimatedStop = Animated.createAnimatedComponent(Stop);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// ─── color keyframes for each gradient stop ───────────────────────────────────
//  hours:  0       5         6         7         10        12        17        18        19        24
//  night → pre-dawn → sunrise → golden → day → noon → afternoon → sunset → dusk → night

const TIMES = [0, 5, 5.5, 6.5, 8, 12, 16, 17.5, 18.5, 19, 24];

// ── Colors sourced directly from original app's colors.xml ──────────────────
// nightTop=#17193a  nightMid=#303668  nightBot=#38477a
// sunriseTop=#75bec3  sunriseMid=#ffbbd5  sunriseBot=#ffd6b9
// noonTop=#6fa6fa    noonMid=#b1d1f4    noonBot=#e6e6e6
// sunsetTop=#75bec3  sunsetMid=#ffe3ae  sunsetBot=#ffc5ab

// Zenith (top 0%)
const ZENITH_COLORS = [
  '#17193a', '#17193a', '#2a3a5c', '#75bec3', '#5a97d8', '#6fa6fa', '#5a97d8', '#75bec3', '#2a3a5c', '#17193a', '#17193a',
];

// Mid-sky (38%)
const MID_COLORS = [
  '#303668', '#303668', '#4a5a8a', '#ffbbd5', '#90b8e8', '#b1d1f4', '#90b8e8', '#ffe3ae', '#4a5a8a', '#303668', '#303668',
];

// Horizon (75%)
const HORIZON_COLORS = [
  '#38477a', '#38477a', '#6a5a8a', '#ffd6b9', '#c8ddf4', '#e6e6e6', '#c8ddf4', '#ffc5ab', '#6a5a8a', '#38477a', '#38477a',
];

// Near-ground (95%) — keeps a hint of depth below horizon
const GROUND_COLORS = [
  '#252c56', '#252c56', '#4a3a6a', '#d4a88a', '#a8c8e8', '#d0dff0', '#a8c8e8', '#c48878', '#4a3a6a', '#252c56', '#252c56',
];

interface SkyProps {
  time: SharedValue<number>;
  weatherOverride?: string;
}

export default function Sky({ time, weatherOverride }: SkyProps) {
  const { width, height } = useWindowDimensions();

  // ── Animated stop colors ─────────────────────────────────────────────────────
  const zenithDV = useDerivedValue(() => weatherOverride === 'storm' ? '#1a1a2e'
    : weatherOverride === 'rain' ? '#2c3e50'
      : interpolateColor(time.value, TIMES, ZENITH_COLORS));

  const midDV = useDerivedValue(() => weatherOverride === 'storm' ? '#2b2b3c'
    : weatherOverride === 'rain' ? '#3d5166'
      : interpolateColor(time.value, TIMES, MID_COLORS));

  const horizonDV = useDerivedValue(() => weatherOverride === 'storm' ? '#2e2e3e'
    : weatherOverride === 'rain' ? '#5a6b7c'
      : interpolateColor(time.value, TIMES, HORIZON_COLORS));

  const groundDV = useDerivedValue(() => weatherOverride === 'storm' ? '#111120'
    : weatherOverride === 'rain' ? '#2a3540'
      : interpolateColor(time.value, TIMES, GROUND_COLORS));

  // Glow opacity: bright near sunrise/sunset, 0 midday and night
  const glowOpacityDV = useDerivedValue(() => {
    const h = time.value;
    if (h >= 5.5 && h <= 7.5) return 0.35 * (1 - Math.abs(h - 6.5) / 1);
    if (h >= 16.5 && h <= 19) return 0.4 * (1 - Math.abs(h - 17.8) / 1.2);
    return 0;
  });

  // Star opacity: only visible at night
  const starOpacityDV = useDerivedValue(() => {
    const h = time.value;
    if (h <= 5) return interpolateColor === undefined ? 0 : 0.8; // always show at night
    if (h <= 6) return 0.8 * (1 - (h - 5));
    if (h >= 19) return 0.8 * Math.min(1, (h - 19));
    if (h >= 18) return 0.8 * Math.max(0, (h - 18));
    return 0;
  });

  // Push to React state for static SVG children (stars need opacity)
  const [zenith, setZenith] = useState(() => zenithDV.value as string);
  const [mid, setMid] = useState(() => midDV.value as string);
  const [horizon, setHorizon] = useState(() => horizonDV.value as string);
  const [ground, setGround] = useState(() => groundDV.value as string);
  const [glow, setGlow] = useState(() => glowOpacityDV.value as number);
  const [starOp, setStarOp] = useState(() => starOpacityDV.value as number);

  useAnimatedReaction(() => zenithDV.value, (v) => runOnJS(setZenith)(v as string));
  useAnimatedReaction(() => midDV.value, (v) => runOnJS(setMid)(v as string));
  useAnimatedReaction(() => horizonDV.value, (v) => runOnJS(setHorizon)(v as string));
  useAnimatedReaction(() => groundDV.value, (v) => runOnJS(setGround)(v as string));
  useAnimatedReaction(() => glowOpacityDV.value, (v) => runOnJS(setGlow)(v as number));
  useAnimatedReaction(() => starOpacityDV.value, (v) => runOnJS(setStarOp)(v as number));

  // ── Static stars (random but stable, memo-ised) ───────────────────────────
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 120; i++) {
      arr.push({
        cx: Math.random() * width,
        cy: Math.random() * height * 0.55,  // top 55% of sky only
        r: 0.5 + Math.random() * 1.2,
        baseOpacity: 0.5 + Math.random() * 0.5,
        // Twinkle offset so they don't all pulse together
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [width, height]);

  return (
    <Svg style={{ position: 'absolute', top: 0, left: 0, width, height }}>
      <Defs>
        {/* Main sky gradient — vertical, 4 stops */}
        <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={zenith} stopOpacity="1" />
          <Stop offset="0.38" stopColor={mid} stopOpacity="1" />
          <Stop offset="0.75" stopColor={horizon} stopOpacity="1" />
          <Stop offset="1" stopColor={ground} stopOpacity="1" />
        </LinearGradient>

        {/* Horizon sunrise/sunset glow — radial from centre-horizon */}
        <LinearGradient id="glowGrad" x1="0.5" y1="0.85" x2="0.5" y2="0.55">
          <Stop offset="0" stopColor="#FF6E40" stopOpacity={glow.toFixed(2)} />
          <Stop offset="1" stopColor="#FF6E40" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Sky base gradient */}
      <Rect x="0" y="0" width={width} height={height} fill="url(#skyGrad)" />

      {/* Horizon glow overlay */}
      <Rect x="0" y={height * 0.4} width={width} height={height * 0.5} fill="url(#glowGrad)" />

      {/* Stars */}
      {starOp > 0.02 && (
        <G opacity={starOp}>
          {stars.map((s, i) => (
            <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#ffffff" opacity={s.baseOpacity} />
          ))}
        </G>
      )}
    </Svg>
  );
}
