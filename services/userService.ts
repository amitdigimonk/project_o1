export interface UserSyncData {
    lng?: string;
    themeMode?: string;
    country?: string;
    fcmToken?: string;
    events: boolean;
}

export const syncUser = async (_data: UserSyncData) => {
    // no-op in mock mode
};
