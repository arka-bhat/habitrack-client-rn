import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Platform, Keyboard, KeyboardTypeOptions } from "react-native";

interface OTPInputProps {
    length?: number;
    onCodeFilled?: (code: string) => void;
    autoFocus?: boolean;
    keyboardType?: KeyboardTypeOptions;
    containerClassName?: string;
    inputClassName?: string;
}

const OTPInput = ({
    length = 6,
    onCodeFilled = (code: string) => {},
    autoFocus = true,
    keyboardType = "number-pad",
    containerClassName,
    inputClassName,
}: OTPInputProps) => {
    const [code, setCode] = useState(Array(length).fill(""));
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRefs = useRef<TextInput[]>([]);

    // This handles iOS autofill from SMS
    useEffect(() => {
        // Add listener for iOS OTP autofill
        if (Platform.OS === "ios") {
            const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
                // Only focus first input if no inputs are currently focused
                const isAnyInputFocused = inputRefs.current.some(
                    (ref) => ref && ref.isFocused && ref.isFocused()
                );

                if (!isAnyInputFocused && inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            });

            return () => {
                keyboardDidShowListener.remove();
            };
        }
    }, []);

    const handleTextChange = (text: string, index: number): void => {
        if (text.length > 1) {
            // If pasting the entire code at once (e.g., from iOS autofill suggestion)
            const pastedCode = text.slice(0, length).split("");
            const newCode = [...code];

            for (let i = 0; i < pastedCode.length; i++) {
                if (i + index < length) {
                    newCode[i + index] = pastedCode[i];
                }
            }

            setCode(newCode);

            // Check if all fields are filled
            if (newCode.every((digit) => digit !== "")) {
                onCodeFilled(newCode.join(""));
                Keyboard.dismiss();
            } else if (index + pastedCode.length < length) {
                inputRefs.current[index + pastedCode.length].focus();
            }
        } else {
            // Regular single digit input
            const newCode = [...code];
            newCode[index] = text;
            setCode(newCode);

            // Auto focus next input
            if (text && index < length - 1) {
                inputRefs.current[index + 1].focus();
            }

            // Call onCodeFilled if all digits are entered
            if (newCode.every((digit) => digit !== "") && newCode.length === length) {
                onCodeFilled(newCode.join(""));
                Keyboard.dismiss();
            }
        }
    };

    const handleKeyPress = (event: { nativeEvent: { key: string } }, index: number): void => {
        // Handle backspace to move to previous input
        if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            // Move focus to previous input when pressing backspace on empty field
            inputRefs.current[index - 1].focus();

            // Clear previous digit (optional behavior)
            const newCode = [...code];
            newCode[index - 1] = "";
            setCode(newCode);
        }
    };

    const handleFocus = (index: number): void => {
        // Set the currently focused input index
        setFocusedIndex(index);
    };

    const handleBlur = (): void => {
        // Clear focused index when input loses focus
        setFocusedIndex(-1);
    };

    return (
        <View className={`flex-row justify-between w-full ${containerClassName}`}>
            {Array(length)
                .fill(0)
                .map((_, index) => (
                    <TextInput
                        key={index}
                        ref={(ref: TextInput | null) => {
                            if (ref) inputRefs.current[index] = ref;
                        }}
                        className={`
                            w-[45px] h-[45px] 
                            border border-[#d0d0d0] rounded-lg
                            text-center text-xl font-base-medium
                            ${code[index] ? " border-light-tertiary-500" : ""}
                            ${
                                focusedIndex === index
                                    ? "border-2 border-light-primary-400 dark:border-dark-primary-500 "
                                    : ""
                            }
                            ${inputClassName}
                        `}
                        value={code[index]}
                        onChangeText={(text) => handleTextChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => handleFocus(index)}
                        onBlur={handleBlur}
                        keyboardType={keyboardType}
                        maxLength={length} // This allows pasting the entire code
                        selectTextOnFocus
                        autoFocus={autoFocus && index === 0}
                        textContentType={Platform.OS === "ios" ? "oneTimeCode" : "none"} // Enable iOS OTP autofill
                        autoComplete={Platform.OS === "ios" ? "one-time-code" : "sms-otp"}
                    />
                ))}
        </View>
    );
};

export default OTPInput;
