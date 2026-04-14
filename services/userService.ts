import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';

const LAST_SYNCED_DATA_KEY = 'last-synced-user-data';

export interface UserSyncData {
    lng?: string;
    themeMode?: string;
    country?: string;
    fcmToken?: string;
    events: boolean;
}

/**
 * Gets a unique identifier for the device.
 * Using installationId or a fallback.
 */
const getDeviceId = (): string => {
    // Constants.installationId is deprecated/null in newer Expo versions.
    // We combine model and name if installationId is missing, 
    // or you can use expo-application's getIosIdForVendorAsync/getAndroidId in a real app.
    return Constants.installationId || `${Device.modelName}-${Device.osInternalBuildId}` || 'unknown-device';
};

/**
 * Synchronizes device data with the backend.
 * Uses local caching to avoid redundant API calls.
 */
export const syncUser = async (data: UserSyncData) => {
    try {
        const deviceId = getDeviceId();
        const platform = Device.osName?.toLowerCase() as 'android' | 'ios' | 'web' || 'android';
        
        const payload = {
            deviceId,
            fcmToken: data.fcmToken || 'placeholder_token', // Placeholder if not provided
            platform,
            language: data.lng || 'en',
        };

        // Check if data has changed since last successful sync
        const lastSyncedStr = await AsyncStorage.getItem(LAST_SYNCED_DATA_KEY);
        if (lastSyncedStr === JSON.stringify(payload)) {
            return;
        }

        const result = await apiRequest('/devices/register', {
            method: 'POST',
            body: payload,
        });

        if (result.status === 'success') {
            // Cache successful sync
            await AsyncStorage.setItem(LAST_SYNCED_DATA_KEY, JSON.stringify(payload));
            console.log('[UserService] Device synchronized with backend');
        }
    } catch (error) {
        console.error('[UserService] Failed to sync device:', error);
    }
};
