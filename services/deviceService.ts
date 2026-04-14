import { apiRequest } from './api';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export interface DeviceData {
    deviceId: string;
    fcmToken: string;
    platform: string;
    language: string;
}

/**
 * Registers the current device with the backend for push notifications and tracking.
 * @param data Optional overrides for device data
 */
export const registerDevice = async (data: Partial<DeviceData> = {}) => {
    // Collect device information
    const deviceId = data.deviceId || Constants.installationId || `${Device.modelName}-${Device.osInternalBuildId}` || 'unknown-device';
    const platform = data.platform || Device.osName?.toLowerCase() || 'android';
    const language = data.language || 'en';
    const fcmToken = data.fcmToken || 'placeholder_token';

    const payload = {
        deviceId,
        fcmToken,
        platform,
        language,
    };

    console.log('[DeviceService] Registering device:', payload.deviceId);

    return await apiRequest('/devices/register', {
        method: 'POST',
        body: payload,
    });
};
