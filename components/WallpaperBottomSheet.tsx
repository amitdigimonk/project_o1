import React, { useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import CustomText from './CustomText';
import { useTheme } from '@/hooks/useTheme';
import { WallpaperLocation } from '@/services/androidWallpaperEngine';

interface WallpaperBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (location: WallpaperLocation) => void;
}

const SHEET_HEIGHT = 240;

export default function WallpaperBottomSheet({ isVisible, onClose, onSelect }: WallpaperBottomSheetProps) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const TOTAL_HEIGHT = SHEET_HEIGHT + insets.bottom;
    const translateY = useSharedValue(TOTAL_HEIGHT);

    const show = () => {
        translateY.value = withSpring(0, { 
            damping: 50, 
            stiffness: 100,
            mass: 0.5
        });
    };

    const hide = () => {
        translateY.value = withTiming(TOTAL_HEIGHT, {}, () => {
            runOnJS(onClose)();
        });
    };

    useEffect(() => {
        if (isVisible) {
            show();
        } else {
            hide();
        }
    }, [isVisible]);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY > 0) {
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY > 50 || event.velocityY > 500) {
                runOnJS(hide)();
            } else {
                translateY.value = withSpring(0, { damping: 20 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const Option = ({ 
        icon, 
        label, 
        location 
    }: { 
        icon: keyof typeof Ionicons.glyphMap; 
        label: string; 
        location: WallpaperLocation 
    }) => (
        <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.card }]}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelect(location);
                hide();
            }}
            activeOpacity={0.7}
        >
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name={icon} size={22} color={colors.primary} />
            </View>
            <CustomText variant="body" style={styles.optionLabel}>{label}</CustomText>
        </TouchableOpacity>
    );

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="none"
            onRequestClose={hide}
        >
            <Pressable style={styles.backdrop} onPress={hide}>
                <Animated.View style={[styles.backdropBackground, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
            </Pressable>

            <View style={styles.container}>
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        style={[
                            styles.sheet,
                            { 
                                backgroundColor: colors.background, 
                                height: TOTAL_HEIGHT,
                                paddingBottom: Math.max(insets.bottom, 16) 
                            },
                            animatedStyle
                        ]}
                    >
                        <View style={styles.dragHandleContainer}>
                            <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
                        </View>

                        <CustomText variant="heading" style={styles.title}>
                            {t('bottomSheet.title')}
                        </CustomText>

                        <View style={styles.optionsRow}>
                            <Option icon="home-outline" label={t('bottomSheet.home')} location="HOME" />
                            <Option icon="lock-closed-outline" label={t('bottomSheet.lock')} location="LOCK" />
                            <Option icon="phone-portrait-outline" label={t('bottomSheet.both')} location="BOTH" />
                        </View>


                    </Animated.View>
                </GestureDetector>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    backdropBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 16,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    dragHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        opacity: 0.3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    optionsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
    },
    option: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },

});
