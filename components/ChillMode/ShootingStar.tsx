import React, { useEffect, useState, useCallback } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import Svg, { Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line) as any;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient) as any;

interface ShootingStarProps {
  isNight: boolean;
}

export default function ShootingStar({ isNight }: ShootingStarProps) {
  const { width, height } = useWindowDimensions();
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const opacity = useSharedValue(0);
  const offset = useSharedValue(0);

  const triggerStar = useCallback(() => {
    if (!isNight) return;

    // Random start position in upper half
    const startX = Math.random() * width;
    const startY = Math.random() * (height * 0.4);
    
    // Diagonal movement (top-left to bottom-right or top-right to bottom-left)
    const angle = (Math.random() * 45 + 20) * (Math.PI / 180); 
    const isLeftToRight = Math.random() > 0.5;
    const length = 400 + Math.random() * 300; // Increased distance
    
    const dx = Math.cos(angle) * length * (isLeftToRight ? 1 : -1);
    const dy = Math.sin(angle) * length;

    setCoords({
      x1: startX,
      y1: startY,
      x2: startX + dx,
      y2: startY + dy,
    });

    // Reset offset and animate
    offset.value = 0;
    opacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(1, { duration: 600 }), // Slightly longer visible duration
      withTiming(0, { duration: 300 })
    );
    
    offset.value = withTiming(1, { 
      duration: 1000, 
      easing: Easing.out(Easing.quad) 
    });

    // Schedule next star: 20-60 seconds
    const nextDelay = 20000 + Math.random() * 40000;
    setTimeout(triggerStar, nextDelay);
  }, [isNight, width, height]);

  useEffect(() => {
    if (isNight) {
      const timer = setTimeout(triggerStar, 10000 + Math.random() * 10000);
      return () => clearTimeout(timer);
    }
  }, [isNight, triggerStar]);

  const tailLength = 0.5; // Tail is now 50% of the path

  const animatedProps = useAnimatedProps(() => {
    const currentX1 = coords.x1 + (coords.x2 - coords.x1) * (offset.value * (1 - tailLength));
    const currentY1 = coords.y1 + (coords.y2 - coords.y1) * (offset.value * (1 - tailLength));
    const currentX2 = coords.x1 + (coords.x2 - coords.x1) * (offset.value * (1 - tailLength) + tailLength);
    const currentY2 = coords.y1 + (coords.y2 - coords.y1) * (offset.value * (1 - tailLength) + tailLength);

    return {
      opacity: opacity.value,
      x1: currentX1,
      y1: currentY1,
      x2: currentX2,
      y2: currentY2,
    };
  });

  const gradientProps = useAnimatedProps(() => {
    // Determine gradient direction based on movement
    const isLeftToRight = coords.x2 > coords.x1;
    
    // Gradient should follow the line
    const x1 = coords.x1 + (coords.x2 - coords.x1) * (offset.value * (1 - tailLength));
    const y1 = coords.y1 + (coords.y2 - coords.y1) * (offset.value * (1 - tailLength));
    const x2 = coords.x1 + (coords.x2 - coords.x1) * (offset.value * (1 - tailLength) + tailLength);
    const y2 = coords.y1 + (coords.y2 - coords.y1) * (offset.value * (1 - tailLength) + tailLength);

    return { x1, y1, x2, y2 };
  });

  if (!isNight) return null;

  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <AnimatedLinearGradient
          id="starTail"
          gradientUnits="userSpaceOnUse"
          animatedProps={gradientProps}
        >
          {/* Faint tail at x1,y1 and bright head at x2,y2 */}
          <Stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <Stop offset="0.7" stopColor="#ffffff" stopOpacity="0.5" />
          <Stop offset="1" stopColor="#ffffff" stopOpacity="1" />
        </AnimatedLinearGradient>
      </Defs>
      <AnimatedLine
        stroke="url(#starTail)"
        strokeWidth="2.5"
        strokeLinecap="round"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
