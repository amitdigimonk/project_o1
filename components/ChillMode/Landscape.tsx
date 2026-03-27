import React, { memo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LandscapeProps {
    colorDV: SharedValue<string>;
    fogOpacity?: SharedValue<number>;
    style?: any;
}

const Landscape = memo(({ colorDV, fogOpacity, style }: LandscapeProps) => {

    // ── 1. NATIVE COLOR INJECTION ──────────────────────────────────────────
    const animatedProps = useAnimatedProps(() => ({
        fill: colorDV ? colorDV.value : '#5a7e3a',
    }));

    // ── 2. FOG OPACITY ANIMATIONS (UI Thread) ──────────────────────────────
    const deepFogStyle = useAnimatedStyle(() => ({
        // Caps at 85% so the back hill is always slightly visible like a silhouette
        opacity: fogOpacity ? fogOpacity.value * 0.85 : 0,
    }));

    const shallowFogStyle = useAnimatedStyle(() => ({
        // Lighter mist for the mid-ground
        opacity: fogOpacity ? fogOpacity.value * 0.45 : 0,
    }));

    // ── 3. CLEAN GHIBLI BEZIER CURVES ─────────────────────────────────────
    const backHill = "M0,50 Q30,15 100,60 V100 H0 Z";
    const midHill = "M-10,75 Q40,30 110,80 V100 H-10 Z";
    const frontHill = "M0,90 Q35,70 70,85 T110,95 V100 H0 Z";

    return (
        <View style={[styles.container, style]} pointerEvents="none">

            {/* ── 1. BACKGROUND HILL (Farthest, softest) ─────────────────────── */}
            <Svg width={SCREEN_WIDTH} height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.hill}>
                <Defs>
                    <LinearGradient id="shadow1" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
                        <Stop offset="1" stopColor="#000000" stopOpacity="0.1" />
                    </LinearGradient>
                </Defs>
                <AnimatedPath d={backHill} animatedProps={animatedProps} opacity={0.4} />
                <Path d={backHill} fill="url(#shadow1)" />
            </Svg>

            {/* ── 2. DEEP VALLEY FOG (Sandwiched behind mid-hill) ────────────── */}
            <Animated.View style={[StyleSheet.absoluteFill, deepFogStyle]}>
                <Svg width="100%" height="100%" preserveAspectRatio="none">
                    <Defs>
                        <LinearGradient id="deepFog" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0.3" stopColor="#e2e8f0" stopOpacity="0" />
                            <Stop offset="1" stopColor="#e2e8f0" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#deepFog)" />
                </Svg>
            </Animated.View>

            {/* ── 3. MIDDLE HILL ─────────────────────────────────────────────── */}
            <Svg width={SCREEN_WIDTH} height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={[styles.hill, { top: 10 }]}>
                <Defs>
                    <LinearGradient id="shadow2" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
                        <Stop offset="1" stopColor="#000000" stopOpacity="0.3" />
                    </LinearGradient>
                </Defs>
                <AnimatedPath d={midHill} animatedProps={animatedProps} opacity={0.7} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <Path d={midHill} fill="url(#shadow2)" />
            </Svg>

            {/* ── 4. SHALLOW VALLEY FOG (Sandwiched behind front-hill) ───────── */}
            <Animated.View style={[StyleSheet.absoluteFill, { top: 15 }, shallowFogStyle]}>
                <Svg width="100%" height="100%" preserveAspectRatio="none">
                    <Defs>
                        <LinearGradient id="shallowFog" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0.6" stopColor="#e2e8f0" stopOpacity="0" />
                            <Stop offset="1" stopColor="#e2e8f0" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#shallowFog)" />
                </Svg>
            </Animated.View>

            {/* ── 5. FOREGROUND HILL (Closest, darkest, sharpest) ────────────── */}
            <Svg width={SCREEN_WIDTH} height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={[styles.hill, { top: 20 }]}>
                <Defs>
                    <LinearGradient id="shadow3" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                        <Stop offset="1" stopColor="#000000" stopOpacity="0.6" />
                    </LinearGradient>
                </Defs>
                <AnimatedPath d={frontHill} animatedProps={animatedProps} opacity={1} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <Path d={frontHill} fill="url(#shadow3)" />
            </Svg>

        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    hill: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});

export default Landscape;