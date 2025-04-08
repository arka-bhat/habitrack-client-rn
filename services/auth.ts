export const mockSendOtp = async (phoneNumber: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true); // Simulate successful OTP sending
        }, 800); // 800ms delay to simulate network latency
    });
};

export const mockVerifyOtp = async (phoneNumber: string, code: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true); // Simulate successful verification
        }, 800); // 800ms delay to simulate network latency
    });
};
export const mockResendOtp = async (): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true); // Simulate successful resend
        }, 800); // 800ms delay to simulate network latency
    });
};
