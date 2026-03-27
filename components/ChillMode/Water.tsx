import React, { useMemo, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  SharedValue,
  useSharedValue,
  createAnimatedComponent,
} from 'react-native-reanimated';

const AnimatedPath = createAnimatedComponent(Path);
const AnimatedRect = createAnimatedComponent(Rect);

interface WaterProps {
  time: SharedValue<number>;          // The master cloud/wind time value
  deepColorDV: SharedValue<string>;   // Natively animated deep color
  shallowColorDV: SharedValue<string>;// Natively animated shallow color
  horizonY: number;                   // Normalized 0-1
}

const Water: React.FC<WaterProps> = ({ time, deepColorDV, shallowColorDV, horizonY }) => {
  const { width, height } = useWindowDimensions();
  const startY = height * horizonY;

  // ── 1. FLAWLESS MATHEMATICAL WAVES ───────────────────────────────────────
  // We use a high point density (5px) for a perfectly smooth anime curve.
  // The frequency MUST be an integer so it loops perfectly at exactly 1x screen width.
  const createWave = (amplitude: number, frequency: number, phase: number) => {
    let path = `M 0 ${startY}`;
    for (let x = 0; x <= width * 2; x += 5) {
      const y = startY + Math.sin((x / width) * Math.PI * 2 * frequency + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${width * 2} ${height} L 0 ${height} Z`;
    return path;
  };

  // Generate 3 layers of varying height and speed for parallax depth
  const wave1Path = useMemo(() => createWave(4, 2, 0), [width, height, startY]);
  const wave2Path = useMemo(() => createWave(7, 3, Math.PI), [width, height, startY]);
  const wave3Path = useMemo(() => createWave(10, 4, Math.PI / 2), [width, height, startY]);

  // ── 2. SEAMLESS LOOPING ANIMATIONS ───────────────────────────────────────
  const wave1Props = useAnimatedProps(() => ({
    transform: [{ translateX: -(time.value * 25) % width }],
  }));

  const wave2Props = useAnimatedProps(() => ({
    transform: [{ translateX: -(time.value * 45) % width }],
  }));

  const wave3Props = useAnimatedProps(() => ({
    transform: [{ translateX: -(time.value * 70) % width }],
  }));

  // ── 3. NATIVE COLOR INJECTION ───────────────────────────────────────────
  const waterColorProps = useAnimatedProps(() => ({
    fill: shallowColorDV ? shallowColorDV.value : '#75bec3',
  }));

  // ── 4. STYLIZED ANIME GLIMMERS ──────────────────────────────────────────
  const glimmerAnim = useSharedValue(0);
  useEffect(() => {
    glimmerAnim.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [glimmerAnim]);

  const glimmers = useMemo(() => [
    { x: width * 0.15, y: startY + 12, w: 35, phase: 0.0 },
    { x: width * 0.45, y: startY + 25, w: 55, phase: 0.3 },
    { x: width * 0.75, y: startY + 8, w: 25, phase: 0.6 },
    { x: width * 0.30, y: startY + 40, w: 45, phase: 0.8 },
    { x: width * 0.60, y: startY + 18, w: 30, phase: 0.4 },
    { x: width * 0.85, y: startY + 35, w: 40, phase: 0.9 },
  ], [width, startY]);

  return (
    <Svg style={{ position: 'absolute', top: 0, left: 0, width, height }} width={width} height={height}>
      <Defs>
        {/* Performance Hack: A static transparent-to-black overlay creates depth 
            without needing to animate <Stop> colors on the UI thread */}
        <LinearGradient id="depthShadow" x1="0" y1={startY} x2="0" y2={height} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#000" stopOpacity="0" />
          <Stop offset="0.4" stopColor="#000" stopOpacity="0.2" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.7" />
        </LinearGradient>
      </Defs>

      {/* ── BACK WAVE (Slowest, Farthest) ── */}
      <AnimatedPath d={wave1Path} animatedProps={waterColorProps} opacity={0.5} />
      <AnimatedPath d={wave1Path} fill="url(#depthShadow)" opacity={0.5} animatedProps={wave1Props} />

      {/* ── MIDDLE WAVE ── */}
      <AnimatedPath d={wave2Path} animatedProps={waterColorProps} opacity={0.7} />
      <AnimatedPath d={wave2Path} fill="url(#depthShadow)" opacity={0.7} animatedProps={wave2Props} />

      {/* ── FRONT WAVE (Fastest, Closest) ── */}
      <AnimatedPath
        d={wave3Path}
        animatedProps={waterColorProps}
        stroke="rgba(255,255,255,0.4)" /* Ghibli Foam Crest Line */
        strokeWidth="1.5"
      />
      <AnimatedPath d={wave3Path} fill="url(#depthShadow)" animatedProps={wave3Props} />

      {/* ── REFLECTIONS / GLIMMERS ── */}
      {glimmers.map((g, i) => (
        <GlimmerRect key={i} x={g.x} y={g.y} w={g.w} phase={g.phase} anim={glimmerAnim} />
      ))}
    </Svg>
  );
};

// ── SUB-COMPONENT: GHIBLI HIGHLIGHTS ───────────────────────────────────────
interface GlimmerRectProps {
  x: number; y: number; w: number; phase: number; anim: SharedValue<number>;
}

const GlimmerRect = ({ x, y, w, phase, anim }: GlimmerRectProps) => {
  const animatedProps = useAnimatedProps(() => {
    // Math.sin creates a smooth breathing effect
    const raw = Math.sin((anim.value + phase) * Math.PI);
    return {
      opacity: 0.15 + Math.abs(raw) * 0.45,
      // The light gently sways horizontally with the water current
      transform: [{ translateX: raw * 12 }]
    };
  });

  return (
    <AnimatedRect
      x={x} y={y} width={w} height={5}
      rx={1.5} ry={1.5} // Heavily rounded ends to look like a paintbrush stroke
      fill="#ffffff"
      animatedProps={animatedProps}
    />
  );
};

export default Water;