import axios from "axios";

import { useAuthStore } from "@/store/AuthStore";

// Base API URL - you should move this to an environment config
const BASE_URL = process.env.API_URL;

// Create axios instance for public endpoints
export const publicApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Create axios instance for authenticated endpoints
export const privateApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for private APIs
privateApi.interceptors.request.use(
    async (config) => {
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for private APIs
privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            // Handle token refresh or logout logic here
            // You might want to redirect to login or refresh token
        }
        return Promise.reject(error);
    }
);

// Response interceptor for public APIs
publicApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle general errors for public endpoints
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);
