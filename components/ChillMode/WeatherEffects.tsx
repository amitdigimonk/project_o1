import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  createAnimatedComponent,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

interface WeatherEffectsProps {
  type: 'rain' | 'snow' | 'thunder' | 'storm' | 'none'; // 'storm' is just thunder + rain
  windSpeed?: number;
}

const AnimatedPath = createAnimatedComponent(Path);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function WeatherEffects({ type, windSpeed = 0.5 }: WeatherEffectsProps) {
  const { width, height } = useWindowDimensions();

  // Shared Values for UI Thread
  const rainAnim = useSharedValue(0);
  const snowAnim = useSharedValue(0);
  const thunderFlash = useSharedValue(0);
  const lightningPath = useSharedValue('');

  const isRaining = type === 'rain' || type === 'thunder' || type === 'storm';
  const isSnowing = type === 'snow';
  const hasLightning = type === 'thunder' || type === 'storm';

  // ── 1. ANIMATION LOOPS ────────────────────────────────────────────────────
  useEffect(() => {
    if (isRaining) {
      // Slower rain loop
      rainAnim.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), -1, false);
    } else {
      rainAnim.value = 0;
    }

    if (isSnowing) {
      snowAnim.value = withRepeat(withTiming(1, { duration: 7000, easing: Easing.linear }), -1, false);
    } else {
      snowAnim.value = 0;
    }
  }, [type, rainAnim, snowAnim]);

  // ── 2. LIGHTNING GENERATOR ────────────────────────────────────────────────
  const generateLightning = () => {
    let d = `M${Math.random() * width},0`;
    let curX = Math.random() * width;
    let curY = 0;
    for (let i = 0; i < 10; i++) {
      // More aggressive horizontal branching for anime-style strikes
      curX += (Math.random() - 0.5) * 120;
      curY += height / 10 + (Math.random() * 20);
      d += ` L${curX},${curY}`;
    }
    return d;
  };

  useEffect(() => {
    if (!hasLightning) {
      thunderFlash.value = 0;
      lightningPath.value = '';
      return;
    }

    const interval = setInterval(() => {
      lightningPath.value = generateLightning();
      // Rapid multi-flash sequence
      thunderFlash.value = withSequence(
        withTiming(1, { duration: 40 }),
        withTiming(0, { duration: 100 }),
        withTiming(0.6, { duration: 40 }),
        withTiming(0, { duration: 300 })
      );
    }, 4000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, [type, width, height]);

  // ── 3. HIGH-PERFORMANCE PATH GENERATORS ───────────────────────────────────
  // We generate ONE massive string of coordinates for each layer. 
  // This reduces SVG nodes from ~200 down to exactly 4.

  const createRainPath = (count: number, length: number, slant: number = -15) => {
    let d = '';
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (width * 1.5); // Wider area to account for wind angle
      const y = Math.random() * (height * 2);  // 2x height for seamless vertical looping
      d += `M${x},${y} l${slant},${length} `;
    }
    return d;
  };

  const createSnowPath = (count: number) => {
    let d = '';
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (height * 2);
      // Hack: Drawing a line 0.1px long with round linecaps creates a perfect circle instantly!
      d += `M${x},${y} l0,0.1 `;
    }
    return d;
  };

  const rainPaths = useMemo(() => ({
    deep: createRainPath(150, 20, -10),
    mid: createRainPath(80, 45, -15),
    near: createRainPath(40, 80, -25),
  }), [width, height]);

  const snowPaths = useMemo(() => ({
    back: createSnowPath(70),
    front: createSnowPath(40),
  }), [width, height]);


  // ── 4. ANIMATED PROPS & STYLES ────────────────────────────────────────────
  const rainDeepProps = useAnimatedProps(() => ({ transform: [{ translateY: -height + (rainAnim.value * 1.2 * height) % height }] }));
  const rainMidProps = useAnimatedProps(() => ({ transform: [{ translateY: -height + (rainAnim.value * 1.8 * height) % height }] }));
  const rainNearProps = useAnimatedProps(() => ({ transform: [{ translateY: -height + (rainAnim.value * 2.5 * height) % height }] }));

  const snowBackProps = useAnimatedProps(() => {
    const translateY = -height + (snowAnim.value * height * 0.5) % height;
    const translateX = Math.sin(snowAnim.value * Math.PI * 6) * 10; // Sway
    return { transform: [{ translateY }, { translateX }] };
  });

  const snowFrontProps = useAnimatedProps(() => {
    const translateY = -height + (snowAnim.value * height) % height;
    const translateX = Math.sin(snowAnim.value * Math.PI * 4) * 20; // Wider sway
    return { transform: [{ translateY }, { translateX }] };
  });

  const lightningGlowProps = useAnimatedProps(() => ({
    d: lightningPath.value,
    opacity: thunderFlash.value * 0.8,
  }));

  const lightningCoreProps = useAnimatedProps(() => ({
    d: lightningPath.value,
    opacity: thunderFlash.value,
  }));

  const thunderBgStyle = useAnimatedStyle(() => ({
    opacity: thunderFlash.value * 0.3,
    backgroundColor: '#cbd5e1' // Cool grey/blue flash tint instead of pure white
  }));

  if (type === 'none') return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">

      {/* Global Sky Flash */}
      <AnimatedView style={[StyleSheet.absoluteFill, thunderBgStyle]} />

      <Svg style={StyleSheet.absoluteFill}>

        {/* ── LIGHTNING ── */}
        {hasLightning && (
          <>
            {/* Soft Violet/Blue Glow */}
            <AnimatedPath stroke="#a78bfa" strokeWidth="20" strokeLinejoin="round" animatedProps={lightningGlowProps} />
            {/* Bright White Core */}
            <AnimatedPath stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" animatedProps={lightningCoreProps} />
          </>
        )}

        {/* ── RAIN ── */}
        {isRaining && (
          <>
            {/* Deep Layer (Small, Slow, Dim) */}
            <AnimatedPath d={rainPaths.deep} stroke="rgba(186, 212, 255, 0.2)" strokeWidth="1" strokeLinecap="round" animatedProps={rainDeepProps} />
            {/* Middle Layer (Medium) */}
            <AnimatedPath d={rainPaths.mid} stroke="rgba(219, 234, 254, 0.4)" strokeWidth="1.8" strokeLinecap="round" animatedProps={rainMidProps} />
            {/* Near Layer (Large, Fast, Bright) */}
            <AnimatedPath d={rainPaths.near} stroke="rgba(255, 255, 255, 0.6)" strokeWidth="3" strokeLinecap="round" animatedProps={rainNearProps} />
          </>
        )}

        {/* ── SNOW ── */}
        {isSnowing && (
          <>
            {/* Back Layer (Small, Slow) */}
            <AnimatedPath d={snowPaths.back} stroke="rgba(255, 255, 255, 0.4)" strokeWidth="3" strokeLinecap="round" animatedProps={snowBackProps} />
            {/* Front Layer (Large, Fast) */}
            <AnimatedPath d={snowPaths.front} stroke="rgba(255, 255, 255, 0.8)" strokeWidth="6" strokeLinecap="round" animatedProps={snowFrontProps} />
          </>
        )}

      </Svg>
    </View>
  );
}