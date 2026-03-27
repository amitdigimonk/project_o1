import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

interface AnimeParticlesProps {
    timeAnim: SharedValue<number>; // Hooks into your continuous cloudAnim
}

export default function AnimeParticles({ timeAnim }: AnimeParticlesProps) {
    const { width, height } = useWindowDimensions();

    // Generate the static particle positions once
    const particles = useMemo(() => {
        return Array.from({ length: 25 }).map(() => ({
            x: Math.random() * width,
            // Spread them over a taller area so the vertical loop is seamless
            y: Math.random() * (height * 1.5),
            size: Math.random() * 1.5 + 0.8,
            // Give each particle a unique horizontal sway offset
            phase: Math.random() * Math.PI * 2,
        }));
    }, [width, height]);

    const animatedProps = useAnimatedProps(() => {
        // timeAnim goes from 0 to 1 continuously.
        // We multiply it to make them float UP, looping seamlessly.
        const translateY = -((timeAnim.value * height * 2) % height);

        // Creates a gentle left-to-right breathing drift
        const translateX = Math.sin(timeAnim.value * Math.PI * 8) * 15;

        // Slowly pulses the glow of the fireflies in and out
        const opacity = 0.4 + Math.abs(Math.sin(timeAnim.value * Math.PI * 20)) * 0.6;

        return {
            transform: [{ translateY }, { translateX }],
            opacity,
        };
    });

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <Svg style={StyleSheet.absoluteFillObject}>
                <AnimatedG animatedProps={animatedProps}>
                    {particles.map((p, i) => (
                        <React.Fragment key={i}>
                            {/* Outer Glow (Warm Gold) */}
                            <Circle
                                cx={p.x + Math.sin(p.phase) * 10} // Individual horizontal offset
                                cy={p.y}
                                r={p.size * 3.5}
                                fill="#fbbf24"
                                opacity={0.25}
                            />
                            {/* Bright Core (White) */}
                            <Circle
                                cx={p.x + Math.sin(p.phase) * 10}
                                cy={p.y}
                                r={p.size}
                                fill="#ffffff"
                                opacity={0.9}
                            />
                        </React.Fragment>
                    ))}
                </AnimatedG>
            </Svg>
        </View>
    );
}