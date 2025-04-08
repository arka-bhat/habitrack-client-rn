import type { UserInput, UserDB } from "@/types/user";

export const mockCreateUserAPI = async (data: UserInput): Promise<UserDB> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...data,
                id: `user-${Date.now()}`, // Mock server-generated ID
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                verified: false, // Default to unverified
            });
        }, 800); // Simulate network delay
    });
};
