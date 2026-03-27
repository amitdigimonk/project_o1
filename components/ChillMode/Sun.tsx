import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  interpolate,
  Extrapolate,
  SharedValue,
  createAnimatedComponent,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Circle, G } from 'react-native-svg';

const AnimatedG = createAnimatedComponent(G);

interface SunProps {
  style?: any;
  time: SharedValue<number>;
  sunrise: number;
  sunset: number;
}

const Sun: React.FC<SunProps> = ({ style, time, sunrise, sunset }) => {

  // ── COLOR CROSSFADE LOGIC (UI Thread) ──────────────────────────────────────
  const sunsetProps = useAnimatedProps(() => {
    // Fades the warm sunset glow in at the horizons
    const opacity = interpolate(
      time.value,
      [sunrise - 1.5, sunrise, sunrise + 1.5, sunset - 1.5, sunset, sunset + 1.5],
      [0, 1, 0, 0, 1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const noonProps = useAnimatedProps(() => {
    // Fades the crisp yellow noon glow in during the day
    const opacity = interpolate(
      time.value,
      [sunrise, sunrise + 1.5, sunset - 1.5, sunset],
      [0, 1, 1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <Animated.View style={[styles.container, style]} pointerEvents="none">
      <Svg height="120" width="120" viewBox="0 0 120 120">
        <Defs>

          <RadialGradient id="sunsetGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <Stop offset="30%" stopColor="#ffedd5" stopOpacity="0.8" />
            <Stop offset="60%" stopColor="#fdba74" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#fdba74" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="noonGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <Stop offset="40%" stopColor="#fef08a" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <AnimatedG animatedProps={sunsetProps}>
          <Circle cx="60" cy="60" r="45" fill="url(#sunsetGlow)" />
        </AnimatedG>

        <AnimatedG animatedProps={noonProps}>
          <Circle cx="60" cy="60" r="35" fill="url(#noonGlow)" />
        </AnimatedG>

        <Circle cx="60" cy="60" r="16" fill="#FFFFFF" opacity="0.4" />
        <Circle cx="60" cy="60" r="12" fill="#FFFFFF" />

      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Sun;