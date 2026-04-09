import { useTheme } from '@/hooks/useTheme';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';

// ── Single shimmer bone ──────────────────────────────────────────────
interface SkeletonBoneProps {
    width: number | `${number}%`;
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
}

const SkeletonBone = ({ width, height, borderRadius = 12, style }: SkeletonBoneProps) => {
    const { colors } = useTheme();
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1200, easing: Easing.ease }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
    }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: colors.border,
                },
                animatedStyle,
                style,
            ]}
        />
    );
};

// ── Category card skeleton (Home screen) ─────────────────────────────
export const CategoryCardSkeleton = () => {
    const { colors } = useTheme();

    return (
        <View style={[styles.categoryCard, { backgroundColor: colors.card }]}>
            <SkeletonBone width="100%" height={220} borderRadius={24} />
        </View>
    );
};

export const CategoryGridSkeleton = () => (
    <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <CategoryCardSkeleton key={i} />
        ))}
    </View>
);

// ── Wallpaper card skeleton (Preview screen) ─────────────────────────
export const WallpaperCardSkeleton = () => {
    const { colors } = useTheme();

    return (
        <View style={[styles.wallpaperCard, { backgroundColor: colors.card }]}>
            <SkeletonBone width="100%" height={260} borderRadius={16} />
        </View>
    );
};

export const WallpaperGridSkeleton = () => (
    <View style={styles.wallpaperGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <WallpaperCardSkeleton key={i} />
        ))}
    </View>
);

// ── Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    grid: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: '48%',
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 16,
    },
    wallpaperGrid: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    wallpaperCard: {
        flex: 1,
        minWidth: '46%',
        maxWidth: '50%',
        height: 260,
        borderRadius: 16,
        margin: 6,
        overflow: 'hidden',
    },
});

export default SkeletonBone;
