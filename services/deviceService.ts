export interface DeviceData {
    deviceId: string;
    fcmToken: string;
    platform: string;
    language: string;
}

export const registerDevice = async (_data: Partial<DeviceData> = {}) => {
    return { status: 'success', success: true, data: null };
};
