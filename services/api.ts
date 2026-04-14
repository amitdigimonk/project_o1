import Constants from 'expo-constants';

interface RequestConfig extends RequestInit {
    body?: any;
}

export const BASE_URL = 'https://invotax.b2cinfohosting.in/api/admin';
export const ROOT_URL = 'https://invotax.b2cinfohosting.in/api/admin';

export const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${ROOT_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export interface ApiResponse<T = any> {
    status: string;
    success: boolean;
    data: T;
    message?: string;
    results?: number;
}

export const apiRequest = async <T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            ...config,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
            body: config.body ? JSON.stringify(config.body) : undefined,
        });

        const result = await response.json();
        return {
            ...result,
            success: result.status === 'success' || result.success === true
        };
    } catch (error: any) {
        console.error(`API Request Error [${endpoint}]:`, error);
        return {
            status: 'error',
            success: false,
            data: null as unknown as T,
            message: error.message || 'Network error'
        };
    }
};
