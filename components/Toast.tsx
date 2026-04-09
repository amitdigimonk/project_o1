import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    FadeInUp,
    FadeOutUp,
    Layout,
} from 'react-native-reanimated';
import CustomText from './CustomText';

type ToastType = 'success' | 'error' | 'info';

interface ToastData {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
    success: 'checkmark-circle',
    error: 'alert-circle',
    info: 'information-circle',
};

const COLORS: Record<ToastType, string> = {
    success: '#22C55E',
    error: '#EF4444',
    info: '#8B5CF6',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { colors } = useTheme();
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const idRef = useRef(0);

    const showToast = useCallback((message: string, type: ToastType = 'success', durationMs = 2500) => {
        const id = ++idRef.current;
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, durationMs);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View style={styles.container} pointerEvents="none">
                {toasts.map((toast) => (
                    <Animated.View
                        key={toast.id}
                        entering={FadeInUp.springify().damping(18).stiffness(140)}
                        exiting={FadeOutUp.duration(200)}
                        layout={Layout.springify()}
                        style={[
                            styles.toast,
                            { backgroundColor: colors.card, borderLeftColor: COLORS[toast.type] },
                        ]}
                    >
                        <Ionicons name={ICONS[toast.type]} size={20} color={COLORS[toast.type]} />
                        <CustomText variant="body" style={styles.text} numberOfLines={2}>
                            {toast.message}
                        </CustomText>
                    </Animated.View>
                ))}
            </View>
        </ToastContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 9999,
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        marginBottom: 8,
        width: '100%',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    text: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '500',
    },
});
