import { PropertyDB, PropertyInput } from "@/types/property";

export const mockCreatePropertyAPI = async (data: PropertyInput): Promise<PropertyDB> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...data,
                id: `mock-${Date.now()}`, // Simulated server-generated ID
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }, 800); // 800ms delay to simulate network latency
    });
};

export const mockUpdatePropertyAPI = async (
    id: string,
    data: PropertyInput
): Promise<PropertyDB> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...data,
                id,
                createdAt: "2023-01-01T00:00:00Z", // Mock existing created date
                updatedAt: new Date().toISOString(),
            });
        }, 800); // Consistent 800ms delay
    });
};
