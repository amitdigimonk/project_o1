import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MountainRangeProps {
  color: any;
  tint?: any;
  isWinter?: boolean;
  style?: any;
}

const AnimatedPath = Animated.createAnimatedComponent(Path) as any;

const MountainRange: React.FC<MountainRangeProps> = ({ color, tint, isWinter, style }) => {
  const { width } = useWindowDimensions();
  
  // Fabric-safe: Animate fill directly on the Path host component
  const mtnProps = useAnimatedProps(() => ({
    fill: typeof color === 'string' ? color : color?.value || '#1B2735'
  }));

  const tintProps = useAnimatedProps(() => ({
    stroke: typeof tint === 'string' ? tint : tint?.value || '#ffffff'
  }));

  // Realistic Mt. Fuji Paths
  const paths = {
    main: "M10,100 L95,22 C98,18 102,18 105,22 L190,100 H10 Z",
    snow: "M85,32 L95,22 C98,18 102,18 105,22 L115,32 C105,38 95,35 85,32 Z",
    ridge: "M102,18 C105,22 108,35 110,50 C112,65 115,85 118,100 H190 L105,22 C102,18 102,18 102,18 Z",
  };

  return (
    <View style={[styles.container, style]}>
      <Svg width={width * 1.5} height={160} viewBox="0 0 200 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <Stop offset="1" stopColor="#cbd9e6" stopOpacity="0.8" />
          </LinearGradient>
          <LinearGradient id="ridgeGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000" stopOpacity="0.15" />
            <Stop offset="1" stopColor="#000" stopOpacity="0.3" />
          </LinearGradient>
        </Defs>

        {/* Mountain Body - Fabric safe direct fill animation */}
        <AnimatedPath d={paths.main} animatedProps={mtnProps} />
        
        {/* Shadow Side (Ridge) */}
        <Path d={paths.ridge} fill="url(#ridgeGrad)" />

        {/* Snow Cap */}
        <Path d={paths.snow} fill="url(#snowGrad)" />

        {/* Subtle ridge detail lines */}
        <AnimatedPath 
          d="M100,20 L105,40 M92,35 L96,45" 
          animatedProps={tintProps}
          strokeWidth="0.5" 
          opacity={0.15} 
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    pointerEvents: 'none',
  },
});

export default MountainRange;

