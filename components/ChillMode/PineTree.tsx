import React, { memo } from 'react';
import Animated, { useAnimatedStyle, useAnimatedProps, SharedValue } from 'react-native-reanimated';
import Svg, { Path, Ellipse } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface PineTreeProps {
  width?: number;
  height?: number;
  style?: any;
  colorDV: SharedValue<string>;   // Dynamic seasonal color from UI thread
  windAnim?: SharedValue<number>; // -1..1, 0 = calm
  windPhase?: number;             // 0..1, per-tree phase offset
  windStrength?: number;          // multiplier for sway
}

const PineTree = memo(({
  width = 38,
  height = 70,
  style,
  colorDV,
  windAnim,
  windPhase = 0,
  windStrength = 1,
}: PineTreeProps) => {

  // ── 1. NATIVE WIND SWAY ────────────────────────────────────────────────────
  const swayStyle = useAnimatedStyle(() => {
    if (!windAnim) return {};

    // Add per-tree phase by sine-shifting: each tree is offset in the wind cycle
    const phased = windAnim.value * Math.cos(windPhase * Math.PI * 2);
    const deg = phased * windStrength * 6; // max ±6° for foreground trees

    // Shift origin to base: translate tree tip by a small amount opposite to lean
    const tx = phased * windStrength * (width * 0.05);

    return {
      transform: [
        { translateY: height * 0.5 },           // move pivot to virtual base
        { rotateZ: `${deg}deg` },
        { translateY: -height * 0.5 },          // restore
        { translateX: tx },
      ],
    };
  });

  // ── 2. UI THREAD COLOR INJECTION ───────────────────────────────────────────
  const baseColorProps = useAnimatedProps(() => {
    return {
      fill: colorDV ? colorDV.value : '#2d5a27',
    };
  });

  // ── 3. USER'S EXACT LAYERED PATHS ──────────────────────────────────────────
  const pathBot = "M27.82,52.35l-15.39,-0.14c-1.8,3.95 -7.28,10.91 -10.7,16.43 1.92,-1.18 11.93,-1.98 14.9,-7.2l-1.6,7.42c2.56,2 5.94,1.77 7.14,0.76 -0.37,-5.85 -1,-7.85 -1,-7.85 1.58,1.36 10.9,4.89 16.29,6.77 -1.15,-1.72 -7.92,-12.9 -9.64,-16.18Z";
  const pathMid = "M11.03,51.5c-1.09,0.72 -9.26,6.33 -11.03,6.99 0.41,-1.39 9.12,-16.96 11.09,-19.56l15.81,-0.53c3.3,8.34 11.05,17.89 11.18,18.3 -0.38,-0.07 -7.56,-3.2 -10.26,-3.76 0,0 2.21,7.28 0.79,8.18 -1.13,0.72 -8.06,-5.83 -11.25,-7.65 -0.69,-0.39 -13.77,8.92 -13.25,7.5 1.58,-4.29 6.91,-9.47 6.91,-9.47Z";
  const pathTop = "M26.89,38.39c2.3,1.44 4.36,2.87 6.67,3.97 -0.23,-1.39 -5.48,-10.85 -9.46,-19.1H15.05C9.96,32.78 1.66,44.45 1.57,44.86c0.46,1.74 5.76,-3.25 9.37,-5.64 0,0 1.54,13.16 3.43,11.61 7.14,-5.88 12.53,-12.43 12.53,-12.43Z";
  const pathPeak = "M24.45,24.59c1.51,0.97 6.99,8.21 5,-0.73 -1.82,-6.57 -3.74,-11.32 -8.55,-23.86 -0.28,1.18 -1.85,6.16 -5.33,13.91 -10.12,20.33 -3.31,11.98 0.74,9.51 3.55,11.13 2.78,15.26 8.15,1.17Z";

  return (
    <Animated.View style={[style, swayStyle]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 38.08 70.37">

        {/* Ground Drop Shadow */}
        <Ellipse cx="19" cy="66" rx="15" ry="3.5" fill="#000" opacity={0.3} />

        {/* ── BOTTOM LAYER (Deepest Shadow) ── */}
        <AnimatedPath d={pathBot} animatedProps={baseColorProps} />
        <Path d={pathBot} fill="#000000" opacity={0.4} />

        {/* ── MIDDLE LAYER (Medium Shadow) ── */}
        <AnimatedPath d={pathMid} animatedProps={baseColorProps} />
        <Path d={pathMid} fill="#000000" opacity={0.2} />

        {/* ── TOP LAYER (Soft Highlight) ── */}
        <AnimatedPath d={pathTop} animatedProps={baseColorProps} />
        <Path d={pathTop} fill="#ffffff" opacity={0.1} />

        {/* ── PEAK LAYER (Bright Sunlit Highlight) ── */}
        <AnimatedPath d={pathPeak} animatedProps={baseColorProps} />
        <Path d={pathPeak} fill="#ffffff" opacity={0.25} />

      </Svg>
    </Animated.View>
  );
});

export default PineTree;