import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

interface CloudProps {
    width?: number;
    height?: number;
    style?: ViewStyle;
    color?: string;
    opacity?: number;
    animValue?: SharedValue<number>;
    screenOffset?: number;
    screenWidth?: number;
    windDirection?: 'left' | 'right';
}

const Cloud = memo(({
    width = 120,
    height = 68,
    style,
    color = "#f8fafc", // Slightly off-white base
    opacity = 1,
    animValue,
    screenOffset = 0,
    screenWidth = 800,
    windDirection = 'right'
}: CloudProps) => {

    // ── 1. NATIVE GPU TRANSLATION ───────────────────────────────────────────
    const animatedStyle = useAnimatedStyle(() => {
        if (!animValue) return { transform: [{ translateX: 0 }] };

        // The cycle must match the parent's loop (4)
        const cycle = 4;

        // Calculate normalized progress (0 to 1) for this specific cloud
        const progress = (animValue.value + screenOffset) % cycle;
        const normalized = progress / cycle;

        // Add extra padding so the cloud fully clears the screen before looping
        const travelDistance = screenWidth + width * 2;

        let x = 0;
        if (windDirection === 'right') {
            x = -width + (normalized * travelDistance);
        } else {
            x = screenWidth - (normalized * travelDistance);
        }

        // ── RANDOMNESS HACK ──
        // Use the random screenOffset to flip some clouds horizontally!
        // This gives us 2x the visual variety using only 1 SVG path.
        const isFlipped = screenOffset % 2 > 1 ? -1 : 1;

        return {
            position: 'absolute',
            opacity: opacity,
            transform: [
                { translateX: x },
                { scaleX: isFlipped }
            ],
        };
    });

    // Your beautifully shaped cumulus cloud path
    const cloudPath = "M150,70c0-16.5-13.5-30-30-30c-2.2,0-4.3,0.3-6.4,0.8C106.8,24.8,91.9,15,75,15c-19.1,0-35,12.5-40,30c-13.8,0-25,11.2-25,25s11.2,25,25,25h90C138.8,95,150,83.8,150,70z";

    return (
        <Animated.View style={[style, { width, height }, animatedStyle]} pointerEvents="none">
            <Svg width="100%" height="100%" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid meet">

                {/* ── LAYER 1: BOTTOM SHADOW (Creates depth/volume) ── */}
                <G y="6">
                    <Path d={cloudPath} fill="#000000" opacity={0.08} />
                </G>

                {/* ── LAYER 2: BASE CLOUD BODY ── */}
                <Path d={cloudPath} fill={color} opacity={0.9} />

                {/* ── LAYER 3: SUNLIT HIGHLIGHT EDGE ── */}
                {/* Shifting it up and scaling it down creates a beautiful rim-light effect */}
                <G x="-4" y="-4" scale="0.96">
                    <Path d={cloudPath} fill="#ffffff" opacity={0.8} />
                </G>

            </Svg>
        </Animated.View>
    );
});

export default Cloud;