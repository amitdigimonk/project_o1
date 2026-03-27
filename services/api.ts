import { MOCK_CATEGORIES, MOCK_WALLPAPERS } from './mockData';

interface RequestConfig extends RequestInit {
    body?: any;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

export const apiRequest = async <T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log(`[Mock API] Request: ${endpoint}`, config.method || 'GET');

    // GET /categories
    if (endpoint.startsWith('/categories')) {
        return {
            success: true,
            data: MOCK_CATEGORIES as unknown as T
        };
    }

    // GET /wallpapers
    if (endpoint.startsWith('/wallpapers')) {
        // Simple manual parsing of categoryId from string instead of URL object for React Native compatibility if needed
        const categoryMatch = endpoint.match(/categoryId=([^&]+)/);
        const categoryId = categoryMatch ? categoryMatch[1] : null;
        
        let data = MOCK_WALLPAPERS;
        if (categoryId && categoryId !== 'All') {
            data = MOCK_WALLPAPERS.filter(w => w.category.id === categoryId);
        }

        return {
            success: true,
            data: data as unknown as T
        };
    }

    // POST /users
    if (endpoint.startsWith('/users')) {
        return {
            success: true,
            data: { message: 'User synchronized successfully (Mock)' } as unknown as T
        };
    }

    // Default error for unknown endpoints
    console.error(`[Mock API] Unknown endpoint: ${endpoint}`);
    return {
        success: false,
        data: null as unknown as T,
        message: 'Endpoint not found in mock API'
    };
};


